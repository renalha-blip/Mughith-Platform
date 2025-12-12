
import React from 'react';
import { ShieldCheck, Bell, Search, ChevronLeft, Menu } from 'lucide-react';
import { APP_TITLE, APP_SUBTITLE } from '../constants';
import { ScreenId } from '../types';

interface HeaderProps {
  activeScreen: ScreenId;
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeScreen, onToggleSidebar }) => {
  
  const getBreadcrumbs = (screen: ScreenId) => {
    const base = ['الرئيسة'];
    switch (screen) {
      case 'nav_new_incident': return [...base, 'بلاغ جديد'];
      case 'nav_dashboard': return [...base, 'لوحة القيادة'];
      case 'nav_incidents': return [...base, 'البلاغات'];
      case 'nav_map': return [...base, 'الخريطة'];
      case 'nav_operations': return [...base, 'غرفة العمليات'];
      case 'nav_sensors': return [...base, 'المستشعرات'];
      case 'nav_weather': return [...base, 'الطقس والمخاطر'];
      case 'nav_ghayath': return [...base, 'غياث AI'];
      case 'nav_reports': return [...base, 'التقارير'];
      case 'nav_settings': return [...base, 'الإعدادات'];
      case 'nav_incident_details': return [...base, 'البلاغات', 'تفاصيل البلاغ'];
      default: return base;
    }
  };

  const breadcrumbs = getBreadcrumbs(activeScreen);

  return (
    <header className="h-20 lg:h-24 px-4 lg:px-8 flex items-center justify-between glass-panel mx-4 lg:mx-6 mt-4 lg:mt-6 rounded-2xl z-40 relative shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col justify-center">
          {/* Breadcrumbs */}
          <div className="hidden md:flex items-center gap-1.5 text-xs mb-1.5">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <span className={`font-medium ${index === breadcrumbs.length - 1 ? 'text-lime-400' : 'text-gray-500'}`}>
                  {crumb}
                </span>
                {index < breadcrumbs.length - 1 && (
                  <ChevronLeft size={10} className="text-gray-600" />
                )}
              </React.Fragment>
            ))}
          </div>

          <h2 className="text-lg lg:text-xl font-bold text-white flex items-center gap-2">
            {APP_TITLE}
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-lime-500/20 text-lime-400 text-[10px] border border-lime-500/30">نشط</span>
          </h2>
          <p className="text-xs text-gray-400 hidden sm:block">{APP_SUBTITLE}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <div className="relative group hidden xl:block">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400 group-focus-within:text-lime-400 transition-colors" />
            </div>
            <input 
                type="text" 
                placeholder="بحث سريع..." 
                className="w-64 bg-black/30 border border-white/10 rounded-full py-2 pr-10 pl-4 text-sm text-white focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/50 transition-all"
            />
        </div>

        <button className="relative w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 transition-colors">
          <Bell size={20} className="text-gray-300" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
        </button>

        <div className="flex items-center gap-3 pl-2 lg:border-r border-white/10 pr-0 lg:pr-6">
          <div className="text-left hidden lg:block">
            <p className="text-sm font-bold text-white">مشرف النظام</p>
            <p className="text-xs text-lime-500">مركز القيادة الوطني</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-lime-900/50 border border-lime-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(132,204,22,0.3)]">
            <ShieldCheck size={20} className="text-lime-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
