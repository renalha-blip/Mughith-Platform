
import React, { useState } from 'react';
import { Incident } from '../types';
import MapComponent from '../components/MapComponent';
import { ArrowRight, MapPin, Activity, Wind, BrainCircuit, User, FileText, HeartPulse, AlertTriangle, Users, ChevronDown, Phone, MessageSquare, ShieldAlert, Radio, CheckCircle, CloudRain, Clock, Mountain, Siren, Share2 } from 'lucide-react';
import { getStatusColor, getRiskColor, formatDate } from '../utils';

interface IncidentDetailsProps {
  incident: Incident;
  onBack: () => void;
  onSecurityDispatch?: (incident: Incident) => void;
}

const IncidentDetails: React.FC<IncidentDetailsProps> = ({ incident, onBack, onSecurityDispatch }) => {
  const [expandedCompanionIndex, setExpandedCompanionIndex] = useState<number | null>(null);

  // Companion Probability Logic
  const companionsProb = incident.companions && incident.companions.length > 0 
      ? Math.min(85, 40 + (incident.companions.length * 15)) 
      : 15;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pr-2 pb-10">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center hover:bg-white/10 transition-colors text-white"
            >
              <ArrowRight size={20} />
            </button>
            <div>
               <div className="flex flex-wrap items-center gap-3 mb-1">
                 <h2 className="text-2xl font-bold text-white">{incident.missing_name}</h2>
                 <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(incident.status)}`}>
                   {incident.status}
                 </span>
                 <span className={`text-xs px-2 py-0.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 flex items-center gap-1`}>
                   <AlertTriangle size={12} />
                   {incident.health_profile.risk_level}
                 </span>
               </div>
               <p className="text-gray-400 text-sm flex items-center gap-1">
                 <MapPin size={14} />
                 {incident.city} · منطقة {incident.region}
               </p>
            </div>
        </div>
        
        <div className="flex gap-3">
             <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2.5 rounded-xl font-bold transition-all border border-white/10">
                <Share2 size={18} />
                <span className="hidden sm:inline">مشاركة خاضعة لموافقة النظام</span>
             </button>
             <button 
                onClick={() => onSecurityDispatch && onSecurityDispatch(incident)}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20"
             >
                <ShieldAlert size={18} />
                توجيه أمني
            </button>
        </div>
      </div>
      
      {/* Header Badges Row - ALL BADGES VISIBLE HERE */}
      <div className="flex gap-3 mb-6 flex-wrap animate-in slide-in-from-top-2">
         {incident.connections.absher && <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/20 flex items-center gap-2 font-bold"><CheckCircle size={14}/> أبشر متصل</span>}
         {incident.connections.tawakkalna && <span className="text-xs bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-lg border border-purple-500/20 flex items-center gap-2 font-bold"><Activity size={14}/> توكلنا متصل</span>}
         {incident.connections.sehaty && <span className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg border border-red-500/20 flex items-center gap-2 font-bold"><HeartPulse size={14}/> صحتي متصل</span>}
         {incident.connections.ncm && <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/20 flex items-center gap-2 font-bold"><CloudRain size={14}/> الأرصاد (NCM)</span>}
         {incident.is_security_routed && <span className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg border border-red-500/20 flex items-center gap-2 font-bold"><ShieldAlert size={14}/> توجيه أمني مفعل</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Right Column: Info & Map */}
        <div className="col-span-1 lg:col-span-8 space-y-6">
          
           {/* Missing Person Info Group */}
           <div className="glass-panel p-6 rounded-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
                  <div className="flex items-center gap-2 text-blue-400">
                    <User size={20} />
                    <h3 className="text-lg font-bold text-white">بيانات المفقود</h3>
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                    <label className="text-xs text-gray-500 block mb-1">الاسم الكامل</label>
                    <p className="text-white font-medium">{incident.missing_name}</p>
                 </div>
                 <div>
                    <label className="text-xs text-gray-500 block mb-1">العمر</label>
                    <p className="text-white font-medium">{incident.age} سنة</p>
                 </div>
                 <div>
                    <label className="text-xs text-gray-500 block mb-1">الجنس</label>
                    <p className="text-white font-medium">{incident.gender}</p>
                 </div>
                 <div className="col-span-full">
                    <label className="text-xs text-gray-500 block mb-1">الوصف</label>
                    <p className="text-gray-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                      {incident.missing_description || "لا يوجد وصف متوفر."}
                    </p>
                 </div>
              </div>
           </div>

           {/* Location Group */}
           <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 text-orange-400">
                <MapPin size={20} />
                <h3 className="text-lg font-bold text-white">الموقع وظروف الفقد</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                 <div>
                    <label className="text-xs text-gray-500 block mb-1">المنطقة</label>
                    <p className="text-white font-medium">{incident.region}</p>
                 </div>
                 <div>
                    <label className="text-xs text-gray-500 block mb-1">المدينة</label>
                    <p className="text-white font-medium">{incident.city}</p>
                 </div>
                 <div>
                    <label className="text-xs text-gray-500 block mb-1">التضاريس</label>
                    <p className="text-white font-medium flex items-center gap-1">
                      <Activity size={14} className="text-orange-400"/>
                      {incident.terrain_type}
                    </p>
                 </div>
                 <div>
                    <label className="text-xs text-gray-500 block mb-1">الطقس</label>
                    <p className="text-white font-medium flex items-center gap-1">
                      <Wind size={14} className="text-blue-400"/>
                      {incident.weather_context}
                    </p>
                 </div>
                 <div className="col-span-full">
                    <label className="text-xs text-gray-500 block mb-1">آخر مشاهدة</label>
                    <p className="text-white font-medium">منذ {incident.last_seen_hours_ago} ساعة ({formatDate(incident.report_date)})</p>
                 </div>
              </div>
              
              <div className="h-[350px] w-full rounded-xl overflow-hidden border border-white/10 relative">
                 <MapComponent incidents={[incident]} interactive={false} showHeatmap={true} />
                 <div className="absolute top-4 right-4 bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs text-purple-300 border border-purple-500/30 font-bold z-[1000]">
                    مسارات التنبؤ (غياث AI)
                 </div>
              </div>
           </div>
        </div>

        {/* Left Column: Health & AI & Companions */}
        <div className="col-span-1 lg:col-span-4 space-y-6">
           
           {/* IoT Sensors Panel */}
           {incident.ai_profile.sensor_analysis && (
               <div className="glass-panel p-6 rounded-2xl bg-teal-900/10 border-teal-500/20">
                   <div className="flex items-center gap-2 mb-4 text-teal-400">
                       <Radio size={20} className="animate-pulse" />
                       <h3 className="text-lg font-bold text-white">تحليل المستشعرات – غياث AI</h3>
                   </div>
                   <div className="bg-black/30 p-4 rounded-xl border border-white/5 mb-3">
                       <p className="text-sm text-gray-200 leading-relaxed">
                           {incident.ai_profile.sensor_analysis}
                       </p>
                   </div>
                   <div className="flex items-center justify-between text-[10px] text-teal-300/70">
                       <span>تحديث: منذ 5 دقائق</span>
                       <span className="flex items-center gap-1"><Siren size={10} /> تنبيه نشط</span>
                   </div>
               </div>
           )}

           {/* Health Profile */}
           <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 text-red-400">
                <HeartPulse size={20} />
                <h3 className="text-lg font-bold text-white">الملف الصحي – صحتي</h3>
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="text-xs text-gray-500 block mb-1">مستوى الخطورة الصحي</label>
                    <p className={`font-bold ${getRiskColor(incident.health_profile.risk_level)}`}>
                       {incident.health_profile.risk_level}
                    </p>
                 </div>
                 <div>
                    <label className="text-xs text-gray-500 block mb-2">الأمراض المزمنة</label>
                    <div className="flex flex-wrap gap-2">
                      {incident.health_profile.chronic_diseases && incident.health_profile.chronic_diseases.length > 0 ? (
                        incident.health_profile.chronic_diseases.map((d, i) => (
                          <span key={i} className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-lg text-sm">
                            {d}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">لا يوجد سجلات</span>
                      )}
                    </div>
                 </div>
              </div>
           </div>

           {/* AI Analysis (Advanced) */}
           <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl -z-10"></div>
              
              <div className="flex items-center gap-2 mb-4 text-purple-400">
                <BrainCircuit size={20} />
                <h3 className="text-lg font-bold text-white">غياث AI – تحليل متقدم</h3>
              </div>
              
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20 text-center">
                       <span className="block text-2xl font-bold text-white mb-1">{incident.ai_profile.ghayath_risk_score}%</span>
                       <span className="text-xs text-purple-300">درجة الخطورة</span>
                    </div>
                    <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20 text-center">
                       <span className="block text-2xl font-bold text-white mb-1">{incident.ai_profile.ghayath_confidence}%</span>
                       <span className="text-xs text-purple-300">ثقة النموذج</span>
                    </div>
                 </div>
                 
                 {incident.ai_profile.survival_estimate && (
                     <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                         <Clock size={18} className="text-yellow-400" />
                         <div>
                             <p className="text-[10px] text-gray-400">نافذة النجاة المتوقعة</p>
                             <p className="text-sm font-bold text-white">{incident.ai_profile.survival_estimate}</p>
                         </div>
                     </div>
                 )}

                 {/* Cross Analysis */}
                 <div className="space-y-2">
                     <label className="text-xs text-gray-500 font-bold block">تحليل التقاطع (صحة × تضاريس × طقس)</label>
                     <div className="flex flex-wrap gap-2">
                         <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded flex items-center gap-1">
                             <HeartPulse size={10} className="text-red-400"/> + <Mountain size={10} className="text-orange-400"/>
                             = خطر إجهاد عالي
                         </span>
                         <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded flex items-center gap-1">
                             <Wind size={10} className="text-blue-400"/> 
                             = صعوبة تتبع الأثر
                         </span>
                     </div>
                 </div>
                 
                 <div>
                    <label className="text-xs text-gray-500 block mb-2">رؤية النظام</label>
                    <p className="text-sm text-gray-300 italic bg-black/20 p-3 rounded-lg border-l-2 border-purple-500">
                       "{incident.ai_profile.ghayath_short_line}"
                    </p>
                 </div>
              </div>
           </div>

           {/* Companions Section */}
           <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Users size={20} />
                    <h3 className="text-lg font-bold text-white">المرافقين</h3>
                  </div>
                  <span className="text-xs bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/20 font-mono">
                    {incident.companions?.length || 0}
                  </span>
              </div>
              
              <div className="mb-4">
                  <label className="text-xs text-gray-500 block mb-1">هل يوجد مرافقين؟</label>
                  <p className="text-white font-medium">{incident.companions && incident.companions.length > 0 ? 'نعم' : 'لا'}</p>
              </div>

              {incident.companions && incident.companions.length > 0 && (
                  <div className="space-y-3">
                     {incident.companions.map((comp, idx) => {
                        const isExpanded = expandedCompanionIndex === idx;
                        return (
                          <div key={idx} className="bg-white/5 rounded-xl border border-white/5 overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/10">
                             <button 
                                onClick={() => setExpandedCompanionIndex(isExpanded ? null : idx)}
                                className="w-full flex items-center justify-between p-3 transition-colors"
                             >
                                <div className="flex items-center gap-3">
                                   <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-sm font-bold border border-white/10 shadow-lg">
                                      {comp.name.trim().charAt(0)}
                                   </div>
                                   <div className="text-right">
                                      <p className="text-sm font-bold text-white leading-tight">{comp.name}</p>
                                      <p className="text-[10px] text-gray-400">{comp.relation}</p>
                                   </div>
                                </div>
                                <ChevronDown 
                                   size={16} 
                                   className={`text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-blue-400' : ''}`}
                                />
                             </button>
                             
                             <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden">
                                   <div className="p-3 pt-0 border-t border-white/5 space-y-2 mt-2">
                                      {comp.phone ? (
                                          <div className="flex items-center gap-2 text-xs text-gray-300 bg-black/20 p-2 rounded-lg border border-white/5">
                                             <Phone size={14} className="text-green-400" />
                                             <span dir="ltr" className="font-mono">{comp.phone}</span>
                                          </div>
                                      ) : null}
                                      {comp.notes && (
                                          <div className="flex items-start gap-2 text-xs text-gray-300 bg-black/20 p-2 rounded-lg border border-white/5">
                                             <MessageSquare size={14} className="text-yellow-400 mt-0.5 shrink-0" />
                                             <span className="leading-relaxed">{comp.notes}</span>
                                          </div>
                                      )}
                                   </div>
                                </div>
                             </div>
                          </div>
                        );
                     })}
                     <div className="mt-4 pt-3 border-t border-white/10">
                        <div className="flex justify-between items-center text-xs">
                             <span className="text-gray-400">احتمال زيادة العدد:</span>
                             <span className="text-yellow-400 font-bold">{companionsProb}%</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full mt-1">
                             <div className="bg-yellow-500 h-full rounded-full" style={{width: `${companionsProb}%`}}></div>
                        </div>
                     </div>
                  </div>
               )}
           </div>

        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;
