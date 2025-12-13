
import React, { useState, useEffect, useMemo } from 'react';
import { Incident, Team } from '../types';
import MapComponent from '../components/MapComponent';
import { Fan, Users, Radio, Activity, Pause, Play, Target, ShieldAlert, Clock, ShieldCheck, Lock, Baby } from 'lucide-react';
import { getPersonCategory } from '../utils';

interface OperationsProps {
  incidents: Incident[];
  initialSelectedIncidentId?: string | null;
}

const generateMockTeams = (baseCoords: { lat: number, lng: number }): Team[] => {
    return [
        { id: 'T1', name: 'سرب الدرون الأمني 101', type: 'drone', status: 'standby', coords: { lat: baseCoords.lat + 0.005, lng: baseCoords.lng + 0.005 }, battery: 85 },
        { id: 'T2', name: 'فريق الإنقاذ الأرضي A', type: 'ground', status: 'searching', coords: { lat: baseCoords.lat - 0.005, lng: baseCoords.lng - 0.005 } },
        { id: 'T3', name: 'وحدة الاستطلاع الجوي', type: 'drone', status: 'searching', coords: { lat: baseCoords.lat + 0.008, lng: baseCoords.lng - 0.002 }, battery: 62 },
        { id: 'T4', name: 'فريق المشاة الجبلي B', type: 'ground', status: 'standby', coords: { lat: baseCoords.lat - 0.002, lng: baseCoords.lng + 0.008 } },
        { id: 'T5', name: 'جمعية غوث - فرقة 4', type: 'rescue', status: 'en-route', coords: { lat: baseCoords.lat - 0.012, lng: baseCoords.lng + 0.003 } },
    ];
};

const Operations: React.FC<OperationsProps> = ({ incidents, initialSelectedIncidentId }) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(initialSelectedIncidentId || (incidents[0]?.id || null));
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const selectedIncident = useMemo(() => incidents.find(i => i.id === selectedIncidentId), [incidents, selectedIncidentId]);

  useEffect(() => {
      if (selectedIncident) {
          setTeams(generateMockTeams(selectedIncident.coords));
      }
  }, [selectedIncident]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTeams(currentTeams => {
        const eligibleTeams = currentTeams.filter(t => t.type === 'ground' || t.type === 'rescue');
        if (eligibleTeams.length === 0) return currentTeams;
        const randomTeam = eligibleTeams[Math.floor(Math.random() * eligibleTeams.length)];
        return currentTeams.map(team => {
          if (team.id === randomTeam.id) {
            const newStatus = team.status === 'searching' ? 'standby' : 'searching';
            return { ...team, status: newStatus };
          }
          return team;
        });
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const controlTeams = useMemo(() => teams.filter(t => t.type === 'ground' || t.type === 'rescue'), [teams]);

  if (!selectedIncident) return (
      <div className="h-full flex items-center justify-center text-gray-500 flex-col gap-2">
          <Activity size={32} className="opacity-50" />
          <p>لا يوجد بلاغ محدد، يرجى اختيار بلاغ من القائمة.</p>
      </div>
  );

  return (
    <div className="h-full flex flex-col xl:grid xl:grid-cols-12 gap-6 overflow-y-auto xl:overflow-hidden pb-4">
        {/* Left Panel: Active Incidents List */}
        <div className="order-2 xl:order-1 col-span-12 xl:col-span-4 h-[350px] xl:h-full flex flex-col">
            <div className="glass-panel p-4 rounded-2xl flex-1 flex flex-col min-h-0 border border-white/10">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                    <Radio size={20} className="text-lime-500" />
                    البلاغات النشطة
                </h3>
                <div className="overflow-y-auto custom-scrollbar space-y-2 flex-1 pr-1">
                    {incidents.filter(i => i.status !== 'مغلق').map(incident => {
                        const personCategory = getPersonCategory(incident.age, incident.gender);
                        const isChild = incident.age < 18;
                        return (
                        <button
                            key={incident.id}
                            onClick={() => setSelectedIncidentId(incident.id)}
                            className={`w-full p-4 rounded-xl border text-right transition-all group flex items-start gap-3 ${
                                selectedIncidentId === incident.id 
                                ? 'bg-lime-500/10 border-lime-500/30 ring-1 ring-lime-500/20' 
                                : 'bg-white/5 border-white/5 hover:bg-white/10'
                            }`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${incident.status === 'قيد البحث' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold text-sm ${selectedIncidentId === incident.id ? 'text-white' : 'text-gray-200'}`}>
                                            {incident.missing_name}
                                        </span>
                                        {isChild && (
                                            <span className="bg-yellow-500/20 text-yellow-300 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 border border-yellow-500/30">
                                                <Baby size={10} />
                                                {personCategory}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-mono">{incident.id.split('-')[2]}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                                    <span>{incident.city}</span>
                                    <span className={`px-2 py-0.5 rounded border text-[10px] ${
                                        incident.health_profile.risk_level === 'حرج' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 
                                        'border-gray-500/30 text-gray-400'
                                    }`}>
                                        {incident.health_profile.risk_level}
                                    </span>
                                </div>
                                {selectedIncidentId === incident.id && (
                                    <div className="flex gap-2 mt-3 animate-in slide-in-from-top-1">
                                        <button className="flex-1 bg-lime-500/10 hover:bg-lime-500/20 text-lime-400 border border-lime-500/20 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">
                                            <Target size={12} />
                                            تحديد الموقع
                                        </button>
                                    </div>
                                )}
                            </div>
                        </button>
                    )})}
                </div>
            </div>
        </div>

        {/* Right Panel: Map + Controls */}
        <div className="order-1 xl:order-2 col-span-12 xl:col-span-8 flex flex-col gap-4 min-w-[520px]">
            
            {/* Top: Map (Enforcing min-height strictness) */}
            <div className="flex-1 glass-panel p-1 rounded-2xl border border-white/10 overflow-hidden relative min-h-[560px]">
                <MapComponent 
                    incidents={[selectedIncident]} 
                    teams={teams}
                    focusedIncidentId={selectedIncident.id}
                    interactive={true}
                    onTeamClick={(team) => {
                        if (team.type !== 'drone') setSelectedTeamId(team.id);
                    }}
                    showHeatmap={true}
                />
                
                {/* Live Feed Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-[1000] hidden md:flex">
                    <div className="bg-black/80 backdrop-blur border border-white/10 rounded-xl p-3 w-56 shadow-2xl">
                         <div className="flex items-center gap-2 mb-2 text-lime-400 text-xs font-bold border-b border-white/10 pb-2">
                             <Activity size={14} />
                             ملخص الميدان
                         </div>
                         <div className="space-y-2">
                             {controlTeams.slice(0, 3).map(team => (
                                 <div key={team.id} className="flex justify-between items-center text-[10px]">
                                     <div className="flex items-center gap-2">
                                         <Users size={10} className="text-gray-400"/>
                                         <span className="text-gray-300">{team.name}</span>
                                     </div>
                                     <span className={`px-1.5 py-0.5 rounded ${team.status === 'searching' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                         {team.status === 'searching' ? 'نشط' : 'استعداد'}
                                     </span>
                                 </div>
                             ))}
                             {teams.filter(t => t.type === 'drone').length > 0 && (
                                <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-blue-300 flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <Fan size={10} className="animate-spin" />
                                        <span>تغطية جوية (أمني)</span>
                                    </div>
                                    <span className="text-white font-mono">{teams.filter(t => t.type === 'drone').length}</span>
                                </div>
                             )}
                         </div>
                    </div>
                </div>
            </div>

            {/* Bottom: Controls */}
            <div className="h-auto xl:h-64 grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
                {/* 1. Ground Teams Management */}
                <div className="glass-panel p-5 rounded-2xl flex flex-col h-72 md:h-auto">
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="text-white font-bold flex items-center gap-2 text-sm">
                             <Users size={16} className="text-[#A0FFC2]" />
                             إدارة الفرق الأرضية
                         </h3>
                         <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">ميداني / تطوعي</span>
                     </div>

                     <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                         {controlTeams.map(team => (
                             <div 
                                key={team.id} 
                                className={`p-3 rounded-xl border transition-all ${
                                    selectedTeamId === team.id 
                                    ? 'bg-white/10 border-white/20' 
                                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                                }`}
                                onClick={() => setSelectedTeamId(team.id)}
                             >
                                 <div className="flex justify-between items-center">
                                     <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 rounded-lg flex items-center justify-center border bg-[#1a1c15] border-[#A0FFC2]/20">
                                             <Users size={18} className="text-[#A0FFC2]" />
                                         </div>
                                         <div>
                                             <h4 className="text-xs font-bold text-white">{team.name}</h4>
                                             <div className="flex items-center gap-2">
                                                <span className={`w-1.5 h-1.5 rounded-full ${team.status === 'searching' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                                <span className="text-[10px] text-gray-500 uppercase font-mono">{team.id}</span>
                                             </div>
                                         </div>
                                     </div>
                                     <button className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                                         {team.status === 'standby' ? <Play size={12} /> : <Pause size={12} />}
                                     </button>
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>

                {/* 2. Security Dispatch Log */}
                <div className="glass-panel p-5 rounded-2xl flex flex-col bg-red-900/5 border-red-500/10 h-72 md:h-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold flex items-center gap-2 text-sm">
                            <ShieldAlert size={16} className="text-red-400" />
                            التوجيه الأمني
                        </h3>
                        <div className="flex items-center gap-1.5 text-[10px] bg-red-500/10 text-red-300 px-2 py-0.5 rounded border border-red-500/20">
                            <Lock size={10} />
                            نظام آمن
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                         <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-white font-mono">{selectedIncident.id}</span>
                                <span className="text-[10px] text-gray-400">{selectedIncident.city} / {selectedIncident.region}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-200 border border-red-500/30 flex items-center gap-1">
                                    <ShieldCheck size={10} />
                                    مرسل للدفاع المدني
                                </span>
                                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                    <Clock size={10} />
                                    منذ 15 دقيقة
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Operations;
