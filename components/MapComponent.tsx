
import React, { useEffect, useRef, useState } from 'react';
import { Incident, Team, Sensor } from '../types';
import { Layers, Maximize, Minimize, BrainCircuit, Fan, Radar, MapPin } from 'lucide-react';

// Access global Leaflet instance added via CDN in index.html
const L = (window as any).L;

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
    name: 'قمر صناعي',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri'
  },
  terrain: {
    name: 'تضاريس',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri'
  },
  roadmap: {
    name: 'خريطة رقمية',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: 'CartoDB'
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
  const markersRef = useRef<{ [key: string]: any }>({});
  const teamMarkersRef = useRef<{ [key: string]: any }>({});
  const sensorMarkersRef = useRef<{ [key: string]: any }>({});
  const aiLayersRef = useRef<any[]>([]); 
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'terrain' | 'roadmap'>('satellite');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [visualizeRisk, setVisualizeRisk] = useState(false);
  
  // Layer Visibility State
  const [showDrones, setShowDrones] = useState(true);
  const [showSensors, setShowSensors] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    if (!L) {
      console.error("Leaflet not loaded");
      return;
    }

    const map = L.map(mapContainerRef.current, {
      center: [24.7136, 46.6753], // Default center if no incidents
      zoom: 5,
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
      attribution: TILE_LAYERS[activeLayer].attribution
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Layer Switching
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    L.tileLayer(TILE_LAYERS[activeLayer].url, {
      attribution: TILE_LAYERS[activeLayer].attribution,
      maxZoom: 19
    }).addTo(mapInstanceRef.current);

  }, [activeLayer]);

  // Handle Markers (Incidents & Teams & Sensors) & Heatmap & AI Paths
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // --- 1. Incident Markers ---
    Object.values(markersRef.current).forEach((marker: any) => marker.remove());
    markersRef.current = {};

    // Clear old AI layers
    aiLayersRef.current.forEach((layer: any) => layer.remove());
    aiLayersRef.current = [];

    incidents.forEach(incident => {
        if (!incident.coords) return;

        const isCritical = incident.health_profile.risk_level === 'حرج' || incident.status === 'قيد البحث';
        let markerColor = isCritical ? '#ef4444' : '#eab308'; 

        if (visualizeRisk) {
            const score = incident.ai_profile.ghayath_risk_score;
            if (score >= 90) markerColor = '#ef4444';
            else if (score >= 75) markerColor = '#f97316';
            else if (score >= 50) markerColor = '#eab308';
            else markerColor = '#22c55e';
        }
        
        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="
              background-color: ${markerColor};
              width: 14px;
              height: 14px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 0 15px ${markerColor};
              ${(isCritical || (visualizeRisk && incident.ai_profile.ghayath_risk_score > 80)) ? 'animation: marker-pulse 2s infinite;' : ''}
              display: flex;
              align-items: center;
              justify-content: center;
            ">
                ${visualizeRisk ? `<span style="font-size: 8px; font-weight: bold; color: white;">${Math.floor(incident.ai_profile.ghayath_risk_score/10)}</span>` : ''}
            </div>
          `,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
          popupAnchor: [0, -10]
        });

        const marker = L.marker([incident.coords.lat, incident.coords.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <div dir="rtl" class="text-right font-sans min-w-[150px]">
              <h3 class="font-bold text-sm mb-1 text-black">${incident.missing_name}</h3>
              <p class="text-xs text-gray-700 mb-1 flex items-center gap-1 font-bold">
                 ${incident.city} · منطقة ${incident.region}
              </p>
              <p class="text-[10px] text-gray-500">${incident.terrain_type} - ${incident.weather_context}</p>
              <div class="flex items-center justify-between mt-2">
                  <div class="inline-block px-2 py-0.5 rounded-full text-[10px] border font-bold
                    ${incident.status === 'قيد البحث' ? 'bg-red-100 text-red-600 border-red-200' : 'bg-green-100 text-green-600 border-green-200'}">
                    ${incident.status}
                  </div>
              </div>
            </div>
          `);

        marker.on('click', () => {
            if (onMarkerClick) onMarkerClick(incident);
        });

        markersRef.current[incident.id] = marker;

        // Render AI Insights (Paths)
        const showAiLayers = showHeatmap || visualizeRisk;
        
        if (showAiLayers && (incident.status === 'قيد البحث' || incident.status === 'بلاغ جديد')) {
           const riskScore = incident.ai_profile.ghayath_risk_score;
           const baseRadius = riskScore * 50; 
           
           // Danger Zone Circle
           const hotCircle = L.circle([incident.coords.lat, incident.coords.lng], {
             color: '#ef4444', 
             fillColor: '#ef4444',
             fillOpacity: 0.1,
             radius: baseRadius,
             weight: 1,
             dashArray: '5, 5'
           }).addTo(map);
           
           aiLayersRef.current.push(hotCircle);

           // AI Predicted Paths
           if (incident.ai_profile.predicted_paths) {
               incident.ai_profile.predicted_paths.forEach((path: any) => {
                   let pathColor = '#39ff14'; // High confidence (Neon Green)
                   let dashArray = undefined;
                   let opacity = 1;

                   if (path.confidence < 50) {
                       pathColor = '#ef4444'; // Low
                       dashArray = '5, 10';
                       opacity = 0.6;
                   } else if (path.confidence <= 75) {
                       pathColor = '#eab308'; // Medium
                       dashArray = '8, 8';
                       opacity = 0.8;
                   }

                   const latlngs = path.points.map((p: any) => [p.lat, p.lng]);
                   
                   // Label Marker at the end of path
                   if (path.label === "مسار مرجح") {
                       const endPoint = latlngs[latlngs.length - 1];
                       const labelIcon = L.divIcon({
                           className: 'path-label',
                           html: `<div style="background: black; color: #39ff14; padding: 2px 6px; border-radius: 4px; border: 1px solid #39ff14; font-size: 10px; white-space: nowrap;">مسار تنبؤ (${path.confidence}%)</div>`,
                           iconSize: [100, 20],
                           iconAnchor: [50, -5]
                       });
                       const labelMarker = L.marker(endPoint, { icon: labelIcon }).addTo(map);
                       aiLayersRef.current.push(labelMarker);
                   }

                   // 1. Glow Layer (Thick, Low Opacity)
                   const glowLine = L.polyline(latlngs, {
                       color: pathColor,
                       weight: 8,
                       opacity: 0.25,
                       dashArray: dashArray,
                       lineCap: 'round'
                   }).addTo(map);
                   aiLayersRef.current.push(glowLine);

                   // 2. Main Line (Thin, High Opacity)
                   const polyline = L.polyline(latlngs, {
                       color: pathColor,
                       weight: 2.5,
                       opacity: opacity,
                       dashArray: dashArray
                   }).addTo(map);

                   // Bind specific label: "مسارات التنبؤ (غياث AI)" is the category
                   polyline.bindTooltip(`مسارات التنبؤ (غياث AI) - ${path.confidence}%`, { 
                       sticky: true,
                       direction: 'auto',
                       className: 'bg-black text-white border-0 text-xs px-2 py-1 rounded font-bold' 
                   });
                   
                   aiLayersRef.current.push(polyline);
               });
           }
        }
    });

    // --- 2. Team Markers (Including Drone Overlay) ---
    Object.values(teamMarkersRef.current).forEach((marker: any) => marker.remove());
    teamMarkersRef.current = {};

    teams.forEach(team => {
        // Drone visibility check
        if (team.type === 'drone' && !showDrones) return;
        if (!team.coords) return;

        const getTeamIconHTML = () => {
            let iconSvg = '';
            let iconColor = 'white';
            let borderColor = 'white';
            let pulseEffect = '';
            let iconBg = '#1a1c15';
            let rotation = 'rotate(45deg)';
            let innerRotation = 'rotate(-45deg)';

            switch (team.type) {
                case 'drone':
                    iconColor = '#60a5fa'; // Blue
                    borderColor = '#60a5fa';
                    // STRICT DRONE ICON
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c.5-2.5 3-3.5 5-2 1.5 1 1.5 3.5.5 5-1.5 2-4 2-5.5.5"/><path d="M12 12c-.5 2.5-3 3.5-5 2-1.5-1-1.5-3.5-.5-5 1.5-2 4-2 5.5-.5"/><path d="M12 12c2.5.5 3.5 3 2 5-1 1.5-3.5 1.5-5 .5-2-1.5-2-4-.5-5.5"/><path d="M12 12c-2.5-.5-3.5-3-2-5 1-1.5 3.5-1.5 5-.5 2 1.5 2 4 .5 5.5"/></svg>`;
                    break;
                case 'ground':
                case 'rescue':
                default:
                    iconColor = team.type === 'rescue' ? '#f472b6' : '#A0FFC2'; // Pink or Lime
                    borderColor = iconColor;
                    // STRICT GROUND TEAM ICON
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
                    break;
            }
            
            if (team.status === 'searching') {
                pulseEffect = 'animation: marker-pulse 2s infinite;';
            }

            return `
                <div style="
                    background-color: ${iconBg}; 
                    width: 32px; height: 32px; 
                    border-radius: 8px; 
                    border: 1px solid ${borderColor};
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                    position: relative;
                    transform: ${rotation};
                    ${pulseEffect}
                ">
                    <div style="transform: ${innerRotation}; display: flex; align-items: center; justify-content: center;">
                       ${iconSvg}
                    </div>
                </div>
            `;
        };

        const teamIcon = L.divIcon({
            className: 'custom-team-icon',
            html: getTeamIconHTML(),
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -20]
        });

        const marker = L.marker([team.coords.lat, team.coords.lng], { icon: teamIcon })
            .addTo(map)
            .bindTooltip(team.name, { 
                permanent: false, 
                direction: 'top', 
                className: 'bg-black/90 text-white border-0 text-xs px-2 py-1 rounded font-bold' 
            });

        marker.on('click', () => {
            if (onTeamClick) onTeamClick(team);
        });

        teamMarkersRef.current[team.id] = marker;
    });

    // --- 3. Sensor Markers ---
    Object.values(sensorMarkersRef.current).forEach((marker: any) => marker.remove());
    sensorMarkersRef.current = {};

    if (showSensors) {
        sensors.forEach(sensor => {
            if (!sensor.coords) return;

            let iconHtml = '';
            let markerColor = '#2dd4bf'; // Active (Teal)
            let glowClass = '';

            if (sensor.status === 'alert') {
                markerColor = '#ef4444'; // Alert (Red)
                glowClass = 'animation: marker-pulse 1.5s infinite;';
                // Alert Icon
                iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${markerColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`;
            } else if (sensor.status === 'offline') {
                markerColor = '#6b7280'; // Offline (Gray)
                // Offline Icon
                iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${markerColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" x2="22" y1="2" y2="22"/><path d="M8.5 8.5A6 6 0 0 1 12 8c.7 0 1.38.1 2 .28"/><path d="M5 5a10 10 0 0 1 12.29 2.25"/><path d="M2 2a14 14 0 0 1 18.18 5.43"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>`;
            } else {
                // Active Sensor
                glowClass = 'box-shadow: 0 0 10px rgba(45, 212, 191, 0.3);';
                iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${markerColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 7 1.4-1.4"/><path d="m17 17 1.4 1.4"/><path d="m7 7-1.4-1.4"/><path d="m7 17-1.4 1.4"/></svg>`;
            }

            const customIcon = L.divIcon({
                className: 'custom-sensor-icon',
                html: `
                <div style="
                    background-color: #1a1c15;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: 2px solid ${markerColor};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    ${glowClass}
                ">
                    ${iconHtml}
                </div>
                `,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                popupAnchor: [0, -10]
            });

            const marker = L.marker([sensor.coords.lat, sensor.coords.lng], { icon: customIcon })
                .addTo(map)
                .bindTooltip(`
                    <div style="text-align: right;">
                        <span style="font-weight: bold;">${sensor.metric_label || 'مستشعر'}</span><br/>
                        <span style="color: #9ca3af; font-size: 10px;">تحليل المستشعرات – غياث AI</span>
                    </div>
                `, {
                    direction: 'top',
                    className: 'bg-black/95 text-white border-0 rounded px-2 py-1 text-xs shadow-xl'
                });

            sensorMarkersRef.current[sensor.id] = marker;
        });
    }

  }, [incidents, teams, sensors, onMarkerClick, onTeamClick, showHeatmap, visualizeRisk, showDrones, showSensors]);

  // Handle Focus
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (focusedIncidentId) {
        const marker = markersRef.current[focusedIncidentId];
        const incident = incidents.find(i => i.id === focusedIncidentId);

        if (marker && incident) {
            mapInstanceRef.current.flyTo([incident.coords.lat, incident.coords.lng], 13, {
                duration: 1.5
            });
            marker.openPopup();
        }
    } else if (incidents.length > 0 && !focusedIncidentId) {
         // Fit bounds to show all incidents
         const group = L.featureGroup(Object.values(markersRef.current));
         if (group.getLayers().length > 0) {
             mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
         }
    }
  }, [focusedIncidentId, incidents]);


  return (
    <div className="w-full h-full relative group rounded-2xl overflow-hidden border border-white/10">
      <div ref={mapContainerRef} className="w-full h-full bg-[#1a1c15] z-0" />

      {interactive && (
        <div className="absolute bottom-6 left-6 flex flex-col gap-3 z-[1000]">
           <button
              onClick={() => setVisualizeRisk(!visualizeRisk)}
              className={`w-10 h-10 glass-panel rounded-xl flex items-center justify-center transition-all border border-white/10 shadow-lg
                  ${visualizeRisk ? 'bg-purple-600 text-white border-purple-500' : 'text-white hover:bg-white/10'}
              `}
              title="تحليل المخاطر (AI)"
           >
              <BrainCircuit size={20} />
           </button>

           <div className="relative">
               {showLayerMenu && (
                   <div className="absolute bottom-full left-0 mb-2 w-48 glass-panel rounded-xl p-2 flex flex-col gap-1 overflow-hidden animate-in slide-in-from-bottom-2 fade-in-50 shadow-2xl border border-white/10 bg-[#0c1008]/95 backdrop-blur-xl">
                      {/* Base Layers */}
                      <div className="px-2 py-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider">الخرائط الأساسية</div>
                      {Object.entries(TILE_LAYERS).map(([key, layer]) => (
                          <button
                              key={key}
                              onClick={() => { setActiveLayer(key as any); }}
                              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-right mb-1
                                  ${activeLayer === key 
                                      ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30' 
                                      : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'}
                              `}
                          >
                              {layer.name}
                          </button>
                      ))}

                      <div className="h-px bg-white/10 my-1"></div>

                      {/* Overlay Layers */}
                      <div className="px-2 py-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider">الطبقات الحية</div>
                      <button
                          onClick={() => setShowDrones(!showDrones)}
                          className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-right mb-1
                              ${showDrones ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-300 hover:bg-white/10'}
                          `}
                      >
                          <div className="flex items-center gap-2">
                             <Fan size={12} className={showDrones ? "animate-spin" : ""} />
                             درون أمني
                          </div>
                      </button>
                      <button
                          onClick={() => setShowSensors(!showSensors)}
                          className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-right
                              ${showSensors ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'text-gray-300 hover:bg-white/10'}
                          `}
                      >
                          <div className="flex items-center gap-2">
                             <Radar size={12} />
                             المستشعرات
                          </div>
                      </button>
                   </div>
               )}
               <button
                  onClick={() => setShowLayerMenu(!showLayerMenu)}
                  className={`w-10 h-10 glass-panel rounded-xl flex items-center justify-center transition-all border border-white/10 shadow-lg
                      ${showLayerMenu ? 'bg-lime-500 text-black border-lime-400' : 'text-white hover:bg-white/10'}
                  `}
                  title="الطبقات"
               >
                  <Layers size={20} />
               </button>
           </div>
  
           <div className="flex flex-col rounded-xl overflow-hidden glass-panel border border-white/10 shadow-lg">
               <button 
                  onClick={() => mapInstanceRef.current?.zoomIn()}
                  className="w-10 h-10 hover:bg-white/10 flex items-center justify-center text-white transition-colors active:bg-white/20"
               >
                  <Maximize size={18} />
               </button>
               <div className="h-[1px] bg-white/10 w-full"></div>
               <button 
                  onClick={() => mapInstanceRef.current?.zoomOut()}
                  className="w-10 h-10 hover:bg-white/10 flex items-center justify-center text-white transition-colors active:bg-white/20"
               >
                  <Minimize size={18} />
               </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
