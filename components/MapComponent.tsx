
import React, { useEffect, useRef, useState } from 'react';
import { Incident, Team, Sensor } from '../types';
import { Layers, Maximize, Minimize, BrainCircuit, Fan, Radar, Map as MapIcon, Info, Users, ShieldAlert, Navigation } from 'lucide-react';

// Access global Leaflet instance
const L = (window as any).L;

// --- LEGEND COLORS & STYLES ---
const STYLES = {
  // Routes per Ghayath Specs
  ROUTE_PRIMARY: { color: "#22C55E", dash: undefined, weight: 6, opacity: 0.95, label: "مسار مرجّح" }, // Green
  ROUTE_SECONDARY: { color: "#EAB308", dash: undefined, weight: 5, opacity: 0.85, label: "مسار متوسط" }, // Yellow
  ROUTE_TERTIARY: { color: "#F97316", dash: "6, 6", weight: 4, opacity: 0.80, label: "مسار بديل" }, // Orange Dashed
  
  // Teams
  GROUND: { color: "#60A5FA", dash: undefined, weight: 4, opacity: 0.95 },
  VOLUNTEER: { color: "#A855F7", dash: "10, 4", weight: 4, opacity: 0.92 },
  DRONE: { color: "#F43F5E", dash: "2, 6", weight: 3, opacity: 0.85 },
  
  // Zones
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
    name: 'Google Satellite', // Mapped to Esri World Imagery as proxy
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri'
  },
  roadmap: {
    name: 'Google Maps', // Mapped to CartoDB Dark as proxy
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: 'CartoDB'
  },
  terrain: {
    name: 'Google Terrain', // Mapped to Esri World Topo as proxy
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
    markers_last_seen: [],
    markers_city: [],
    routes: [], // Holds all 3 path types
    teams: [],
    sensors: [],
    risk: []
  });

  const [activeLayer, setActiveLayer] = useState<'satellite' | 'terrain' | 'roadmap'>('satellite');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  
  // Layer Visibility
  const [visibleLayers, setVisibleLayers] = useState({
    routes: true,
    teams: true,
    risk: true,
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

  const generateMockTeamRoute = (center: {lat: number, lng: number}, steps = 5, spread = 0.005) => {
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
    layersRef.current = { markers_last_seen: [], markers_city: [], routes: [], teams: [], sensors: [], risk: [] };

    let bounds = L.latLngBounds([]);
    let hasPoints = false;

    // 1. Render Incidents (Markers & Routes)
    incidents.forEach(incident => {
        if (!incident.coords) return; // Strict Check
        hasPoints = true;
        const lastSeenLatLng = [incident.coords.lat, incident.coords.lng];
        bounds.extend(lastSeenLatLng);

        // A) Last Seen Marker (Red Pin)
        const isCritical = incident.health_profile.risk_level === 'حرج';
        const pinColor = isCritical ? '#ef4444' : '#22c55e';
        const pinIcon = L.divIcon({
            className: 'custom-pin-icon',
            html: `
              <div style="position: relative; width: 20px; height: 20px;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: ${pinColor}; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>
                <div style="position: absolute; top: 5px; left: 5px; width: 6px; height: 6px; background: white; border-radius: 50%;"></div>
                ${isCritical ? '<div style="position: absolute; top: -5px; left: -5px; width: 30px; height: 30px; background: rgba(239,68,68,0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>' : ''}
              </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 20], // Tip of pin
            popupAnchor: [0, -25]
        });

        const pinMarker = L.marker(lastSeenLatLng, { icon: pinIcon }).addTo(map);
        
        // Popup
        const popupContent = document.createElement('div');
        popupContent.dir = "rtl";
        popupContent.className = "min-w-[220px] text-right font-sans p-1";
        popupContent.innerHTML = `
            <div class="mb-2 border-b border-gray-200 pb-2">
                <h3 class="font-bold text-sm text-gray-900">${incident.missing_name}</h3>
                <p class="text-[10px] text-gray-500">آخر مشاهدة: ${incident.city}</p>
            </div>
            <div class="flex flex-wrap gap-1 mb-3">
                <span class="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[9px] border">${incident.terrain_type}</span>
                <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] border border-blue-100">${incident.weather_context}</span>
                <span class="px-2 py-0.5 rounded ${isCritical ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'} text-[9px] border font-bold">${incident.health_profile.risk_level}</span>
            </div>
            <button id="btn-details-${incident.id}" class="w-full bg-gray-900 text-white text-xs py-1.5 rounded hover:bg-gray-800 transition-colors">فتح تفاصيل البلاغ</button>
        `;
        pinMarker.bindPopup(popupContent);
        pinMarker.on('popupopen', () => {
            const btn = document.getElementById(`btn-details-${incident.id}`);
            if (btn) btn.onclick = () => onMarkerClick && onMarkerClick(incident);
        });
        layersRef.current.markers_last_seen.push(pinMarker);

        // B) City Anchor Marker (Green Dot)
        if (incident.cityCoords) {
            const cityLatLng = [incident.cityCoords.lat, incident.cityCoords.lng];
            const cityIcon = L.divIcon({
                className: 'custom-city-icon',
                html: `<div style="width: 8px; height: 8px; background: #10B981; border: 1px solid white; border-radius: 50%; box-shadow: 0 0 4px #10B981;"></div>`,
                iconSize: [8, 8],
                iconAnchor: [4, 4]
            });
            const cityMarker = L.marker(cityLatLng, { icon: cityIcon, interactive: false }).addTo(map);
            layersRef.current.markers_city.push(cityMarker);
        }

        // C) Predictive Paths (Ghayath AI) - Exactly 3 Routes
        if (visibleLayers.routes && incident.ai_profile?.predicted_paths) {
            incident.ai_profile.predicted_paths.forEach((path) => {
                if(!path.points || path.points.length === 0) return;
                const pathLatLngs = path.points.map(p => [p.lat, p.lng]);
                
                let style = STYLES.ROUTE_TERTIARY; // Default
                if (path.type === 'primary') style = STYLES.ROUTE_PRIMARY;
                else if (path.type === 'secondary') style = STYLES.ROUTE_SECONDARY;

                const poly = L.polyline(pathLatLngs, {
                    color: style.color,
                    weight: style.weight,
                    opacity: style.opacity,
                    dashArray: style.dash,
                    lineCap: 'round',
                    lineJoin: 'round'
                }).addTo(map);
                
                // Detailed Tooltip
                poly.bindTooltip(`
                    <div class="text-right">
                        <b>${path.label}</b> (${path.confidence}%)<br/>
                        <span class="text-[9px]">تقدير الزمن: ${path.timeEstimate}</span>
                    </div>
                `, { sticky: true, direction: 'auto' });
                
                layersRef.current.routes.push(poly);
            });
        }

        // D) Risk Radius
        if (visibleLayers.risk) {
            const radius = calculateRiskRadius(incident);
            const circle = L.circle(lastSeenLatLng, {
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
    if (visibleLayers.teams) {
        teams.forEach(team => {
            if (!team.coords) return;
            const latLng = [team.coords.lat, team.coords.lng];
            bounds.extend(latLng);

            // Ground/Volunteer/Drone Logic
            let style = STYLES.GROUND;
            let label = "فريق أرضي";
            let dash = undefined;

            if (team.type === 'volunteer') { style = STYLES.VOLUNTEER; label = "فريق تطوعي"; dash = STYLES.VOLUNTEER.dash; }
            else if (team.type === 'drone') { style = STYLES.DRONE; label = "درون"; dash = STYLES.DRONE.dash; }

            // Path
            const pathPts = generateMockTeamRoute(team.coords);
            const poly = L.polyline(pathPts, {
                color: style.color,
                weight: style.weight,
                opacity: style.opacity,
                dashArray: dash
            }).addTo(map);
            layersRef.current.teams.push(poly);

            // Icon
            let iconHtml = '';
            if (team.type === 'drone') {
                iconHtml = `
                  <div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); border-radius: 50%; border: 1px solid ${style.color}; box-shadow: 0 0 10px ${style.color};">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${style.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c.5-2.5 3-3.5 5-2 1.5 1 1.5 3.5.5 5-1.5 2-4 2-5.5.5"/><path d="M12 12c-.5 2.5-3 3.5-5 2-1.5-1-1.5-3.5-.5-5 1.5-2 4-2 5.5-.5"/><path d="M12 12c2.5.5 3.5 3 2 5-1 1.5-3.5 1.5-5 .5-2-1.5-2-4-.5-5.5"/><path d="M12 12c-2.5-.5-3.5-3-2-5 1-1.5 3.5-1.5 5-.5 2 1.5 2 4 .5 5.5"/></svg>
                  </div>
                `;
            } else {
                iconHtml = `<div style="background: ${style.color}; color: white; border-radius: 4px; padding: 2px 4px; font-size: 8px; font-weight: bold; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${label}</div>`;
            }

            const icon = L.divIcon({ 
                className: '', 
                html: iconHtml, 
                iconSize: team.type === 'drone' ? [24, 24] : [50, 15], 
                iconAnchor: team.type === 'drone' ? [12, 12] : [25, 20] 
            });
            const marker = L.marker(latLng, { icon, interactive: false }).addTo(map);
            layersRef.current.teams.push(marker);
        });
    }

    // 3. Sensors
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
            const targetMarker = layersRef.current.markers_last_seen.find((m: any) => {
                const ll = m.getLatLng();
                return Math.abs(ll.lat - target.coords.lat) < 0.0001 && Math.abs(ll.lng - target.coords.lng) < 0.0001;
            });
            if(targetMarker) setTimeout(() => targetMarker.openPopup(), 1600);
        }
    } else if (hasPoints && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [80, 80], maxZoom: 12 });
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
          <div className="absolute top-16 left-4 z-[1000] w-64 bg-[#0c1008]/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl animate-in slide-in-from-left-2">
              <h4 className="text-[10px] text-gray-500 font-bold uppercase mb-2">إظهار / إخفاء</h4>
              <div className="space-y-1">
                  {[
                      { id: 'routes', label: 'مسارات غياث AI', icon: BrainCircuit, color: STYLES.ROUTE_PRIMARY.color },
                      { id: 'teams', label: 'فرق البحث (أرضي/جوي)', icon: Users, color: STYLES.GROUND.color },
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
                      <span className="text-[10px] text-gray-300">مسار مرجّح (أعلى دقة) - AI</span>
                      <div className="w-12 h-1.5 rounded-full" style={{ background: STYLES.ROUTE_PRIMARY.color }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-300">مسار متوسط (دقة متوسطة) - AI</span>
                      <div className="w-12 h-1.5 rounded-full" style={{ background: STYLES.ROUTE_SECONDARY.color }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-300">مسار بديل (احتمال ضعيف) - AI</span>
                      <div className="w-12 h-1.5 rounded-full border-b-2 border-dashed" style={{ borderColor: STYLES.ROUTE_TERTIARY.color }}></div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-2">
                      <span className="text-[10px] text-gray-300 flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>آخر مشاهدة</span>
                      <span className="text-[10px] text-gray-300 flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div>المدينة</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-1 pt-1">
                      <div className="flex flex-col items-center gap-1">
                          <div className="w-4 h-1 bg-blue-400 rounded"></div>
                          <span className="text-[9px] text-gray-400">فريق أرضي</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                          <Fan size={14} className="text-rose-500" />
                          <span className="text-[9px] text-gray-400">درون</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                          <Radar size={14} className="text-teal-400" />
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
