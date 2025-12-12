
import React from 'react';
import { Incident } from '../types';
import MapComponent from '../components/MapComponent';
import { BrainCircuit, Activity, Wind, HeartPulse, Clock, Users, ShieldAlert, Cpu, Map } from 'lucide-react';

interface GhayathAIProps {
  incidents: Incident[];
}

const GhayathAI: React.FC<GhayathAIProps> = ({ incidents }) => {
  const activeIncidents = incidents.filter(i => i.status === 'قيد البحث');
  const criticalCount = activeIncidents.filter(i => i.health_profile.risk_level === 'حرج').length;

  const PIPELINE_STEPS = [
    { 
        id: 'bio', 
        label: 'التحليل الحيوي', 
        icon: HeartPulse, 
        status: 'complete', 
        metric: '100% دقة',
        desc: 'تم تحليل السجلات الطبية وعوامل الخطر وتأثيرها على البقاء.'
    },
    { 
        id: 'move', 
        label: 'توقع المسار', 
        icon: Activity, 
        status: 'processing', 
        metric: 'جاري العمل...',
        desc: 'محاكاة 12,400 سيناريو محتمل للحركة بناءً على آخر نقطة.'
    },
    { 
        id: 'terrain', 
        label: 'قراءة التضاريس', 
        icon: Map, 
        status: 'complete', 
        metric: 'تم المسح',
        desc: 'دمج خرائط الارتفاعات وبيانات التربة لتحديد مناطق التباطؤ.'
    },
    { 
        id: 'weather', 
        label: 'المخاطر الجوية', 
        icon: Wind, 
        status: 'complete', 
        metric: 'مباشر',
        desc: 'تحليل تأثير سرعة الرياح والرؤية الأفقية على عمليات البحث.'
    },
    { 
        id: 'clock', 
        label: 'ساعة النجاة', 
        icon: Clock, 
        status: 'pending', 
        metric: 'في الانتظار',
        desc: 'بانتظار اكتمال نموذج الحركة لتقدير الزمن المتبقي.'
    },
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pb-20 pr-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
         <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(147,51,234,0.3)]">
                 <BrainCircuit size={32} className="text-purple-400 animate-pulse" />
             </div>
             <div>
                 <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                     مركز غياث للذكاء الاصطناعي
                     <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 font-mono">V3.1 BETA</span>
                 </h2>
                 <p className="text-gray-400 text-sm">محرك التحليل التنبؤي وتوجيه عمليات البحث والإنقاذ</p>
             </div>
         </div>
         <div className="flex gap-4 self-end md:self-auto">
             <div className="text-right">
                 <p className="text-xs text-gray-500">البلاغات النشطة للتحليل</p>
                 <p className="text-xl font-bold text-white font-mono">{activeIncidents.length}</p>
             </div>
             <div className="text-right">
                 <p className="text-xs text-gray-500">حالات حرجة</p>
                 <p className="text-xl font-bold text-red-500 font-mono">{criticalCount}</p>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Visualizer (Map + Overlay) */}
          <div className="col-span-1 lg:col-span-8 space-y-6">
              <div className="h-[300px] lg:h-[450px] rounded-3xl overflow-hidden border border-purple-500/20 relative shadow-2xl">
                  <MapComponent incidents={incidents} interactive={true} showHeatmap={true} />
                  
                  {/* Overlay Info */}
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-xl border border-purple-500/30 p-4 rounded-2xl max-w-xs z-[1000] hidden sm:block">
                      <h3 className="text-purple-400 text-xs font-bold mb-2 flex items-center gap-2">
                          <Cpu size={14} />
                          تحليل النطاق الجغرافي
                      </h3>
                      <p className="text-gray-300 text-xs leading-relaxed">
                          تم تحديد {activeIncidents.length} نطاقات بحث نشطة. تشير الدوائر الحمراء إلى مناطق الخطر العالي بناءً على وعورة التضاريس والظروف الصحية للمفقودين.
                      </p>
                  </div>
              </div>

              {/* Processing Logs */}
              <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Activity size={18} className="text-purple-400" />
                      سجل التحليل المباشر
                  </h3>
                  <div className="space-y-3 font-mono text-xs max-h-[200px] overflow-y-auto custom-scrollbar">
                      {activeIncidents.slice(0, 3).map((incident, idx) => (
                          <div key={incident.id} className="flex flex-col sm:flex-row gap-1 sm:gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                              <div className="flex gap-2">
                                <span className="text-purple-400">{new Date().toLocaleTimeString('en-US', {hour12: false})}</span>
                                <span className="text-gray-500 hidden sm:inline">|</span>
                                <span className="text-blue-300">INCIDENT-{incident.id.split('-')[2]}</span>
                              </div>
                              <span className="text-gray-500 hidden sm:inline">>></span>
                              <span className="text-gray-300">{incident.ai_profile.ghayath_short_line}</span>
                          </div>
                      ))}
                      <div className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/5 opacity-50">
                          <span className="text-purple-400">System</span>
                          <span className="text-gray-500">|</span>
                          <span className="text-gray-300">Calculating survival clock probability for active sectors...</span>
                      </div>
                  </div>
              </div>
          </div>

          {/* Right Panel: Pipeline & Engines */}
          <div className="col-span-1 lg:col-span-4 space-y-6">
              
              {/* Pipeline Status */}
              <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-white font-bold mb-6">خط معالجة البيانات</h3>
                  <div className="space-y-6 relative">
                      {/* Vertical Line Gradient */}
                      <div className="absolute top-4 bottom-4 right-[19px] w-0.5 bg-gradient-to-b from-green-500 via-purple-500 to-gray-800 opacity-30"></div>
                      
                      {PIPELINE_STEPS.map((step, idx) => (
                          <div key={idx} className="relative flex items-start gap-4 z-10 group">
                              {/* Icon Circle */}
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 shadow-lg relative shrink-0
                                  ${step.status === 'complete' ? 'bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(74,222,128,0.2)]' : 
                                    step.status === 'processing' ? 'bg-purple-600/20 text-purple-400 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse' : 
                                    'bg-white/5 text-gray-500 border-white/5'}
                              `}>
                                  <step.icon size={18} />
                                  {step.status === 'processing' && (
                                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-ping"></span>
                                  )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 pt-1">
                                  <div className="flex justify-between items-center mb-1">
                                      <h4 className={`text-sm font-bold transition-colors ${step.status === 'pending' ? 'text-gray-500' : 'text-white group-hover:text-purple-300'}`}>
                                          {step.label}
                                      </h4>
                                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border
                                          ${step.status === 'complete' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                            step.status === 'processing' ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' : 
                                            'bg-white/5 text-gray-500 border-white/10'}
                                      `}>
                                          {step.metric}
                                      </span>
                                  </div>
                                  
                                  {/* Progress Bar for processing */}
                                  {step.status === 'processing' && (
                                      <div className="w-full h-1 bg-gray-800 rounded-full mb-2 overflow-hidden">
                                          <div className="h-full bg-purple-500 w-[60%] animate-[progress_2s_ease-in-out_infinite]"></div>
                                      </div>
                                  )}
                                  
                                  <p className="text-xs text-gray-400 leading-relaxed">
                                      {step.desc}
                                  </p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Survival Clock Engine */}
              <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-red-900/20 to-black border-red-500/20">
                  <div className="flex items-center justify-between mb-4">
                      <h3 className="text-red-400 font-bold text-sm flex items-center gap-2">
                          <ShieldAlert size={16} />
                          محرك ساعة النجاة
                      </h3>
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  </div>
                  <div className="text-center py-4">
                      <div className="text-3xl lg:text-4xl font-black text-white font-mono tracking-widest mb-1">
                          08:42:12
                      </div>
                      <p className="text-xs text-red-300">متوسط وقت النجاة المتبقي للحالات الحرجة</p>
                  </div>
                  <div className="mt-4 p-3 bg-black/40 rounded-xl border border-white/5">
                      <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">عامل الطقس</span>
                          <span className="text-red-400 font-bold">-12%</span>
                      </div>
                      <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full w-[88%]"></div>
                      </div>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};

export default GhayathAI;
