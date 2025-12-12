
import React, { useMemo, useState } from 'react';
import { Incident } from '../types';
import { 
  CloudRain, Wind, Thermometer, Droplets, AlertTriangle, 
  Map as MapIcon, Sun, CloudLightning, Siren, 
  Download, FileText, Mountain, ShieldAlert, CheckCircle, Layers
} from 'lucide-react';
import MapComponent from '../components/MapComponent';

interface WeatherProps {
  incidents: Incident[];
}

interface CityStats {
  city: string;
  count: number;
  terrain: string;
  avgRisk: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  temp: number;
  wind: number;
  humid: number;
  weatherCtx: string;
  incidents: Incident[];
}

const Weather: React.FC<WeatherProps> = ({ incidents }) => {
  const [mapLayer, setMapLayer] = useState<'rain' | 'dust' | 'heat'>('rain');

  // Aggregate Data by City
  const cityStats = useMemo(() => {
    const stats: Record<string, any> = {};
    const activeIncidents = incidents.filter(i => i.status !== 'مغلق');

    activeIncidents.forEach(inc => {
       if (!stats[inc.city]) {
         stats[inc.city] = { 
             count: 0, 
             totalRisk: 0, 
             terrains: new Set(), 
             weatherCtx: inc.weather_context, 
             incidents: [] 
         };
       }
       stats[inc.city].count++;
       stats[inc.city].totalRisk += inc.ai_profile.ghayath_risk_score;
       stats[inc.city].terrains.add(inc.terrain_type);
       stats[inc.city].incidents.push(inc);
    });

    return Object.keys(stats).map(city => {
       const s = stats[city];
       const avgRisk = Math.round(s.totalRisk / s.count);
       
       let level: CityStats['level'] = 'low';
       if (avgRisk >= 85) level = 'critical';
       else if (avgRisk >= 65) level = 'high';
       else if (avgRisk >= 40) level = 'medium';

       // Simulate weather metrics
       let temp = 33, wind = 12, humid = 25;
       if (s.weatherCtx === 'أمطار') { temp = 22; wind = 28; humid = 75; }
       else if (s.weatherCtx === 'سيول') { temp = 19; wind = 45; humid = 90; }
       else if (s.weatherCtx === 'عاصفة ترابية') { temp = 39; wind = 55; humid = 15; }
       else if (s.weatherCtx === 'أجواء مستقرة') { temp = 28; wind = 10; humid = 40; }

       return {
         city,
         count: s.count,
         terrain: Array.from(s.terrains)[0] as string,
         avgRisk,
         level,
         temp, wind, humid,
         weatherCtx: s.weatherCtx,
         incidents: s.incidents
       } as CityStats;
    }).sort((a, b) => b.avgRisk - a.avgRisk);
  }, [incidents]);

  const getLevelColor = (level: string) => {
      switch(level) {
          case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
          case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
          case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
          default: return 'text-green-500 bg-green-500/10 border-green-500/20';
      }
  };

  const getWarningText = (level: string) => {
      switch(level) {
          case 'critical': return { title: 'تحذير حرج', msg: 'ظروف جوية خطرة جدًا تستدعي تقييم فوري لمسارات الفرق.' };
          case 'high': return { title: 'تحذير مرتفع', msg: 'أنشطة الرياح/الأمطار قد تؤثر على عمليات البحث.' };
          case 'medium': return { title: 'تحذير متوسط', msg: 'يرجى توخي الحذر، احتمالية تغير في الأحوال الجوية.' };
          default: return { title: 'الوضع مستقر', msg: 'لا توجد مؤشرات خطورة جوية حاليًا.' };
      }
  };

  const getBackgroundIcon = (ctx: string) => {
      if (ctx === 'أمطار') return <CloudRain size={160} className="absolute -bottom-8 -left-8 text-blue-500/5 rotate-12 pointer-events-none" />;
      if (ctx === 'سيول') return <CloudLightning size={160} className="absolute -bottom-8 -left-8 text-purple-500/5 rotate-12 pointer-events-none" />;
      if (ctx === 'عاصفة ترابية') return <Wind size={160} className="absolute -bottom-8 -left-8 text-yellow-500/5 rotate-12 pointer-events-none" />;
      return <Sun size={160} className="absolute -bottom-8 -left-8 text-orange-500/5 rotate-12 pointer-events-none" />;
  };

  const topRisk = cityStats[0];
  const showMainBanner = topRisk && (topRisk.level === 'critical' || topRisk.level === 'high');

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pb-20 pr-2">
      
      {/* Risk Banner */}
      {showMainBanner && (
          <div className="mb-6 bg-red-600/10 border border-red-600/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.2)] gap-4">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center animate-bounce">
                      <Siren className="text-white" size={24} />
                  </div>
                  <div>
                      <h3 className="text-lg font-bold text-white">تنبيه جوي عاجل</h3>
                      <p className="text-sm text-red-200">
                          {topRisk.city}: {getWarningText(topRisk.level).msg}
                      </p>
                  </div>
              </div>
              <button className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition-colors w-full sm:w-auto">
                  إطلاق إنذار
              </button>
          </div>
      )}

      {/* Header & Integrations - STRICTLY NCM ONLY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
         <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <CloudLightning size={32} className="text-blue-400" />
             </div>
             <div>
                <h2 className="text-2xl font-bold text-white">الطقس والمخاطر</h2>
                <div className="flex gap-2 mt-1">
                    {/* ONLY NCM ALLOWED per strict instructions */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                        <CloudRain size={14} className="text-blue-400" />
                        <span className="text-xs font-medium text-gray-300">الأرصاد (NCM)</span>
                    </div>
                </div>
             </div>
         </div>
      </div>

      {/* 1) City Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cityStats.map((stat, idx) => {
              const warning = getWarningText(stat.level);
              return (
                <div key={idx} className="glass-panel rounded-2xl p-0 overflow-hidden flex flex-col group hover:border-white/20 transition-all duration-300 relative">
                    {/* Subtle Background Icon */}
                    {getBackgroundIcon(stat.weatherCtx)}

                    {/* Card Header */}
                    <div className="p-5 border-b border-white/5 bg-white/5 flex justify-between items-start z-10 relative backdrop-blur-sm">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">{stat.city}</h3>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-black/20 px-2 py-1 rounded w-fit">
                                <Mountain size={12} />
                                {stat.terrain}
                            </div>
                        </div>
                        <div className={`flex flex-col items-end`}>
                             <div className={`text-xs font-bold px-2 py-1 rounded border mb-1 flex items-center gap-1 ${getLevelColor(stat.level)}`}>
                                 <AlertTriangle size={10} />
                                 {stat.level === 'critical' ? 'حرج' : stat.level === 'high' ? 'مرتفع' : stat.level === 'medium' ? 'متوسط' : 'منخفض'}
                             </div>
                             <span className="text-[10px] text-gray-500">{stat.count} بلاغات نشطة</span>
                        </div>
                    </div>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-3 divide-x divide-x-reverse divide-white/10 border-b border-white/5 bg-black/20 z-10 relative">
                        <div className="p-3 text-center flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 mb-1 border border-white/5">
                                <Thermometer size={14}/>
                            </div>
                            <div className="text-white font-bold">{stat.temp}°</div>
                            <div className="text-[10px] text-gray-500">حرارة</div>
                        </div>
                        <div className="p-3 text-center flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 mb-1 border border-white/5">
                                <Wind size={14}/>
                            </div>
                            <div className="text-white font-bold">{stat.wind}</div>
                            <div className="text-[10px] text-gray-500">كم/س</div>
                        </div>
                        <div className="p-3 text-center flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 mb-1 border border-white/5">
                                <Droplets size={14}/>
                            </div>
                            <div className="text-white font-bold">{stat.humid}%</div>
                            <div className="text-[10px] text-gray-500">رطوبة</div>
                        </div>
                    </div>

                    {/* AI Risk & Warning */}
                    <div className="p-5 flex-1 flex flex-col gap-4 z-10 relative bg-gradient-to-t from-black/40 to-transparent">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                                    <ShieldAlert size={14} />
                                    مخاطر غياث AI
                                </span>
                                <span className="text-sm font-black text-purple-300 font-mono">{stat.avgRisk}%</span>
                            </div>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${
                                        stat.level === 'critical' ? 'bg-red-500' : 
                                        stat.level === 'high' ? 'bg-orange-500' : 
                                        stat.level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`} 
                                    style={{ width: `${stat.avgRisk}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                             stat.level === 'critical' ? 'bg-red-500/5 border-red-500/10' : 
                             stat.level === 'high' ? 'bg-orange-500/5 border-orange-500/10' : 
                             stat.level === 'medium' ? 'bg-yellow-500/5 border-yellow-500/10' : 'bg-green-500/5 border-green-500/10'
                        }`}>
                            <div className={`mt-0.5 ${
                                stat.level === 'critical' ? 'text-red-400' : 
                                stat.level === 'high' ? 'text-orange-400' : 
                                stat.level === 'medium' ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                                {stat.level === 'low' ? <CheckCircle size={16}/> : <AlertTriangle size={16}/>}
                            </div>
                            <div>
                                <h4 className={`text-xs font-bold mb-0.5 ${
                                    stat.level === 'critical' ? 'text-red-300' : 
                                    stat.level === 'high' ? 'text-orange-300' : 
                                    stat.level === 'medium' ? 'text-yellow-300' : 'text-green-300'
                                }`}>{warning.title}</h4>
                                <p className="text-[10px] text-gray-400 leading-snug">{warning.msg}</p>
                            </div>
                        </div>
                    </div>
                </div>
              );
          })}
      </div>

      {/* 2) Weather Map & Layers */}
      <div className="glass-panel p-1 rounded-2xl overflow-hidden h-[300px] lg:h-[400px] border border-white/10 relative mb-8">
          <MapComponent incidents={incidents} interactive={true} showHeatmap={true} />
          
          {/* Layer Controls - Chips */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000] items-end">
             <div className="flex items-center gap-2">
                 <button 
                    onClick={() => setMapLayer('dust')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all shadow-lg backdrop-blur-sm ${
                        mapLayer === 'dust' 
                        ? 'bg-yellow-600 text-white border border-yellow-500' 
                        : 'bg-black/60 text-gray-300 border border-white/10 hover:bg-black/80'
                    }`}
                 >
                     <Wind size={14} />
                     غبار
                 </button>
                 <button 
                    onClick={() => setMapLayer('rain')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all shadow-lg backdrop-blur-sm ${
                        mapLayer === 'rain' 
                        ? 'bg-blue-600 text-white border border-blue-500' 
                        : 'bg-black/60 text-gray-300 border border-white/10 hover:bg-black/80'
                    }`}
                 >
                     <CloudRain size={14} />
                     أمطار
                 </button>
                 <button 
                    onClick={() => setMapLayer('heat')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all shadow-lg backdrop-blur-sm ${
                        mapLayer === 'heat' 
                        ? 'bg-red-600 text-white border border-red-500' 
                        : 'bg-black/60 text-gray-300 border border-white/10 hover:bg-black/80'
                    }`}
                 >
                     <Sun size={14} />
                     حرارة
                 </button>
             </div>
          </div>

          <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur p-4 rounded-xl border border-white/10 max-w-xs z-[1000] hidden sm:block">
              <h4 className="text-white text-xs font-bold mb-2 flex items-center gap-2">
                  <MapIcon size={14} className="text-orange-400"/>
                  خريطة الطقس التفاعلية
              </h4>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                  تظهر النقاط الملونة مواقع البلاغات، بينما تشير الطبقات إلى الظروف الجوية النشطة (أمطار، غبار) التي قد تعيق الرؤية أو الحركة.
              </p>
          </div>
      </div>

      {/* 3) Risk Summary Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                      <FileText size={18} className="text-gray-400"/>
                      جدول مخاطر الطقس لجميع المدن
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">ملخص رقمي قابل للتصدير لمدى تأثير الطقس على عمليات البحث.</p>
              </div>
              <div className="flex gap-2">
                  <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 transition-colors">
                      <Download size={14} />
                      Excel
                  </button>
                  <button className="flex items-center gap-2 bg-lime-600 hover:bg-lime-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-lg">
                      <Download size={14} />
                      PDF
                  </button>
              </div>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[700px]">
                  <thead className="bg-black/20 text-gray-400 text-xs uppercase tracking-wider">
                      <tr>
                          <th className="px-6 py-4">المدينة</th>
                          <th className="px-6 py-4">عدد البلاغات</th>
                          <th className="px-6 py-4">الحرارة</th>
                          <th className="px-6 py-4">الرياح</th>
                          <th className="px-6 py-4">الرطوبة</th>
                          <th className="px-6 py-4">مستوى المخاطر (غياث AI)</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                      {cityStats.map((stat, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 font-bold text-white">{stat.city}</td>
                              <td className="px-6 py-4 font-mono">{stat.count}</td>
                              <td className="px-6 py-4 flex items-center gap-1">
                                  <Thermometer size={14} className="text-gray-500"/>
                                  {stat.temp}°
                              </td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-1">
                                      <Wind size={14} className="text-gray-500"/>
                                      {stat.wind} كم/س
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-1">
                                      <Droplets size={14} className="text-gray-500"/>
                                      {stat.humid}%
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit ${getLevelColor(stat.level)}`}>
                                      {stat.level === 'low' ? <CheckCircle size={12}/> : <AlertTriangle size={12}/>}
                                      {stat.level === 'critical' ? 'حرج' : stat.level === 'high' ? 'مرتفع' : stat.level === 'medium' ? 'متوسط' : 'منخفض'}
                                  </span>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};

export default Weather;
