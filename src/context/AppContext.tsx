import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  City,
  DirectionZone,
  PropertyPurpose,
  Bedrooms,
  BudgetRange,
  UserRole,
  AppView,
  BuyerLead,
  LeadStatus,
  TenantHub,
} from '../types';
import { INITIAL_BUYER_LEADS, TENANT_HUBS } from '../data/mockData';

interface AppContextType {
  // Navigation & User Role
  role: UserRole;
  setRole: (r: UserRole) => void;
  currentView: AppView;
  navigate: (view: AppView, params?: Record<string, string>) => void;
  goBack: () => void;
  canGoBack: boolean;
  activeHub: TenantHub;
  setActiveHub: (hub: TenantHub) => void;
  navigationHistory: AppView[];

  // Customer State
  customerName: string;
  setCustomerName: (name: string) => void;
  customerEmail: string;
  setCustomerEmail: (email: string) => void;
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  selectedZone: DirectionZone | null;
  setSelectedZone: (zone: DirectionZone | null) => void;
  preferredPurpose: PropertyPurpose;
  setPreferredPurpose: (p: PropertyPurpose) => void;
  preferredBedrooms: Bedrooms;
  setPreferredBedrooms: (b: Bedrooms) => void;
  preferredBudget: BudgetRange;
  setPreferredBudget: (b: BudgetRange) => void;
  selectedFlatId: string;
  setSelectedFlatId: (id: string) => void;
  selectedDeveloperId: string;
  setSelectedDeveloperId: (id: string) => void;
  followedStocks: Record<string, boolean>;
  toggleFollowStock: (id: string) => void;
  savedFlatIds: string[];
  toggleSaveFlat: (id: string) => void;

  // Agent State
  agentName: string;
  setAgentName: (name: string) => void;
  agentPartnerId: string;
  setAgentPartnerId: (id: string) => void;
  selectedCompany: string;
  setSelectedCompany: (company: string) => void;
  selectedProjectName: string;
  setSelectedProjectName: (project: string) => void;
  selectedProjectPlace: string;
  setSelectedProjectPlace: (place: string) => void;
  selectedBuyerId: string;
  setSelectedBuyerId: (id: string) => void;
  buyerLeads: BuyerLead[];
  updateLeadStatus: (leadId: string, status: LeadStatus, newProb?: number) => void;
  updateLeadProbability: (leadId: string, prob: number) => void;
  addLeadNote: (leadId: string, noteText: string) => void;
  addNewLead: (lead: Omit<BuyerLead, 'id' | 'lastActivityDate'>) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Role
  const [role, setRoleState] = useState<UserRole>(() => {
    try {
      return (localStorage.getItem('gw_role') as UserRole) || null;
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentViewState] = useState<AppView>(() => {
    try {
      return (localStorage.getItem('gw_view') as AppView) || 'portal-chooser';
    } catch {
      return 'portal-chooser';
    }
  });

  const [navigationHistory, setNavigationHistory] = useState<AppView[]>(['portal-chooser']);

  const [activeHub, setActiveHub] = useState<TenantHub>(TENANT_HUBS[0]);

  // Customer State
  const [customerName, setCustomerName] = useState<string>(() => {
    return localStorage.getItem('gw_cust_name') || 'Priya Sharma';
  });
  const [customerEmail, setCustomerEmail] = useState<string>(() => {
    return localStorage.getItem('gw_cust_email') || 'priya.sharma@example.com';
  });
  const [selectedCity, setSelectedCity] = useState<City>(() => {
    return (localStorage.getItem('gw_city') as City) || 'Bangalore';
  });
  const [selectedZone, setSelectedZone] = useState<DirectionZone | null>(() => {
    return (localStorage.getItem('gw_zone') as DirectionZone) || 'East';
  });
  const [preferredPurpose, setPreferredPurpose] = useState<PropertyPurpose>(() => {
    return (localStorage.getItem('gw_purpose') as PropertyPurpose) || 'Own';
  });
  const [preferredBedrooms, setPreferredBedrooms] = useState<Bedrooms>(() => {
    return (localStorage.getItem('gw_bedrooms') as Bedrooms) || '3 BHK';
  });
  const [preferredBudget, setPreferredBudget] = useState<BudgetRange>(() => {
    return (localStorage.getItem('gw_budget') as BudgetRange) || '1 Cr – 2 Cr';
  });

  const [selectedFlatId, setSelectedFlatId] = useState<string>('blr-1');
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string>('PRESTIGE');

  const [followedStocks, setFollowedStocks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('gw_followed_stocks');
      return saved ? JSON.parse(saved) : { PRESTIGE: true };
    } catch {
      return { PRESTIGE: true };
    }
  });

  const [savedFlatIds, setSavedFlatIds] = useState<string[]>(['blr-1', 'blr-2']);

  // Agent State
  const [agentName, setAgentName] = useState<string>(() => {
    return localStorage.getItem('gw_agent_name') || 'Vikramaditya (Senior Advisor)';
  });
  const [agentPartnerId, setAgentPartnerId] = useState<string>(() => {
    return localStorage.getItem('gw_agent_partner_id') || 'GW-RERA-2048';
  });
  const [selectedCompany, setSelectedCompany] = useState<string>('Sobha Limited');
  const [selectedProjectName, setSelectedProjectName] = useState<string>('Sobha Neopolis');
  const [selectedProjectPlace, setSelectedProjectPlace] = useState<string>('Panathur Road, East Bengaluru');
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>('rohan');

  const [buyerLeads, setBuyerLeads] = useState<BuyerLead[]>(() => {
    try {
      const saved = localStorage.getItem('gw_buyer_leads');
      return saved ? JSON.parse(saved) : INITIAL_BUYER_LEADS;
    } catch {
      return INITIAL_BUYER_LEADS;
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      if (role) localStorage.setItem('gw_role', role);
      localStorage.setItem('gw_view', currentView);
      localStorage.setItem('gw_city', selectedCity);
      if (selectedZone) localStorage.setItem('gw_zone', selectedZone);
      localStorage.setItem('gw_purpose', preferredPurpose);
      localStorage.setItem('gw_bedrooms', preferredBedrooms);
      localStorage.setItem('gw_budget', preferredBudget);
      localStorage.setItem('gw_followed_stocks', JSON.stringify(followedStocks));
      localStorage.setItem('gw_buyer_leads', JSON.stringify(buyerLeads));
      localStorage.setItem('gw_cust_name', customerName);
      localStorage.setItem('gw_cust_email', customerEmail);
      localStorage.setItem('gw_agent_name', agentName);
      localStorage.setItem('gw_agent_partner_id', agentPartnerId);
    } catch {
      // ignore
    }
  }, [
    role,
    currentView,
    selectedCity,
    selectedZone,
    preferredPurpose,
    preferredBedrooms,
    preferredBudget,
    followedStocks,
    buyerLeads,
    customerName,
    customerEmail,
    agentName,
    agentPartnerId,
  ]);

  const setRole = (r: UserRole) => {
    setRoleState(r);
  };

  const navigate = (view: AppView, params?: Record<string, string>) => {
    if (params) {
      if (params.flatId) setSelectedFlatId(params.flatId);
      if (params.devId) setSelectedDeveloperId(params.devId);
      if (params.company) setSelectedCompany(params.company);
      if (params.project) setSelectedProjectName(params.project);
      if (params.place) setSelectedProjectPlace(params.place);
      if (params.buyerId) setSelectedBuyerId(params.buyerId);
      if (params.city) setSelectedCity(params.city as City);
    }

    setNavigationHistory((prev) => [...prev, view]);
    setCurrentViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // pop current
      const previous = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentViewState(previous);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Default fallback
      if (role === 'customer') {
        setCurrentViewState('customer-matching-flats');
      } else if (role === 'agent') {
        setCurrentViewState('agent-flats');
      } else {
        setCurrentViewState('portal-chooser');
      }
    }
  };

  const canGoBack = navigationHistory.length > 1;

  const toggleFollowStock = (id: string) => {
    setFollowedStocks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSaveFlat = (id: string) => {
    setSavedFlatIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const updateLeadStatus = (leadId: string, status: LeadStatus, newProb?: number) => {
    setBuyerLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;

        // Auto calculate reasonable probability based on stage if not provided
        let prob = newProb !== undefined ? newProb : lead.probability;
        if (newProb === undefined) {
          switch (status) {
            case 'Initial Inquiry':
              prob = 30;
              break;
            case 'Audit Report Viewed':
              prob = 45;
              break;
            case 'Callback Requested':
              prob = 50;
              break;
            case 'Shortlisted':
              prob = 60;
              break;
            case 'Site Visit Scheduled':
              prob = 70;
              break;
            case 'Site Visit Completed':
              prob = 85;
              break;
            case 'Loan Pre-Approved':
              prob = 88;
              break;
            case 'Negotiation':
              prob = 92;
              break;
            case 'Advance Placed':
              prob = 100;
              break;
            case 'Closed / Dropped':
              prob = 10;
              break;
          }
        }

        return {
          ...lead,
          status,
          probability: Math.min(100, Math.max(0, prob)),
          lastActivityDate: 'Just now',
        };
      })
    );
  };

  const updateLeadProbability = (leadId: string, prob: number) => {
    setBuyerLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        return {
          ...lead,
          probability: Math.min(100, Math.max(0, prob)),
          lastActivityDate: 'Just now',
        };
      })
    );
  };

  const addLeadNote = (leadId: string, noteText: string) => {
    setBuyerLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        return {
          ...lead,
          notes: `${noteText} • Added by ${agentName} (${new Date().toLocaleDateString()})\n\n${lead.notes}`,
          lastActivityDate: 'Just now',
        };
      })
    );
  };

  const addNewLead = (newLeadData: Omit<BuyerLead, 'id' | 'lastActivityDate'>) => {
    const newId = `lead-${Date.now()}`;
    const fullLead: BuyerLead = {
      ...newLeadData,
      id: newId,
      lastActivityDate: 'Just now',
    };
    setBuyerLeads((prev) => [fullLead, ...prev]);
  };

  const resetAllData = () => {
    setBuyerLeads(INITIAL_BUYER_LEADS);
    setSelectedCity('Bangalore');
    setSelectedZone('East');
    setPreferredPurpose('Own');
    setPreferredBedrooms('3 BHK');
    setPreferredBudget('1 Cr – 2 Cr');
    setCurrentViewState('portal-chooser');
    setNavigationHistory(['portal-chooser']);
    setRoleState(null);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentView,
        navigate,
        goBack,
        canGoBack,
        activeHub,
        setActiveHub,
        navigationHistory,

        customerName,
        setCustomerName,
        customerEmail,
        setCustomerEmail,
        selectedCity,
        setSelectedCity,
        selectedZone,
        setSelectedZone,
        preferredPurpose,
        setPreferredPurpose,
        preferredBedrooms,
        setPreferredBedrooms,
        preferredBudget,
        setPreferredBudget,
        selectedFlatId,
        setSelectedFlatId,
        selectedDeveloperId,
        setSelectedDeveloperId,
        followedStocks,
        toggleFollowStock,
        savedFlatIds,
        toggleSaveFlat,

        agentName,
        setAgentName,
        agentPartnerId,
        setAgentPartnerId,
        selectedCompany,
        setSelectedCompany,
        selectedProjectName,
        setSelectedProjectName,
        selectedProjectPlace,
        setSelectedProjectPlace,
        selectedBuyerId,
        setSelectedBuyerId,
        buyerLeads,
        updateLeadStatus,
        updateLeadProbability,
        addLeadNote,
        addNewLead,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
