
import React from 'react';
import { 
  PlusCircle, LayoutDashboard, List, Map as MapIcon, 
  Activity, Radar, CloudRain, BrainCircuit, BarChart2, Settings, ShieldCheck, X
} from 'lucide-react';
import { ScreenId } from '../types';

interface SidebarProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onNavigate, isOpen, onClose }) => {
  const menuItems = [
    { id: 'nav_new_incident', label: 'بلاغ جديد', icon: PlusCircle, primary: true },
    { id: 'nav_dashboard', label: 'لوحة القيادة', icon: LayoutDashboard },
    { id: 'nav_incidents', label: 'البلاغات', icon: List },
    { id: 'nav_map', label: 'الخريطة', icon: MapIcon },
    { id: 'nav_operations', label: 'غرفة العمليات', icon: Activity },
    { id: 'nav_sensors', label: 'المستشعرات', icon: Radar },
    { id: 'nav_weather', label: 'الطقس والمخاطر', icon: CloudRain },
    { id: 'nav_ghayath', label: 'غياث AI', icon: BrainCircuit },
    { id: 'nav_reports', label: 'التقارير', icon: BarChart2 },
  ];

  return (
    <aside 
      className={`
        fixed inset-y-0 right-0 z-50 w-72 h-full glass-panel border-l border-white/10 flex flex-col transition-transform duration-300 bg-[#0c1008]/95 backdrop-blur-xl
        lg:static lg:translate-x-0 lg:bg-transparent lg:glass-panel
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="lg:hidden absolute top-4 left-4 p-2 text-gray-400 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>

      {/* Branding Section */}
      <div className="relative px-6 py-8 flex flex-col items-center justify-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent shrink-0">
        <div className="relative group cursor-pointer mb-4">
             {/* Glow Effect */}
             <div className="absolute inset-0 bg-lime-500/20 blur-xl rounded-full group-hover:bg-lime-500/30 transition-all duration-500 opacity-70"></div>
             
             {/* Logo Container */}
             <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a1c15] to-black border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300 ring-1 ring-white/5">
                <Radar size={36} className="text-lime-500 drop-shadow-[0_0_8px_rgba(132,204,22,0.5)] animate-pulse" />
             </div>
             
             {/* Status Dot */}
             <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#1a1c15] rounded-full flex items-center justify-center border border-white/10 z-10">
                <span className="w-2.5 h-2.5 bg-lime-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(132,204,22,0.8)]"></span>
             </div>
        </div>
        
        <div className="text-center">
            <h1 className="text-2xl font-bold text-white tracking-wide">مُغيث</h1>
            <div className="flex items-center justify-center gap-2 mt-1 opacity-80">
              <span className="h-[1px] w-4 bg-lime-500/50"></span>
              <p className="text-[10px] text-lime-400 font-medium tracking-[0.2em] uppercase">
                Search & Rescue
              </p>
              <span className="h-[1px] w-4 bg-lime-500/50"></span>
            </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = activeScreen === item.id;
          const isPrimary = item.primary;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ScreenId)}
              className={`
                relative w-full flex items-center gap-4 px-4 py-3 rounded-[18px] transition-all duration-300 group overflow-hidden outline-none
                ${isActive 
                  ? 'bg-gradient-to-r from-lime-500/20 to-lime-500/5 text-white border border-lime-500/20 shadow-[0_4px_20px_-5px_rgba(132,204,22,0.15)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }
                ${isPrimary && !isActive ? 'bg-white/5 border-white/5 hover:bg-white/10' : ''}
              `}
            >
              <Icon 
                size={22} 
                className={`transition-all duration-300 z-10 shrink-0
                  ${isActive ? 'text-lime-400 drop-shadow-[0_0_5px_rgba(132,204,22,0.5)]' : 'text-gray-500 group-hover:text-gray-200'}
                  ${isPrimary && !isActive ? 'text-lime-500/70' : ''}
                `} 
              />
              
              <span className={`font-semibold text-sm z-10 transition-all whitespace-nowrap ${isActive ? 'text-white' : ''}`}>
                {item.label}
              </span>
              
              {/* Primary Item Decoration */}
              {isPrimary && isActive && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-lime-400 animate-pulse"></span>
                      <span className="w-1 h-1 rounded-full bg-lime-400 animate-pulse delay-75"></span>
                  </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-white/10 bg-black/20 shrink-0">
        <button 
           onClick={() => onNavigate('nav_settings')}
           className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group border border-transparent
             ${activeScreen === 'nav_settings' ? 'bg-white/10 border-white/10' : 'hover:bg-white/5 hover:border-white/5'}
           `}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-lime-900 to-lime-700 flex items-center justify-center border border-white/10 shadow-lg relative">
             <ShieldCheck size={20} className="text-white" />
             <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#1a1c15] rounded-full"></span>
          </div>
          <div className="text-right flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate group-hover:text-lime-400 transition-colors">مشرف النظام</p>
            <p className="text-[10px] text-gray-500 truncate">مركز القيادة الوطني</p>
          </div>
          <Settings size={18} className="text-gray-500 group-hover:text-white transition-colors" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
