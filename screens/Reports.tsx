
import React, { useState, useMemo } from 'react';
import { Incident } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, AreaChart, Area, CartesianGrid } from 'recharts';
import { BarChart2, Filter, FileText, Download, Share2, Printer, Table, Clock, Activity, CloudRain, Map } from 'lucide-react';
import { REGIONS_DATA } from '../constants';

interface ReportsProps {
  incidents: Incident[];
}

const Reports: React.FC<ReportsProps> = ({ incidents }) => {
  const [selectedRegion, setSelectedRegion] = useState('الكل');

  // 1. Status Data (Pie)
  const statusData = [
    { name: 'قيد البحث', value: incidents.filter(i => i.status === 'قيد البحث').length },
    { name: 'تم العثور عليه (حي)', value: incidents.filter(i => i.status === 'تم العثور عليه – حي').length },
    { name: 'تم العثور عليه (متوفى)', value: incidents.filter(i => i.status === 'تم العثور عليه – متوفى').length },
    { name: 'بلاغ جديد', value: incidents.filter(i => i.status === 'بلاغ جديد').length },
  ];
  const COLORS = ['#eab308', '#22c55e', '#6b7280', '#ef4444'];

  // 2. Risk Data (Bar)
  const riskData = [
    { name: 'حرج', value: incidents.filter(i => i.health_profile.risk_level === 'حرج').length },
    { name: 'مرتفع', value: incidents.filter(i => i.health_profile.risk_level === 'مرتفع').length },
    { name: 'متوسط', value: incidents.filter(i => i.health_profile.risk_level === 'متوسط').length },
    { name: 'منخفض', value: incidents.filter(i => i.health_profile.risk_level === 'منخفض').length },
  ];

  // 3. Incidents by Region (Bar)
  const incidentsByRegion = useMemo(() => {
     const counts: Record<string, number> = {};
     incidents.forEach(inc => {
         counts[inc.region] = (counts[inc.region] || 0) + 1;
     });
     return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [incidents]);

  // 4. Weather Impact (Bar) - Simulated based on context
  const weatherImpact = useMemo(() => {
      const counts: Record<string, number> = {};
      incidents.forEach(inc => {
          counts[inc.weather_context] = (counts[inc.weather_context] || 0) + 1;
      });
      return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [incidents]);

  // 5. Response Time (Simulated)
  const responseTimeData = [
      { name: 'أقل من ساعة', value: 12 },
      { name: '1-3 ساعات', value: 25 },
      { name: '3-6 ساعات', value: 15 },
      { name: 'أكثر من 6 ساعات', value: 8 },
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pb-20 pr-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
         <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <BarChart2 size={24} className="text-indigo-400" />
             </div>
             <div>
                <h2 className="text-2xl font-bold text-white">التقارير والتحليلات</h2>
                <p className="text-gray-400 text-sm">لوحة معلومات الأداء التشغيلي والإحصائي</p>
             </div>
         </div>
         <div className="flex flex-wrap gap-3">
             <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-medium border border-white/10 transition-colors">
                 <Table size={16} />
                 تصدير Excel
             </button>
             <button className="flex items-center gap-2 bg-lime-600 hover:bg-lime-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg">
                 <FileText size={16} />
                 تصدير PDF
             </button>
         </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 h-full">
          
          {/* Sidebar Filters */}
          <div className="w-full xl:w-64 flex flex-col gap-6 shrink-0 order-2 xl:order-1">
              <div className="glass-panel p-5 rounded-2xl">
                  <div className="flex items-center gap-2 text-white font-bold mb-4 border-b border-white/10 pb-3">
                      <Filter size={18} className="text-indigo-400" />
                      خيارات التصفية
                  </div>
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs text-gray-400 block mb-1.5">المنطقة</label>
                          <select 
                             className="w-full glass-input rounded-lg px-3 py-2 text-sm"
                             value={selectedRegion}
                             onChange={(e) => setSelectedRegion(e.target.value)}
                          >
                              <option value="الكل">جميع المناطق</option>
                              {REGIONS_DATA.map(r => <option key={r.region} value={r.region}>{r.region}</option>)}
                          </select>
                      </div>
                      <div>
                          <label className="text-xs text-gray-400 block mb-1.5">الفترة الزمنية</label>
                          <select className="w-full glass-input rounded-lg px-3 py-2 text-sm">
                              <option>آخر 7 أيام</option>
                              <option>آخر 30 يوم</option>
                              <option>هذا العام</option>
                          </select>
                      </div>
                      <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm font-bold mt-2">
                          تطبيق
                      </button>
                  </div>
              </div>

              {/* Summary KPIs */}
              <div className="glass-panel p-5 rounded-2xl bg-indigo-900/10 border-indigo-500/20">
                  <div className="grid grid-cols-2 xl:grid-cols-1 gap-4">
                      <div>
                          <p className="text-gray-400 text-xs mb-1">إجمالي البلاغات</p>
                          <h3 className="text-xl lg:text-2xl font-bold text-white">{incidents.length}</h3>
                      </div>
                      <div>
                          <p className="text-gray-400 text-xs mb-1">بلاغات قيد البحث</p>
                          <h3 className="text-xl lg:text-2xl font-bold text-yellow-400">{incidents.filter(i => i.status === 'قيد البحث').length}</h3>
                      </div>
                      <div>
                          <p className="text-gray-400 text-xs mb-1">عالية الخطورة</p>
                          <h3 className="text-xl lg:text-2xl font-bold text-red-400">{incidents.filter(i => ['حرج', 'مرتفع'].includes(i.health_profile.risk_level)).length}</h3>
                      </div>
                      <div>
                          <p className="text-gray-400 text-xs mb-1">متوسط زمن الاستجابة</p>
                          <h3 className="text-xl lg:text-2xl font-bold text-green-400">45 دقيقة</h3>
                      </div>
                  </div>
              </div>
          </div>

          {/* Main Visuals Area */}
          <div className="flex-1 space-y-6 min-w-0 order-1 xl:order-2">
              
              {/* Row 1: Status & Risk */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-panel p-6 rounded-2xl">
                      <h3 className="text-white font-bold mb-6 text-sm flex items-center gap-2">
                          <Activity size={16} className="text-blue-400"/>
                          توزيع حالات البلاغات
                      </h3>
                      {/* Recharts Fix */}
                      <div className="h-[220px] w-full chartWrap">
                          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                              <PieChart>
                                  <Pie
                                      data={statusData}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={50}
                                      outerRadius={70}
                                      paddingAngle={5}
                                      dataKey="value"
                                  >
                                      {statusData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                      ))}
                                  </Pie>
                                  <Tooltip contentStyle={{backgroundColor: '#1a1c15', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'}} itemStyle={{color: '#fff'}} />
                                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '10px'}} />
                              </PieChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  <div className="glass-panel p-6 rounded-2xl">
                      <h3 className="text-white font-bold mb-6 text-sm flex items-center gap-2">
                          <Activity size={16} className="text-red-400"/>
                          مستويات الخطورة الصحية
                      </h3>
                      {/* Recharts Fix */}
                      <div className="h-[220px] w-full chartWrap">
                          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                              <BarChart data={riskData} layout="vertical">
                                  <XAxis type="number" stroke="#666" tick={{fill: '#888', fontSize: 10}} hide />
                                  <YAxis dataKey="name" type="category" stroke="#666" tick={{fill: '#ccc', fontSize: 11}} width={50} />
                                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1a1c15', border: '1px solid rgba(255,255,255,0.1)'}} />
                                  <Bar dataKey="value" barSize={16} radius={[0, 4, 4, 0]}>
                                      <Cell fill="#ef4444" />
                                      <Cell fill="#f97316" />
                                      <Cell fill="#eab308" />
                                      <Cell fill="#22c55e" />
                                  </Bar>
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              </div>

              {/* Row 2: Response Time & Weather */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-panel p-6 rounded-2xl">
                      <h3 className="text-white font-bold mb-6 text-sm flex items-center gap-2">
                          <Clock size={16} className="text-lime-400"/>
                          زمن الاستجابة (من البلاغ إلى الوصول)
                      </h3>
                      {/* Recharts Fix */}
                      <div className="h-[200px] w-full chartWrap">
                          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                              <BarChart data={responseTimeData}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                  <XAxis dataKey="name" stroke="#666" tick={{fill: '#888', fontSize: 10}} />
                                  <YAxis stroke="#666" tick={{fill: '#888', fontSize: 10}} />
                                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1a1c15', border: '1px solid rgba(255,255,255,0.1)'}} />
                                  <Bar dataKey="value" fill="#84cc16" radius={[4, 4, 0, 0]} barSize={30} />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  <div className="glass-panel p-6 rounded-2xl">
                      <h3 className="text-white font-bold mb-6 text-sm flex items-center gap-2">
                          <CloudRain size={16} className="text-blue-400"/>
                          حالات الطقس المؤثرة
                      </h3>
                      {/* Recharts Fix */}
                      <div className="h-[200px] w-full chartWrap">
                          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                              <BarChart data={weatherImpact}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                  <XAxis dataKey="name" stroke="#666" tick={{fill: '#888', fontSize: 10}} />
                                  <YAxis stroke="#666" tick={{fill: '#888', fontSize: 10}} />
                                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1a1c15', border: '1px solid rgba(255,255,255,0.1)'}} />
                                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              </div>

              {/* Row 3: Regions (Large) */}
              <div className="glass-panel p-6 rounded-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-white font-bold text-sm flex items-center gap-2">
                          <Map size={16} className="text-purple-400"/>
                          توزيع البلاغات حسب المناطق
                      </h3>
                  </div>
                  {/* Recharts Fix */}
                  <div className="h-[250px] w-full chartWrap">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                          <BarChart data={incidentsByRegion}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                              <XAxis dataKey="name" stroke="#666" tick={{fill: '#888', fontSize: 11}} />
                              <YAxis stroke="#666" tick={{fill: '#888', fontSize: 11}} />
                              <Tooltip contentStyle={{backgroundColor: '#1a1c15', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'}} itemStyle={{color: '#fff'}} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                              <Bar dataKey="count" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={40} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};

export default Reports;
