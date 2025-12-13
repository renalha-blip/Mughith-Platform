
import React from 'react';
import { MapPin, Activity, Wind, BrainCircuit, User, Map, FileText, ShieldAlert, AlertTriangle, AlertCircle, ShieldCheck, Radio, Skull, Users, ArrowUpRight } from 'lucide-react';
import { Incident } from '../types';
import { getStatusColor, getRiskColor, getPersonCategory } from '../utils';

interface IncidentCardProps {
  incident: Incident;
  onShowOnMap?: (incident: Incident) => void;
  onDispatchTeams?: (incident: Incident) => void;
  onOpenDetails?: (incident: Incident) => void;
  onSecurityRouteClick?: (incident: Incident) => void;
  onViewSensors?: (incident: Incident) => void;
}

const IncidentCard: React.FC<IncidentCardProps> = ({ 
  incident, 
  onShowOnMap, 
  onDispatchTeams, 
  onOpenDetails, 
  onSecurityRouteClick,
  onViewSensors
}) => {

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'حرج': return <Skull size={14} className="animate-pulse" />;
      case 'مرتفع': return <AlertTriangle size={14} />;
      case 'متوسط': return <AlertCircle size={14} />;
      default: return <ShieldCheck size={14} />;
    }
  };

  const hasSensorAlert = incident.ai_profile.sensor_analysis !== undefined;
  const personCategory = getPersonCategory(incident.age, incident.gender);

  return (
    <div 
        onClick={() => onOpenDetails && onOpenDetails(incident)}
        className="glass-panel rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 group flex flex-col gap-5 hover:scale-[1.02] hover:border-lime-500 hover:shadow-2xl hover:shadow-lime-900/10 cursor-pointer relative overflow-hidden"
    >
      {/* Risk Stripe */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
          incident.health_profile.risk_level === 'حرج' ? 'bg-gradient-to-r from-red-600 to-red-400' :
          incident.health_profile.risk_level === 'مرتفع' ? 'bg-gradient-to-r from-orange-600 to-orange-400' :
          incident.health_profile.risk_level === 'متوسط' ? 'bg-gradient-to-r from-yellow-500 to-yellow-300' :
          'bg-gradient-to-r from-green-500 to-green-300'
      }`}></div>

      {/* Header */}
      <div className="flex justify-between items-start mt-1">
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(incident.status)}`}>
                    {incident.status}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">{incident.id.split('-')[2]}</span>
                
                {incident.is_security_routed && (
                    <span className="flex items-center gap-1 text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full border border-blue-500/30">
                        <ShieldCheck size={8} />
                        توجيه أمني مفعل
                    </span>
                )}
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-lime-400 transition-colors truncate leading-tight">
                {incident.missing_name}
            </h3>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
                <MapPin size={12} />
                <span>{incident.city} · {incident.region}</span>
            </div>
        </div>
        
        {/* Risk Badge */}
        <div className={`flex flex-col items-end`}>
            <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border bg-opacity-10 ${getRiskColor(incident.health_profile.risk_level).replace('text-', 'border-').replace('text-', 'bg-')} ${getRiskColor(incident.health_profile.risk_level)}`}>
                {getRiskIcon(incident.health_profile.risk_level)}
                {incident.health_profile.risk_level}
            </div>
        </div>
      </div>

      {/* Demographics & Connections (Inside Card Only as requested) */}
      <div className="flex flex-col gap-2.5 text-xs text-gray-300 border-y border-white/5 py-4">
          <div className="flex items-center gap-2 mb-1">
              <User size={14} className={incident.age < 18 ? "text-yellow-400" : "text-blue-400"} />
              <span className={`font-medium ${incident.age < 18 ? "text-yellow-100" : ""}`}>
                  {incident.age} سنة • {personCategory}
              </span>
          </div>
          {/* Connection Badges */}
          <div className="flex gap-2 flex-wrap">
              {incident.connections.absher && <span className="text-[9px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20">أبشر متصل</span>}
              {incident.connections.tawakkalna && <span className="text-[9px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">توكلنا متصل</span>}
              {incident.connections.sehaty && <span className="text-[9px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">صحتي متصل</span>}
              <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">الأرصاد (NCM)</span>
          </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-1">
                <Wind size={14} className="text-blue-400" />
                <span className="text-[10px] text-gray-400">الطقس</span>
            </div>
            <span className="text-xs font-bold text-white">{incident.weather_context}</span>
        </div>
        <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-1">
                <Activity size={14} className="text-orange-400" />
                <span className="text-[10px] text-gray-400">التضاريس</span>
            </div>
            <span className="text-xs font-bold text-white">{incident.terrain_type}</span>
        </div>
      </div>

      {/* AI Insight */}
      <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-3.5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-purple-400">
                <BrainCircuit size={14} />
                <span className="text-xs font-bold">غياث AI</span>
            </div>
            <span className="text-xs font-mono text-purple-300 font-bold">{incident.ai_profile.ghayath_risk_score}%</span>
        </div>
        <p className="text-[10px] text-gray-400 leading-snug line-clamp-2">
            {incident.ai_profile.ghayath_short_line}
        </p>
      </div>

      {/* Footer Actions - Removed Drone/Ground, Kept Security/Map/Details */}
      <div className="mt-auto grid grid-cols-3 gap-3">
        <button 
            onClick={(e) => { e.stopPropagation(); onOpenDetails && onOpenDetails(incident); }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 border border-white/5 transition-colors"
        >
            <FileText size={14} />
            التفاصيل
        </button>

        <button 
            onClick={(e) => { e.stopPropagation(); onShowOnMap && onShowOnMap(incident); }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-xs font-medium text-blue-400 border border-blue-500/20 transition-colors"
        >
            <Map size={14} />
            الخريطة
        </button>
        
        <button 
            onClick={(e) => { e.stopPropagation(); onSecurityRouteClick && onSecurityRouteClick(incident); }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-bold text-red-400 border border-red-500/20 transition-colors"
            title="توجيه أمني"
        >
            <ShieldAlert size={14} />
            توجيه أمني
        </button>
      </div>
    </div>
  );
};

export default IncidentCard;
