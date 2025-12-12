
import React, { useMemo } from 'react';
import { Incident } from '../types';
import MapComponent from '../components/MapComponent';
import { CloudRain, Navigation } from 'lucide-react';
import { generateAssetsForIncident } from '../utils';

interface MapScreenProps {
  incidents: Incident[];
  focusedIncidentId?: string | null;
}

const MapScreen: React.FC<MapScreenProps> = ({ incidents, focusedIncidentId }) => {
  
  // Generate mock teams/drones and sensors for ALL active incidents to satisfy requirements
  const { teams, sensors } = useMemo(() => {
     let allTeams: any[] = [];
     let allSensors: any[] = [];

     incidents.forEach(incident => {
         // Only generate assets for active cases (not closed)
         if (incident.status !== 'مغلق') {
             const assets = generateAssetsForIncident(incident);
             allTeams = [...allTeams, ...assets.teams];
             allSensors = [...allSensors, ...assets.sensors];
         }
     });

     return { teams: allTeams, sensors: allSensors };
  }, [incidents]);

  return (
    <div className="h-[75vh] lg:h-[calc(100vh-140px)] w-full rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl">
      {/* Map visualization with Heatmap (AI paths) enabled by default in MapScreen context */}
      <MapComponent 
        incidents={incidents} 
        teams={teams}
        sensors={sensors}
        focusedIncidentId={focusedIncidentId}
        showHeatmap={true}
      />

      {/* Floating Controls */}
      <div className="absolute top-6 right-6 flex flex-col gap-3">
        <button className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center text-white hover:bg-white/10 hover:text-blue-400 transition-all shadow-lg" title="الطقس">
            <CloudRain size={20} />
        </button>
        <button className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center text-white hover:bg-white/10 hover:text-orange-400 transition-all shadow-lg" title="تمركز الفرق">
            <Navigation size={20} />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 right-6 glass-panel p-4 rounded-xl shadow-xl max-w-xs z-[1000] hidden sm:block">
          <h4 className="text-xs font-bold text-gray-400 mb-2">مفتاح الخريطة</h4>
          <div className="space-y-2">
             <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                 <span className="text-xs text-white">بلاغ قيد البحث (نشط)</span>
             </div>
             <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                 <span className="text-xs text-white">بلاغ جديد / لم يتم التأكيد</span>
             </div>
             
             {/* Ghayath AI Paths Legend - Specific Request */}
             <div className="flex items-center gap-2 pt-2 border-t border-white/10 mt-2">
                 <div className="flex items-center relative h-3 w-6 justify-center">
                    <span className="w-full h-0.5 bg-[#39ff14] z-10 shadow-[0_0_8px_#39ff14]"></span>
                 </div>
                 <span className="text-xs text-purple-300 font-bold">مسار تنبؤ غياث AI</span>
             </div>
             
             {/* Security Drones Legend - Monitoring Overlay Only */}
             <div className="flex items-center gap-2 mt-1">
                 <div className="w-4 h-4 border border-blue-400 rounded flex items-center justify-center bg-blue-900/30 rotate-45">
                    <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                 </div>
                 <span className="text-xs text-white">مسارات الدرون (جهات أمنية)</span>
             </div>
          </div>
      </div>
    </div>
  );
};

export default MapScreen;
