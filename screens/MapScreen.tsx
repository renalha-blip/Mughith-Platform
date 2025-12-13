
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
  
  // Generate mock teams/drones and sensors for ALL active incidents
  const { teams, sensors } = useMemo(() => {
     let allTeams: any[] = [];
     let allSensors: any[] = [];

     incidents.forEach(incident => {
         if (incident.status !== 'مغلق') {
             const assets = generateAssetsForIncident(incident);
             allTeams = [...allTeams, ...assets.teams];
             allSensors = [...allSensors, ...assets.sensors];
         }
     });

     return { teams: allTeams, sensors: allSensors };
  }, [incidents]);

  return (
    <div className="h-[75vh] lg:h-[calc(100vh-140px)] w-full rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl min-h-[520px]">
      {/* Map visualization with Heatmap enabled */}
      <MapComponent 
        incidents={incidents} 
        teams={teams}
        sensors={sensors}
        focusedIncidentId={focusedIncidentId}
        showHeatmap={true}
        interactive={true}
      />

      {/* Floating Controls */}
      <div className="absolute top-6 right-6 flex flex-col gap-3 z-[900]">
        <button className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center text-white hover:bg-white/10 hover:text-blue-400 transition-all shadow-lg" title="الطقس">
            <CloudRain size={20} />
        </button>
        <button className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center text-white hover:bg-white/10 hover:text-orange-400 transition-all shadow-lg" title="تمركز الفرق">
            <Navigation size={20} />
        </button>
      </div>
    </div>
  );
};

export default MapScreen;
