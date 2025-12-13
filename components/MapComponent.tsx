
import React, { useEffect, useRef, useState } from 'react';
import { Incident, Team, Sensor } from '../types';
import { Layers, Maximize, Minimize, BrainCircuit, Fan, Radar, Map as MapIcon, Info, Users, ShieldAlert, Navigation } from 'lucide-react';

// Access global Leaflet instance
const L = (window as any).L;

// --- LEGEND COLORS & STYLES ---
const STYLES = {
  AI_HIGH: { color: "#22C55E", dash: undefined, weight: 4, opacity: 0.95 },
  AI_MEDIUM: { color: "#F59E0B", dash: undefined, weight: 4, opacity: 0.85 },
  AI_LOW: { color: "#EF4444", dash: "6, 6", weight: 4, opacity: 0.80 },
  GROUND: { color: "#60A5FA", dash: undefined, weight: 4, opacity: 0.95 },
  VOLUNTEER: { color: "#A855F7", dash: "10, 4", weight: 4, opacity: 0.92 },
  DRONE: { color: "#F43F5E", dash: "2, 6", weight: 3, opacity: 0.85 },
  RISK: { color: "#FF4C4C", dash: "4, 8", weight: 2, opacity: 0.12 }
};

interface MapComponentProps {
  incidents: Incident[];
  teams?: Team[];
  sensors?: Sensor[];
  onMarkerClick?: (incident: Incident) => void;
  onTeamClick?: (team: Team) => void;
  interactive?: boolean;
  focusedIncidentId?: string | null;
  showHeatmap?: boolean;
}

const TILE_LAYERS = {
  satellite: {
    name: 'أقمار صناعية',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri'
  },
  roadmap: {
    name: 'خرائط',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: 'CartoDB'
  },
  terrain: {
    name: 'تضاريس',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri'
  }
};

const MapComponent: React.FC<MapComponentProps> = ({ 
  incidents, 
  teams = [],
  sensors = [],
  onMarkerClick, 
  onTeamClick,
  interactive = true,
  focusedIncidentId,
  showHeatmap = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<{ [key: string]: any[] }>({
    markers: [],
    ai_high: [],
    ai_medium: [],
    ai_low: [],
    ground: [],
    volunteer: [],
    drone: [],
    risk: [],
    security: [],
    sensors: []
  });

  const [activeLayer, setActiveLayer] = useState<'satellite' | 'terrain' | 'roadmap'>('satellite');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  
  // Layer Visibility State
  const [visibleLayers, setVisibleLayers] = useState({
    ai: true,
    ground: true,
    volunteer: true,
    drone: true,
    risk: true,
    security: true,
    sensors: true
  });

  // Calculate Risk Radius
  const calculateRiskRadius = (incident: Incident) => {
    let baseKm = 2;
    baseKm += incident.last_seen_hours_ago * 0.05;
    if (incident.health_profile.risk_level === 'حرج') baseKm -= 0.5;
    if (incident.terrain_type === 'جبال') baseKm -= 0.3;
    if (incident.terrain_type === 'صحراء') baseKm += 0.4;
    return Math.max(1.0, Math.min(6.0, baseKm)) * 1000;
  };

  const generateMockRoute = (center: {lat: number, lng: number}, steps = 5, spread = 0.005) => {
    const points = [];
    let current = { ...center };
    current.lat += (Math.random() - 0.5) * spread;
    current.lng += (Math.random() - 0.5) * spread;
    points.push([current.lat, current.lng]);

    for (let i = 0; i < steps; i++) {
        current.lat += (Math.random() - 0.5) * (spread / 2);
        current.lng += (Math.random() - 0.5) * (spread / 2);
        points.push([current.lat, current.lng]);
    }
    return points;
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;
    if (!L) return;

    const map = L.map(mapContainerRef.current, {
      center: [24.7136, 46.6753], 
      zoom: 6,
      zoomControl: false, 
      attributionControl: false,
      dragging: interactive,
      touchZoom: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      boxZoom: interactive,
      keyboard: interactive
    });

    L.tileLayer(TILE_LAYERS[activeLayer].url, {
      attribution: TILE_LAYERS[activeLayer].attribution,
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) mapInstanceRef.current.removeLayer(layer);
    });
    L.tileLayer(TILE_LAYERS[activeLayer].url, {
      attribution: TILE_LAYERS[activeLayer].attribution,
      maxZoom: 19
    }).addTo(mapInstanceRef.current);
  }, [activeLayer]);

  // Main Rendering Loop
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear all layers
    Object.values(layersRef.current).forEach((layerGroup: any) => {
        layerGroup.forEach((layer: any) => layer.remove());
    });
    layersRef.current = { markers: [], ai_high: [], ai_medium: [], ai_low: [], ground: [], volunteer: [], drone: [], risk: [], security: [], sensors: [] };

    let bounds = L.latLngBounds([]);
    let hasPoints = false;

    // 1. Render Incidents & AI Paths
    incidents.forEach(incident => {
        if (!incident.coords || !incident.coords.lat || !incident.coords.lng) return;
        hasPoints = true;
        const latLng = [incident.coords.lat, incident.coords.lng];
        bounds.extend(latLng);

        // Marker
        const isCritical = incident.health_profile.risk_level === 'حرج';
        const markerColor = isCritical ? '#ef4444' : '#22c55e';
        const markerIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${markerColor}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${markerColor}; ${isCritical ? 'animation: marker-pulse 2s infinite;' : ''}"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });

        const marker = L.marker(latLng, { icon: markerIcon }).addTo(map);
        
        // Enhanced Popup
        const popupContent = document.createElement('div');
        popupContent.dir = "rtl";
        popupContent.className = "min-w-[220px] text-right font-sans p-1";
        popupContent.innerHTML = `
            <div class="mb-2 border-b border-gray-200 pb-2">
                <h3 class="font-bold text-sm text-gray-900">${incident.missing_name}</h3>
                <p class="text-[10px] text-gray-500">${incident.city} · ${incident.region}</p>
            </div>
            <div class="flex flex-wrap gap-1 mb-3">
                <span class="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[9px] border">${incident.terrain_type}</span>
                <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] border border-blue-100">${incident.weather_context}</span>
                <span class="px-2 py-0.5 rounded ${isCritical ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'} text-[9px] border font-bold">${incident.health_profile.risk_level}</span>
            </div>
            <div class="flex items-center gap-2 mb-2 text-[10px] text-gray-600">
               <span class="font-bold">ثقة غياث AI:</span>
               <span class="font-mono">${incident.ai_profile.ghayath_confidence}%</span>
            </div>
            <div class="flex gap-2">
                <button id="btn-details-${incident.id}" class="flex-1 bg-gray-900 text-white text-xs py-1.5 rounded hover:bg-gray-800 transition-colors">فتح تفاصيل البلاغ</button>
            </div>
        `;
        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
            const btn = document.getElementById(`btn-details-${incident.id}`);
            if (btn) btn.onclick = () => onMarkerClick && onMarkerClick(incident);
        });
        layersRef.current.markers.push(marker);

        // AI Paths
        if (visibleLayers.ai && incident.ai_profile?.predicted_paths) {
            incident.ai_profile.predicted_paths.forEach((path) => {
                if(!path.points || path.points.length === 0) return;
                const pathLatLngs = path.points.map(p => [p.lat, p.lng]);
                
                let style = STYLES.AI_LOW;
                let layerKey = 'ai_low';
                
                if (path.confidence >= 80) { style = STYLES.AI_HIGH; layerKey = 'ai_high'; }
                else if (path.confidence >= 50) { style = STYLES.AI_MEDIUM; layerKey = 'ai_medium'; }

                const poly = L.polyline(pathLatLngs, {
                    color: style.color,
                    weight: style.weight,
                    opacity: style.opacity,
                    dashArray: style.dash,
                    lineCap: 'round'
                }).addTo(map);
                
                poly.bindTooltip(`دقة التنبؤ: ${path.confidence}%`, { sticky: true });
                layersRef.current[layerKey].push(poly);
            });
        }

        // Risk Radius
        if (visibleLayers.risk) {
            const radius = calculateRiskRadius(incident);
            const circle = L.circle(latLng, {
                color: STYLES.RISK.color,
                fillColor: STYLES.RISK.color,
                fillOpacity: STYLES.RISK.opacity,
                weight: STYLES.RISK.weight,
                dashArray: STYLES.RISK.dash
            }).addTo(map);
            layersRef.current.risk.push(circle);
        }
    });

    // 2. Render Teams & Drones
    teams.forEach(team => {
        if (!team.coords) return;
        const latLng = [team.coords.lat, team.coords.lng];
        bounds.extend(latLng);

        // Ground Teams (Blue Route)
        if (team.type === 'ground' && visibleLayers.ground) {
            const pathPts = generateMockRoute(team.coords);
            const poly = L.polyline(pathPts, {
                color: STYLES.GROUND.color,
                weight: STYLES.GROUND.weight,
                opacity: STYLES.GROUND.opacity
            }).addTo(map);
            layersRef.current.ground.push(poly);

            const iconHtml = `<div style="background: ${STYLES.GROUND.color}; color: white; border-radius: 4px; padding: 2px 4px; font-size: 8px; font-weight: bold; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">فريق أرضي</div>`;
            const icon = L.divIcon({ className: '', html: iconHtml, iconSize: [50, 15], iconAnchor: [25, 20] });
            const marker = L.marker(latLng, { icon, interactive: false }).addTo(map);
            layersRef.current.ground.push(marker);
        }

        // Volunteer Teams (Purple Route)
        if (team.type === 'rescue' && visibleLayers.volunteer) {
            const pathPts = generateMockRoute(team.coords);
            const poly = L.polyline(pathPts, {
                color: STYLES.VOLUNTEER.color,
                weight: STYLES.VOLUNTEER.weight,
                opacity: STYLES.VOLUNTEER.opacity,
                dashArray: STYLES.VOLUNTEER.dash
            }).addTo(map);
            layersRef.current.volunteer.push(poly);

            const iconHtml = `<div style="background: ${STYLES.VOLUNTEER.color}; color: white; border-radius: 4px; padding: 2px 4px; font-size: 8px; font-weight: bold; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">فريق تطوعي</div>`;
            const icon = L.divIcon({ className: '', html: iconHtml, iconSize: [50, 15], iconAnchor: [25, 20] });
            const marker = L.marker(latLng, { icon, interactive: false }).addTo(map);
            layersRef.current.volunteer.push(marker);
        }

        // Drones (Rose Path + Icon)
        if (team.type === 'drone' && visibleLayers.drone) {
            const pathPts = generateMockRoute(team.coords);
            const poly = L.polyline(pathPts, {
                color: STYLES.DRONE.color,
                weight: STYLES.DRONE.weight,
                opacity: STYLES.DRONE.opacity,
                dashArray: STYLES.DRONE.dash
            }).addTo(map);
            layersRef.current.drone.push(poly);

            // Drone Icon using SVG
            const droneIcon = L.divIcon({
                className: 'custom-drone-icon',
                html: `
                  <div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); border-radius: 50%; border: 1px solid ${STYLES.DRONE.color}; box-shadow: 0 0 10px ${STYLES.DRONE.color};">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${STYLES.DRONE.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c.5-2.5 3-3.5 5-2 1.5 1 1.5 3.5.5 5-1.5 2-4 2-5.5.5"/><path d="M12 12c-.5 2.5-3 3.5-5 2-1.5-1-1.5-3.5-.5-5 1.5-2 4-2 5.5-.5"/><path d="M12 12c2.5.5 3.5 3 2 5-1 1.5-3.5 1.5-5 .5-2-1.5-2-4-.5-5.5"/><path d="M12 12c-2.5-.5-3.5-3-2-5 1-1.5 3.5-1.5 5-.5 2 1.5 2 4 .5 5.5"/></svg>
                  </div>
                `,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });
            const marker = L.marker(latLng, { icon: droneIcon, interactive: false }).addTo(map);
            layersRef.current.drone.push(marker);
        }
    });

    // 3. Security Units (Map Only)
    if (visibleLayers.security) {
        // Mock some security units around incidents
        incidents.forEach(inc => {
            if (inc.status === 'قيد البحث' && Math.random() > 0.5) {
                const lat = inc.coords.lat - 0.005;
                const lng = inc.coords.lng + 0.005;
                const iconHtml = `<div style="background: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3); color: black;">🛡️</div>`;
                const icon = L.divIcon({ html: iconHtml, iconSize: [20, 20], iconAnchor: [10, 10] });
                const marker = L.marker([lat, lng], { icon, interactive: false }).addTo(map);
                layersRef.current.security.push(marker);
            }
        });
    }

    // 4. Sensors
    if (visibleLayers.sensors && sensors.length > 0) {
        sensors.forEach(sensor => {
            const color = sensor.status === 'alert' ? '#ef4444' : '#2dd4bf';
            const iconHtml = `<div style="background: #1a1c15; width: 8px; height: 8px; border-radius: 50%; border: 2px solid ${color};"></div>`;
            const icon = L.divIcon({ html: iconHtml, iconSize: [8, 8], iconAnchor: [4, 4] });
            const marker = L.marker([sensor.coords.lat, sensor.coords.lng], { icon }).addTo(map);
            layersRef.current.sensors.push(marker);
        });
    }

    // Fit Bounds logic
    if (focusedIncidentId) {
        const target = incidents.find(i => i.id === focusedIncidentId);
        if (target && target.coords) {
            map.flyTo([target.coords.lat, target.coords.lng], 13, { duration: 1.5 });
            const targetMarker = layersRef.current.markers.find((m: any) => {
                const ll = m.getLatLng();
                return Math.abs(ll.lat - target.coords.lat) < 0.0001 && Math.abs(ll.lng - target.coords.lng) < 0.0001;
            });
            if(targetMarker) setTimeout(() => targetMarker.openPopup(), 1600);
        }
    } else if (hasPoints && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }

  }, [incidents, teams, sensors, activeLayer, visibleLayers, focusedIncidentId, showHeatmap]);

  const toggleLayer = (key: keyof typeof visibleLayers) => {
      setVisibleLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full h-full relative group rounded-2xl overflow-hidden border border-white/10 min-h-[360px] md:min-h-[420px] lg:min-h-[520px]">
      <div ref={mapContainerRef} className="w-full h-full bg-[#1a1c15] z-0" />
      
      {/* 1) Top-Left Controls: Layers & Legend Buttons */}
      {interactive && (
        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
            <button 
                onClick={() => setShowLayerMenu(!showLayerMenu)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md shadow-lg transition-all border border-white/10 text-xs font-bold ${showLayerMenu ? 'bg-lime-500 text-black' : 'bg-black/60 text-white hover:bg-black/80'}`}
            >
                <Layers size={14} />
                الطبقات والمسارات
            </button>
            <button 
                onClick={() => setShowLegend(!showLegend)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md shadow-lg transition-all border border-white/10 text-xs font-bold ${showLegend ? 'bg-white text-black' : 'bg-black/60 text-white hover:bg-black/80'}`}
            >
                <Info size={14} />
                دليل الألوان
            </button>
        </div>
      )}

      {/* Layer Menu Panel */}
      {showLayerMenu && interactive && (
          <div className="absolute top-16 left-4 z-[1000] w-60 bg-[#0c1008]/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl animate-in slide-in-from-left-2">
              <h4 className="text-[10px] text-gray-500 font-bold uppercase mb-2">إظهار / إخفاء</h4>
              <div className="space-y-1">
                  {[
                      { id: 'ai', label: 'مسارات غياث AI', icon: BrainCircuit, color: STYLES.AI_HIGH.color },
                      { id: 'ground', label: 'مسار فريق أرضي', icon: Users, color: STYLES.GROUND.color },
                      { id: 'volunteer', label: 'مسار فرق تطوعية', icon: Navigation, color: STYLES.VOLUNTEER.color },
                      { id: 'drone', label: 'مراقبة درون', icon: Fan, color: STYLES.DRONE.color },
                      { id: 'security', label: 'توجيه أمني', icon: ShieldAlert, color: '#fff' },
                      { id: 'risk', label: 'نطاق الخطر', icon: ShieldAlert, color: STYLES.RISK.color },
                      { id: 'sensors', label: 'مستشعرات', icon: Radar, color: '#2dd4bf' },
                  ].map((item) => (
                      <button 
                          key={item.id}
                          onClick={() => toggleLayer(item.id as any)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${visibleLayers[item.id as keyof typeof visibleLayers] ? 'bg-white/10 text-white' : 'text-gray-500 hover:bg-white/5'}`}
                      >
                          <div className="flex items-center gap-2">
                              <item.icon size={12} style={{ color: visibleLayers[item.id as keyof typeof visibleLayers] ? item.color : 'currentColor' }} />
                              <span>{item.label}</span>
                          </div>
                          {visibleLayers[item.id as keyof typeof visibleLayers] && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                      </button>
                  ))}
              </div>
              <div className="h-px bg-white/10 my-2"></div>
              <h4 className="text-[10px] text-gray-500 font-bold uppercase mb-2">نوع الخريطة</h4>
              <div className="flex gap-1">
                  {Object.entries(TILE_LAYERS).map(([key, layer]) => (
                      <button 
                          key={key}
                          onClick={() => setActiveLayer(key as any)}
                          className={`flex-1 py-1.5 text-[10px] rounded border transition-colors ${activeLayer === key ? 'bg-lime-500/20 text-lime-400 border-lime-500/30' : 'bg-transparent text-gray-400 border-white/10 hover:bg-white/5'}`}
                      >
                          {layer.name}
                      </button>
                  ))}
              </div>
          </div>
      )}

      {/* Persistent Legend Panel */}
      {showLegend && interactive && (
          <div className="absolute bottom-6 left-6 z-[1000] w-72 bg-[#0c1008]/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl animate-in slide-in-from-bottom-2 hidden sm:block">
              <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <MapIcon size={14} className="text-gray-400" />
                      دليل المسارات والألوان
                  </h4>
                  <button onClick={() => setShowLegend(false)} className="text-gray-500 hover:text-white"><Minimize size={12}/></button>
              </div>
              <div className="space-y-3">
                  <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-300">مسار محتمل (أعلى دقة) - AI</span>
                      <div className="w-12 h-1 rounded-full" style={{ background: STYLES.AI_HIGH.color }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-300">مسار محتمل (دقة متوسطة) - AI</span>
                      <div className="w-12 h-1 rounded-full" style={{ background: STYLES.AI_MEDIUM.color }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-300">مسار مستبعد (نفي) - AI</span>
                      <div className="w-12 h-1 rounded-full border-b-2 border-dashed" style={{ borderColor: STYLES.AI_LOW.color }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-300">مسار الفريق الأرضي</span>
                      <div className="w-12 h-1 rounded-full" style={{ background: STYLES.GROUND.color }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-300">مسار الفرق التطوعية</span>
                      <div className="w-12 h-1 rounded-full border-b-2 border-dashed" style={{ borderColor: STYLES.VOLUNTEER.color }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-300">مراقبة الدرون (خريطة فقط)</span>
                      <div className="w-12 h-1 rounded-full border-b-2 border-dashed" style={{ borderColor: STYLES.DRONE.color }}></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/5">
                      <div className="flex flex-col items-center gap-1">
                          <span className="text-xl">🛡️</span>
                          <span className="text-[9px] text-gray-400">أمن عام</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                          <Fan size={16} className="text-rose-500" />
                          <span className="text-[9px] text-gray-400">درون</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                          <Radar size={16} className="text-teal-400" />
                          <span className="text-[9px] text-gray-400">مستشعر</span>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Zoom Controls */}
      {interactive && (
        <div className="absolute bottom-6 right-6 z-[1000] flex flex-col rounded-xl overflow-hidden glass-panel border border-white/10 shadow-lg">
           <button onClick={() => mapInstanceRef.current?.zoomIn()} className="w-10 h-10 hover:bg-white/10 flex items-center justify-center text-white"><Maximize size={18} /></button>
           <div className="h-[1px] bg-white/10 w-full"></div>
           <button onClick={() => mapInstanceRef.current?.zoomOut()} className="w-10 h-10 hover:bg-white/10 flex items-center justify-center text-white"><Minimize size={18} /></button>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
