import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PortalChooser } from './views/PortalChooser';
import { CustomerLogin } from './views/CustomerLogin';
import { CitySelection } from './views/CitySelection';
import { HomePreferences } from './views/HomePreferences';
import { MatchingFlats } from './views/MatchingFlats';
import { FlatDetail } from './views/FlatDetail';
import { DeveloperStocks } from './views/DeveloperStocks';
import { AgentLogin } from './views/AgentLogin';
import { AgentFlats } from './views/AgentFlats';
import { CompanyProjects } from './views/CompanyProjects';
import { LocationLeads } from './views/LocationLeads';
import { BuyerProfile } from './views/BuyerProfile';
import { LeadManagementDashboard } from './views/LeadManagementDashboard';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'portal-chooser':
        return <PortalChooser />;
      case 'customer-login':
        return <CustomerLogin />;
      case 'customer-city-select':
        return <CitySelection />;
      case 'customer-preferences':
        return <HomePreferences />;
      case 'customer-matching-flats':
        return <MatchingFlats />;
      case 'customer-flat-detail':
        return <FlatDetail />;
      case 'customer-developer-stocks':
        return <DeveloperStocks />;
      case 'agent-login':
        return <AgentLogin />;
      case 'agent-flats':
        return <AgentFlats />;
      case 'agent-company-projects':
        return <CompanyProjects />;
      case 'agent-location-leads':
        return <LocationLeads />;
      case 'agent-lead-profile':
        return <BuyerProfile />;
      case 'agent-lead-dashboard':
        return <LeadManagementDashboard />;
      default:
        return <PortalChooser />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F5F3] text-[#152226]">
      <Header />
      <main className="flex-1 flex flex-col">
        {renderCurrentView()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
