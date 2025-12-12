
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Incident } from '../types';
import IncidentCard from '../components/IncidentCard';
import { Filter, ChevronDown, Search, Check } from 'lucide-react';
import { REGIONS_DATA, MOCK_STATUSES } from '../constants';

interface IncidentsListProps {
  incidents: Incident[];
  onShowOnMap: (incident: Incident) => void;
  onDispatchTeams: (incident: Incident) => void;
  onOpenDetails: (incident: Incident) => void;
  onSecurityDispatch?: (incident: Incident) => void;
}

const IncidentsList: React.FC<IncidentsListProps> = ({ incidents, onShowOnMap, onDispatchTeams, onOpenDetails, onSecurityDispatch }) => {
  const [filterStatus, setFilterStatus] = useState<string>('الكل');
  const [filterRegion, setFilterRegion] = useState<string>(''); // '' means all

  // Custom Dropdown State
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [regionSearch, setRegionSearch] = useState('');
  const regionDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target as Node)) {
        setIsRegionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute Incident Counts per Region (based on current status filter)
  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const baseList = filterStatus === 'الكل' ? incidents : incidents.filter(i => i.status === filterStatus);
    
    baseList.forEach(inc => {
       counts[inc.region] = (counts[inc.region] || 0) + 1;
    });
    return counts;
  }, [incidents, filterStatus]);

  // Total available items for current status (for "All Regions" count)
  const totalFilteredByStatus = useMemo(() => {
      return (filterStatus === 'الكل' ? incidents : incidents.filter(i => i.status === filterStatus)).length;
  }, [incidents, filterStatus]);

  // Main Filter Logic
  const filteredIncidents = incidents.filter(i => {
    const statusMatch = filterStatus === 'الكل' || i.status === filterStatus;
    const regionMatch = filterRegion === '' || i.region === filterRegion;
    return statusMatch && regionMatch;
  });

  // Filter Regions List for Dropdown Search
  const filteredRegionsList = REGIONS_DATA.filter(r => 
    r.region.includes(regionSearch)
  );

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pb-20 pr-2">
      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-center z-20 relative">
        <div className="flex items-center gap-2 text-gray-400 pl-4 border-l border-white/10 w-full sm:w-auto">
            <Filter size={18} />
            <span className="text-sm font-medium">تصفية</span>
        </div>
        
        {/* Status Filter (Standard Select) */}
        <div className="relative flex-1 sm:flex-none">
            <select 
                className="appearance-none w-full bg-black/30 text-white pl-10 pr-4 py-2 rounded-lg border border-white/10 text-sm focus:border-lime-500 focus:outline-none min-w-[140px]"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
            >
                <option value="الكل">جميع الحالات</option>
                {MOCK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="absolute left-3 top-3 text-gray-500 pointer-events-none" />
        </div>

        {/* Region Filter (Custom Searchable Dropdown) */}
        <div className="relative flex-1 sm:flex-none" ref={regionDropdownRef}>
            <button 
                onClick={() => setIsRegionOpen(!isRegionOpen)}
                className="flex items-center justify-between w-full bg-black/30 text-white pl-4 pr-4 py-2 rounded-lg border border-white/10 text-sm focus:border-lime-500 focus:outline-none min-w-[180px] hover:bg-white/5 transition-colors"
            >
                <span className="truncate">{filterRegion || 'كل المناطق'}</span>
                <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${isRegionOpen ? 'rotate-180' : ''}`} />
            </button>

            {isRegionOpen && (
                <div className="absolute top-full right-0 mt-2 w-full sm:w-64 bg-[#1a1c15] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in-50">
                    <div className="p-2 border-b border-white/10 sticky top-0 bg-[#1a1c15] z-10">
                        <div className="relative">
                            <Search size={14} className="absolute right-3 top-2.5 text-gray-500" />
                            <input 
                                type="text" 
                                placeholder="بحث عن منطقة..." 
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pr-9 pl-3 text-xs text-white focus:outline-none focus:border-lime-500/50"
                                value={regionSearch}
                                onChange={(e) => setRegionSearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        <button
                            onClick={() => { setFilterRegion(''); setIsRegionOpen(false); }}
                            className={`w-full text-right px-3 py-2 rounded-lg text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${filterRegion === '' ? 'bg-lime-500/10 text-lime-400' : 'text-gray-300'}`}
                        >
                            <span className="font-medium">كل المناطق</span>
                            <span className="bg-white/5 px-1.5 py-0.5 rounded text-[10px] text-gray-500 font-mono">
                                {totalFilteredByStatus}
                            </span>
                        </button>
                        
                        {filteredRegionsList.map(r => {
                            const count = regionCounts[r.region] || 0;
                            const isSelected = filterRegion === r.region;
                            return (
                                <button
                                    key={r.region}
                                    onClick={() => { setFilterRegion(r.region); setIsRegionOpen(false); }}
                                    className={`w-full text-right px-3 py-2 rounded-lg text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${isSelected ? 'bg-lime-500/10 text-lime-400' : 'text-gray-300'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        {isSelected && <Check size={12} />}
                                        <span className={isSelected ? 'font-bold' : ''}>{r.region}</span>
                                    </div>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${count > 0 ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-600'}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                        
                        {filteredRegionsList.length === 0 && (
                            <div className="text-center py-4 text-xs text-gray-600">لا توجد نتائج</div>
                        )}
                    </div>
                </div>
            )}
        </div>

        <div className="mr-auto text-sm text-gray-400 w-full sm:w-auto text-left sm:text-right">
            عدد النتائج: <span className="text-white font-bold">{filteredIncidents.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {filteredIncidents.map(incident => (
            <IncidentCard 
              key={incident.id} 
              incident={incident} 
              onShowOnMap={onShowOnMap} 
              onDispatchTeams={onDispatchTeams} 
              onOpenDetails={onOpenDetails}
              onSecurityRouteClick={onSecurityDispatch}
            />
        ))}
        {filteredIncidents.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                <Search size={48} className="mb-4 opacity-20" />
                <p>لا توجد بلاغات تطابق شروط البحث</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default IncidentsList;
