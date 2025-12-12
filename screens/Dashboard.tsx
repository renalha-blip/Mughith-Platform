
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Incident } from '../types';
import IncidentCard from '../components/IncidentCard';
import { AlertTriangle, CheckCircle, Search, BrainCircuit } from 'lucide-react';

interface DashboardProps {
  incidents: Incident[];
  onShowOnMap: (incident: Incident) => void;
  onDispatchTeams: (incident: Incident) => void;
  onOpenDetails: (incident: Incident) => void;
  onSecurityDispatch?: (incident: Incident) => void;
  onViewSensors?: (incident: Incident) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  incidents, 
  onShowOnMap, 
  onDispatchTeams, 
  onOpenDetails, 
  onSecurityDispatch,
  onViewSensors
}) => {
  const chartData = [
    { time: '00:00', value: 2 }, { time: '04:00', value: 1 },
    { time: '08:00', value: 5 }, { time: '12:00', value: 8 },
    { time: '16:00', value: 12 }, { time: '20:00', value: 6 },
  ];

  const terrainData = [
    { name: 'وادي', count: 12 },
    { name: 'صحراء', count: 19 },
    { name: 'جبال', count: 8 },
    { name: 'ساحل', count: 5 },
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pb-20 pr-2">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {[
          { label: 'إجمالي البلاغات', val: '42', icon: Search, color: 'text-white', bg: 'bg-white/5' },
          { label: 'قيد البحث', val: '18', icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'تم العثور عليهم', val: '24', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'دقة غياث AI', val: '94%', icon: BrainCircuit, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((kpi, i) => (
          <div key={i} className="glass-panel p-4 lg:p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-medium mb-1">{kpi.label}</p>
              <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">{kpi.val}</h2>
            </div>
            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center ${kpi.bg}`}>
              <kpi.icon size={20} className={`lg:w-6 lg:h-6 ${kpi.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="col-span-1 lg:col-span-8 glass-panel p-6 rounded-2xl">
          <h3 className="text-white font-bold mb-6">نشاط البلاغات (24 ساعة)</h3>
          {/* Recharts Fix: Added chartWrap class */}
          <div className="h-[240px] w-full chartWrap">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#666" tick={{fill: '#888', fontSize: 10}} />
                <YAxis stroke="#666" tick={{fill: '#888', fontSize: 10}} />
                <Tooltip 
                    contentStyle={{backgroundColor: '#1a1c15', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'}}
                    itemStyle={{color: '#fff'}}
                />
                <Area type="monotone" dataKey="value" stroke="#84cc16" fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-4 glass-panel p-6 rounded-2xl">
          <h3 className="text-white font-bold mb-6">التوزيع حسب التضاريس</h3>
          {/* Recharts Fix: Added chartWrap class */}
          <div className="h-[240px] w-full chartWrap">
             <ResponsiveContainer width="100%" height="100%" minWidth={0}>
               <BarChart data={terrainData}>
                 <XAxis dataKey="name" stroke="#666" tick={{fill: '#888', fontSize: 10}} />
                 <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1a1c15', border: '1px solid rgba(255,255,255,0.1)'}} />
                 <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                   {terrainData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={['#84cc16', '#EEDB6A', '#FB923C', '#38BDF8'][index % 4]} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Incidents List */}
      <div>
        <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-lg font-bold text-white">آخر البلاغات المسجلة</h3>
            <button className="text-xs text-lime-400 hover:text-lime-300">عرض الكل</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {incidents.slice(0, 4).map(incident => (
            <IncidentCard 
              key={incident.id} 
              incident={incident} 
              onShowOnMap={onShowOnMap} 
              onDispatchTeams={onDispatchTeams} 
              onOpenDetails={onOpenDetails}
              onSecurityRouteClick={onSecurityDispatch}
              onViewSensors={onViewSensors}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
