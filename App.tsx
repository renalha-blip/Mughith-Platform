
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { ScreenId, Incident } from './types';
import { generateMockIncidents } from './utils';

// Screens
import NewIncident from './screens/NewIncident';
import Dashboard from './screens/Dashboard';
import IncidentsList from './screens/IncidentsList';
import MapScreen from './screens/MapScreen';
import Operations from './screens/Operations';
import IncidentDetails from './screens/IncidentDetails';
import GhayathAI from './screens/GhayathAI';
import Sensors from './screens/Sensors';
import Weather from './screens/Weather';
import Reports from './screens/Reports';

// Components
import SecurityRoutingModal from './components/SecurityRoutingModal';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('nav_new_incident');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [focusedIncidentId, setFocusedIncidentId] = useState<string | null>(null);
  const [operationsIncidentId, setOperationsIncidentId] = useState<string | null>(null);
  const [detailsIncidentId, setDetailsIncidentId] = useState<string | null>(null);
  
  // Responsive Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Security Modal State
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [selectedIncidentForSecurity, setSelectedIncidentForSecurity] = useState<Incident | null>(null);

  useEffect(() => {
    // Initialize mock data
    const data = generateMockIncidents(8);
    setIncidents(data);
  }, []);

  const handleShowOnMap = (incident: Incident) => {
    setFocusedIncidentId(incident.id);
    setActiveScreen('nav_map');
  };

  const handleDispatchTeams = (incident: Incident) => {
    setOperationsIncidentId(incident.id);
    setActiveScreen('nav_operations');
  };

  const handleOpenDetails = (incident: Incident) => {
    setDetailsIncidentId(incident.id);
    setActiveScreen('nav_incident_details');
  };

  const handleSecurityDispatch = (incident: Incident) => {
    // Open the modal instead of just navigating
    setSelectedIncidentForSecurity(incident);
    setIsSecurityModalOpen(true);
  };

  const handleNavigate = (screen: ScreenId) => {
    setActiveScreen(screen);
    // Close sidebar on mobile after navigation
    setIsSidebarOpen(false);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'nav_new_incident':
        return <NewIncident />;
      case 'nav_dashboard':
        return <Dashboard 
                  incidents={incidents} 
                  onShowOnMap={handleShowOnMap} 
                  onDispatchTeams={handleDispatchTeams} 
                  onOpenDetails={handleOpenDetails}
                  onSecurityDispatch={handleSecurityDispatch}
               />;
      case 'nav_incidents':
        return <IncidentsList 
                  incidents={incidents} 
                  onShowOnMap={handleShowOnMap} 
                  onDispatchTeams={handleDispatchTeams} 
                  onOpenDetails={handleOpenDetails}
                  onSecurityDispatch={handleSecurityDispatch}
               />;
      case 'nav_map':
        return <MapScreen incidents={incidents} focusedIncidentId={focusedIncidentId} />;
      case 'nav_operations':
        return <Operations incidents={incidents} initialSelectedIncidentId={operationsIncidentId} />;
      case 'nav_ghayath':
        return <GhayathAI incidents={incidents} />;
      case 'nav_sensors':
        return <Sensors 
                  incidents={incidents} 
                  onShowOnMap={handleShowOnMap} 
                  onOpenDetails={handleOpenDetails}
               />;
      case 'nav_weather':
        return <Weather incidents={incidents} />;
      case 'nav_reports':
        return <Reports incidents={incidents} />;
      case 'nav_incident_details':
        const selectedIncident = incidents.find(i => i.id === detailsIncidentId);
        return selectedIncident 
          ? <IncidentDetails 
                incident={selectedIncident} 
                onBack={() => setActiveScreen('nav_incidents')} 
                onSecurityDispatch={handleSecurityDispatch}
            />
          : <IncidentsList 
                incidents={incidents} 
                onShowOnMap={handleShowOnMap} 
                onDispatchTeams={handleDispatchTeams} 
                onOpenDetails={handleOpenDetails}
                onSecurityDispatch={handleSecurityDispatch}
            />;
      default:
        return (
          <div className="h-full flex items-center justify-center flex-col text-gray-500">
             <div className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center mb-4">
               <span className="text-2xl">🚧</span>
             </div>
             <p className="text-lg">هذه الشاشة قيد التطوير</p>
             <p className="text-sm opacity-50">{activeScreen}</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full max-w-[1440px] mx-auto overflow-hidden bg-[url('/static/theme/absher_bg.png')] bg-cover bg-center relative shadow-2xl">
      {/* Dark Overlay for background image */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c15] to-[#0c0e0b] opacity-95 -z-10"></div>
      
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-lime-900/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[150px] translate-x-1/4 translate-y-1/4 -z-10 pointer-events-none"></div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <Sidebar 
        activeScreen={activeScreen} 
        onNavigate={handleNavigate} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 relative h-full transition-all duration-300">
        <Header activeScreen={activeScreen} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-4 lg:p-6 overflow-hidden relative z-0">
          {renderScreen()}
        </main>
      </div>

      {/* Global Modals */}
      <SecurityRoutingModal 
          isOpen={isSecurityModalOpen} 
          onClose={() => setIsSecurityModalOpen(false)} 
          incident={selectedIncidentForSecurity} 
      />
    </div>
  );
};

export default App;
