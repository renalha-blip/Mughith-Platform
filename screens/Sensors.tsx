
import React, { useMemo } from 'react';
import { Incident, Sensor } from '../types';
import MapComponent from '../components/MapComponent';
import { Radar, Wifi, WifiOff, AlertTriangle, Battery, Signal, Radio, Activity, Thermometer, Car, Wind } from 'lucide-react';

interface SensorsProps {
  incidents: Incident[];
  onShowOnMap: (incident: Incident) => void;
  onOpenDetails: (incident: Incident) => void;
}

const Sensors: React.FC<SensorsProps> = ({ incidents, onShowOnMap, onOpenDetails }) => {
  // Generate distinct mock sensors
  const sensors = useMemo(() => {
    return incidents.map((inc, i) => {
      let status: Sensor['status'] = 'active';
      if (inc.health_profile.risk_level === 'حرج') status = 'alert';
      else if (i % 6 === 0) status = 'offline';

      let type: Sensor['type'] = 'thermal';
      let metricLabel = "حرارة المكان";
      
      if (i % 3 === 0) { 
          type = 'camera'; 
          metricLabel = "مرور المركبات";
      } else if (i % 2 === 0) { 
          type = 'motion'; 
          metricLabel = "حركة الأجسام";
      } else {
          metricLabel = "تغير مناخي مفاجئ";
      }

      return {
        id: `SN-829-${100 + i}`,
        type,
        status,
        coords: { 
            lat: inc.coords.lat + (Math.random() - 0.5) * 0.005, 
            lng: inc.coords.lng + (Math.random() - 0.5) * 0.005 
        },
        battery: Math.floor(Math.random() * 40) + 60,
        last_update: 'Just now',
        reading_value: Math.floor(Math.random() * 40) + (type === 'thermal' ? '°C' : ''),
        location_name: inc.city,
        metric_label: metricLabel
      } as Sensor;
    });
  }, [incidents]);

  const activeSensors = sensors.filter(s => s.status === 'active').length;
  const offlineSensors = sensors.filter(s => s.status === 'offline').length;
  const alertsCount = sensors.filter(s => s.status === 'alert').length;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pb-20 pr-2">
      <div className="flex items-center gap-4 mb-6">
         <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
            <Radar size={24} className="text-teal-400 animate-pulse" />
         </div>
         <div>
            <h2 className="text-2xl font-bold text-white">تحليل المستشعرات – غياث AI</h2>
            <p className="text-gray-400 text-sm">مراقبة الشبكة وأجهزة الاستشعار الميدانية</p>
         </div>
      </div>

      {/* Sensor Type Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
         <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-teal-500/30 transition-colors">
             <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                 <Thermometer size={24} className="text-orange-400" />
             </div>
             <div>
                 <p className="text-gray-400 text-xs mb-1">حرارة المكان</p>
                 <h3 className="text-lg font-bold text-white">نشط</h3>
             </div>
         </div>
         <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-teal-500/30 transition-colors">
             <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                 <Activity size={24} className="text-blue-400" />
             </div>
             <div>
                 <p className="text-gray-400 text-xs mb-1">حركة الأجسام</p>
                 <h3 className="text-lg font-bold text-white">رصد مستمر</h3>
             </div>
         </div>
         <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-teal-500/30 transition-colors">
             <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                 <Car size={24} className="text-purple-400" />
             </div>
             <div>
                 <p className="text-gray-400 text-xs mb-1">مرور المركبات</p>
                 <h3 className="text-lg font-bold text-white">تحليل AI</h3>
             </div>
         </div>
         <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-teal-500/30 transition-colors">
             <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                 <Wind size={24} className="text-red-400" />
             </div>
             <div>
                 <p className="text-gray-400 text-xs mb-1">تغير مناخي مفاجئ</p>
                 <h3 className="text-lg font-bold text-white">مراقبة</h3>
             </div>
         </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
         <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border-b-2 border-teal-500">
             <div>
                 <p className="text-gray-400 text-xs mb-1">المستشعرات النشطة</p>
                 <h3 className="text-2xl font-bold text-white font-mono">{activeSensors}</h3>
             </div>
             <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center">
                 <Wifi size={20} className="text-teal-400" />
             </div>
         </div>
         <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border-b-2 border-red-500">
             <div>
                 <p className="text-gray-400 text-xs mb-1">تنبيهات حرجة</p>
                 <h3 className="text-2xl font-bold text-white font-mono">{alertsCount}</h3>
             </div>
             <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                 <AlertTriangle size={20} className="text-red-400" />
             </div>
         </div>
         <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border-b-2 border-gray-500">
             <div>
                 <p className="text-gray-400 text-xs mb-1">غير متصلة</p>
                 <h3 className="text-2xl font-bold text-white font-mono">{offlineSensors}</h3>
             </div>
             <div className="w-10 h-10 rounded-full bg-gray-500/10 flex items-center justify-center">
                 <WifiOff size={20} className="text-gray-400" />
             </div>
         </div>
         <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border-b-2 border-blue-500">
             <div>
                 <p className="text-gray-400 text-xs mb-1">تغطية الشبكة</p>
                 <h3 className="text-2xl font-bold text-white font-mono">98.2%</h3>
             </div>
             <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                 <Signal size={20} className="text-blue-400" />
             </div>
         </div>
      </div>

      {/* Map Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="col-span-1 lg:col-span-8">
              <div className="glass-panel p-1 rounded-2xl overflow-hidden h-[300px] lg:h-[400px] relative border border-white/10">
                  <MapComponent incidents={[]} sensors={sensors} interactive={true} />
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur px-4 py-2 rounded-xl border border-white/10 z-[1000]">
                      <h4 className="text-teal-400 text-xs font-bold mb-2 flex items-center gap-2">
                          <Radio size={14} />
                          توزيع العقد
                      </h4>
                      <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[10px] text-gray-300">
                              <span className="w-2 h-2 rounded-full bg-teal-500 border border-teal-400"></span>
                              نشط (Active)
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-300">
                              <span className="w-2 h-2 rounded-full bg-red-500 border border-red-400 animate-pulse"></span>
                              تنبيه (Alert)
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-300">
                              <span className="w-2 h-2 rounded-full bg-gray-500 border border-gray-400"></span>
                              غير متصل (Offline)
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="col-span-1 lg:col-span-4">
              <div className="glass-panel p-6 rounded-2xl h-[400px] flex flex-col">
                  <h3 className="text-white font-bold mb-4">حالة الشبكة</h3>
                  <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                      {sensors.map((sensor, i) => (
                          <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
                              <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${
                                      sensor.status === 'alert' ? 'bg-red-500 animate-pulse' : 
                                      sensor.status === 'offline' ? 'bg-gray-500' : 'bg-green-500'
                                  }`}></div>
                                  <div>
                                      <p className="text-xs font-bold text-gray-200">{sensor.id}</p>
                                      <p className="text-[10px] text-gray-500">{sensor.location_name}</p>
                                      <p className="text-[9px] text-teal-400">{sensor.metric_label}</p>
                                  </div>
                              </div>
                              <div className="flex items-center gap-2">
                                  <Battery size={14} className={sensor.battery < 20 ? 'text-red-400' : 'text-green-400'} />
                                  <span className="text-xs font-mono text-gray-400">{sensor.battery}%</span>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* Live Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-bold text-white">سجل القراءات المباشر</h3>
              <button className="text-xs text-teal-400 border border-teal-500/30 px-3 py-1 rounded-lg hover:bg-teal-500/10 transition-colors">تحديث البيانات</button>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[800px]">
                  <thead className="bg-white/5 text-gray-400 text-xs">
                      <tr>
                          <th className="px-6 py-4">معرف المستشعر</th>
                          <th className="px-6 py-4">الموقع</th>
                          <th className="px-6 py-4">نوع القراءة</th>
                          <th className="px-6 py-4">القيمة</th>
                          <th className="px-6 py-4">الحالة</th>
                          <th className="px-6 py-4">آخر تحديث</th>
                          <th className="px-6 py-4">الإجراء</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                      {sensors.map((sensor) => (
                          <tr key={sensor.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 font-mono text-xs text-teal-300">{sensor.id}</td>
                              <td className="px-6 py-4">{sensor.location_name}</td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                      <Activity size={14} className="text-orange-400" />
                                      {sensor.metric_label}
                                  </div>
                              </td>
                              <td className="px-6 py-4 font-mono">
                                  {sensor.reading_value}
                              </td>
                              <td className="px-6 py-4">
                                  <span className={`px-2 py-0.5 rounded text-[10px] border ${
                                      sensor.status === 'alert' 
                                      ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                      : sensor.status === 'offline'
                                      ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                      : 'bg-green-500/10 text-green-400 border-green-500/20'
                                  }`}>
                                      {sensor.status === 'alert' ? 'تنبيه' : sensor.status === 'offline' ? 'غير متصل' : 'طبيعي'}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-xs text-gray-500">{sensor.last_update}</td>
                              <td className="px-6 py-4">
                                  <button 
                                    className="text-teal-400 hover:text-teal-300 text-xs font-medium"
                                  >
                                      عرض السجل
                                  </button>
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

export default Sensors;
