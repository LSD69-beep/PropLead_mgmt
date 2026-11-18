import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BuyerLead, LeadStatus } from '../types';
import {
  TrendingUp,
  Users,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  ChevronRight,
  DollarSign,
  Layers,
  Sparkles,
  SlidersHorizontal,
  X,
} from 'lucide-react';

const KANBAN_STAGES: LeadStatus[] = [
  'Initial Inquiry',
  'Audit Report Viewed',
  'Callback Requested',
  'Shortlisted',
  'Site Visit Scheduled',
  'Site Visit Completed',
  'Loan Pre-Approved',
  'Negotiation',
  'Advance Placed',
];

export const LeadManagementDashboard: React.FC = () => {
  const {
    buyerLeads,
    updateLeadStatus,
    updateLeadProbability,
    addNewLead,
    activeHub,
    navigate,
    selectedCompany,
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [companyFilter, setCompanyFilter] = useState<string>('All');
  const [temperatureFilter, setTemperatureFilter] = useState<'All' | 'Hot' | 'Warm' | 'Cold'>('All');
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  // New Lead form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCompany, setNewCompany] = useState('Sobha Limited');
  const [newProject, setNewProject] = useState('Sobha Neopolis');
  const [newPlace, setNewPlace] = useState('Panathur Road, East Bengaluru');
  const [newConfig, setNewConfig] = useState('3 BHK');
  const [newBudget, setNewBudget] = useState('1 Cr – 2 Cr');
  const [newBudgetNum, setNewBudgetNum] = useState(160);
  const [newStatus, setNewStatus] = useState<LeadStatus>('Site Visit Scheduled');
  const [newProb, setNewProb] = useState(70);

  // Filtered leads
  const filteredLeads = buyerLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'All' || lead.status === stageFilter;
    const matchesCompany = companyFilter === 'All' || lead.company === companyFilter;
    const matchesTemp =
      temperatureFilter === 'All' ||
      (temperatureFilter === 'Hot' && lead.probability >= 75) ||
      (temperatureFilter === 'Warm' && lead.probability >= 50 && lead.probability < 75) ||
      (temperatureFilter === 'Cold' && lead.probability < 50);

    return matchesSearch && matchesStage && matchesCompany && matchesTemp;
  });

  // Analytics Metrics
  const totalLeads = buyerLeads.length;
  const avgProb =
    totalLeads > 0
      ? Math.round(buyerLeads.reduce((acc, l) => acc + l.probability, 0) / totalLeads)
      : 0;

  // Weighted Pipeline: sum of (budgetNum * probability / 100) in Lakhs -> Cr
  const totalPipelineLakhs = buyerLeads.reduce(
    (acc, l) => acc + (l.budgetNum * l.probability) / 100,
    0
  );
  const totalPipelineCr = (totalPipelineLakhs / 100).toFixed(2);

  const readyToCloseCount = buyerLeads.filter((l) => l.probability >= 75).length;

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    addNewLead({
      name: newName,
      email: newEmail,
      phone: newPhone,
      company: newCompany,
      project: newProject,
      place: newPlace,
      config: newConfig,
      budget: newBudget,
      budgetNum: newBudgetNum,
      requirement: `${newConfig} • ${newBudget}`,
      status: newStatus,
      probability: newProb,
      occupation: 'Tech Consultant • Bengaluru',
      city: 'Bengaluru',
      contactTime: 'Weekdays after 6 PM',
      family: '3 Members',
      purpose: 'Own / Self-Use',
      loan: 'In Progress',
      possession: '2026',
      notes: `Lead registered via Advisor Conversion Dashboard on ${new Date().toLocaleDateString()}. Initial inquiry logged.`,
      assignedAgent: 'Vikramaditya (Senior Advisor)',
    });

    setShowAddLeadModal(false);
    // Reset form
    setNewName('');
    setNewEmail('');
    setNewPhone('');
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'Advance Placed':
        return 'bg-[#DCFCE7] text-[#14532D] border-[#1F7A4C]/30';
      case 'Negotiation':
      case 'Loan Pre-Approved':
        return 'bg-[#D2E8ED] text-[#09323D] border-[#0F4C5C]/30';
      case 'Site Visit Completed':
      case 'Site Visit Scheduled':
        return 'bg-[#FCE8E0] text-[#5C220D] border-[#B44D27]/30';
      default:
        return 'bg-[#F2F5F3] text-[#4B5E63] border-[#D0DDD7]';
    }
  };

  const getProbColor = (prob: number) => {
    if (prob >= 75) return 'text-[#1F7A4C]';
    if (prob >= 50) return 'text-[#0F4C5C]';
    return 'text-[#B44D27]';
  };

  const getBarColor = (prob: number) => {
    if (prob >= 75) return 'bg-[#1F7A4C]';
    if (prob >= 50) return 'bg-[#0F4C5C]';
    return 'bg-[#B44D27]';
  };

  const advanceStage = (lead: BuyerLead) => {
    const currentIndex = KANBAN_STAGES.indexOf(lead.status);
    if (currentIndex < KANBAN_STAGES.length - 1) {
      const nextStage = KANBAN_STAGES[currentIndex + 1];
      updateLeadStatus(lead.id, nextStage);
    }
  };

  const retreatStage = (lead: BuyerLead) => {
    const currentIndex = KANBAN_STAGES.indexOf(lead.status);
    if (currentIndex > 0) {
      const prevStage = KANBAN_STAGES[currentIndex - 1];
      updateLeadStatus(lead.id, prevStage);
    }
  };

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 bg-[#F2F5F3]">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D0DDD7]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FCE8E0] text-[#B44D27] font-['Red_Hat_Mono'] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Multi-Tenant CRM
              </span>
              <span className="text-xs font-['Red_Hat_Mono'] text-[#4B5E63]">
                {activeHub.name}
              </span>
            </div>

            <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-[#152226] text-balance">
              Lead Management Dashboard
            </h1>

            <p className="text-sm text-[#4B5E63]">
              Track conversion stages, site visits, loan pre-approvals, and booking advance milestones in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddLeadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F4C5C] hover:bg-[#09323D] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Buyer Lead</span>
            </button>

            {/* View Switcher: Kanban vs Table */}
            <div className="p-1 rounded-xl bg-white border border-[#D0DDD7] flex items-center gap-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-[#B44D27] text-white shadow-xs'
                    : 'text-[#4B5E63] hover:text-[#152226]'
                }`}
              >
                Kanban Pipeline
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#B44D27] text-white shadow-xs'
                    : 'text-[#4B5E63] hover:text-[#152226]'
                }`}
              >
                Table View
              </button>
            </div>
          </div>
        </div>

        {/* Analytics KPI Strip */}
        <section
          aria-label="Lead conversion key metrics"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="rounded-2xl bg-white border border-[#D0DDD7] p-5 shadow-xs flex flex-col gap-1">
            <span className="text-xs font-semibold text-[#4B5E63]">Total Active Leads</span>
            <span className="font-['Playfair_Display'] text-3xl font-bold text-[#152226] tabular-nums">
              {totalLeads}
            </span>
            <span className="text-[11px] text-[#1F7A4C] font-medium">100% Verified buyer intent</span>
          </div>

          <div className="rounded-2xl bg-white border border-[#D0DDD7] p-5 shadow-xs flex flex-col gap-1">
            <span className="text-xs font-semibold text-[#4B5E63]">Weighted Pipeline Value</span>
            <span className="font-['Playfair_Display'] text-3xl font-bold text-[#0F4C5C] tabular-nums">
              ₹{totalPipelineCr} Cr
            </span>
            <span className="text-[11px] text-[#4B5E63]">Probability-adjusted volume</span>
          </div>

          <div className="rounded-2xl bg-white border border-[#D0DDD7] p-5 shadow-xs flex flex-col gap-1">
            <span className="text-xs font-semibold text-[#4B5E63]">Average Conversion Probability</span>
            <span className="font-['Playfair_Display'] text-3xl font-bold text-[#B44D27] tabular-nums">
              {avgProb}%
            </span>
            <span className="text-[11px] text-[#4B5E63]">Across all regional locations</span>
          </div>

          <div className="rounded-2xl bg-white border border-[#D0DDD7] p-5 shadow-xs flex flex-col gap-1">
            <span className="text-xs font-semibold text-[#4B5E63]">High-Probability Deals (≥75%)</span>
            <span className="font-['Playfair_Display'] text-3xl font-bold text-[#1F7A4C] tabular-nums">
              {readyToCloseCount}
            </span>
            <span className="text-[11px] text-[#1F7A4C] font-medium">Ready for booking advance</span>
          </div>
        </section>

        {/* Visual Conversion Funnel & Lead Temperature Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Conversion Funnel Analytics */}
          <section
            aria-label="Conversion funnel analytics"
            className="lg:col-span-7 rounded-2xl bg-white border border-[#D0DDD7] p-6 sm:p-7 shadow-xs flex flex-col gap-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#D0DDD7]">
              <div>
                <span className="text-xs uppercase font-bold text-[#B44D27] tracking-wider">
                  Conversion Analytics
                </span>
                <h2 className="font-['Montserrat'] text-xl font-bold text-[#152226]">
                  6-Stage Advisor Conversion Funnel
                </h2>
              </div>
              <span className="text-xs font-['Red_Hat_Mono'] text-[#4B5E63]">
                {totalLeads} Total Ingested Leads
              </span>
            </div>

            {(() => {
              // Calculate counts along the funnel
              const s1Count = buyerLeads.length;
              const s2Count = buyerLeads.filter((l) =>
                ['Audit Report Viewed', 'Callback Requested', 'Shortlisted', 'Site Visit Scheduled', 'Site Visit Completed', 'Loan Pre-Approved', 'Negotiation', 'Advance Placed'].includes(l.status)
              ).length;
              const s3Count = buyerLeads.filter((l) =>
                ['Site Visit Scheduled', 'Site Visit Completed', 'Loan Pre-Approved', 'Negotiation', 'Advance Placed'].includes(l.status)
              ).length;
              const s4Count = buyerLeads.filter((l) =>
                ['Site Visit Completed', 'Loan Pre-Approved', 'Negotiation', 'Advance Placed'].includes(l.status)
              ).length;
              const s5Count = buyerLeads.filter((l) =>
                ['Loan Pre-Approved', 'Negotiation', 'Advance Placed'].includes(l.status)
              ).length;
              const s6Count = buyerLeads.filter((l) =>
                ['Advance Placed'].includes(l.status)
              ).length;

              const funnelSteps = [
                { stage: '1. Initial Inquiry & Diligence', count: s1Count, pct: 100, color: '#0F4C5C' },
                { stage: '2. Audit Dossier Review', count: s2Count, pct: Math.round((s2Count / (s1Count || 1)) * 100), color: '#1B6A7E' },
                { stage: '3. Site Visit Walkthrough', count: s3Count, pct: Math.round((s3Count / (s1Count || 1)) * 100), color: '#278AA1' },
                { stage: '4. Physical Laser Audit Done', count: s4Count, pct: Math.round((s4Count / (s1Count || 1)) * 100), color: '#4D9EA8' },
                { stage: '5. Bank Loan Pre-Approval', count: s5Count, pct: Math.round((s5Count / (s1Count || 1)) * 100), color: '#B44D27' },
                { stage: '6. Advance Placed (Deal Won)', count: s6Count, pct: Math.round((s6Count / (s1Count || 1)) * 100), color: '#1F7A4C' },
              ];

              return (
                <div className="space-y-3">
                  {funnelSteps.map((f, i) => (
                    <div key={f.stage} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#152226] flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
                          {f.stage}
                        </span>
                        <div className="flex items-center gap-2 font-['Red_Hat_Mono'] tabular-nums">
                          <span className="font-bold text-[#152226]">{f.count} leads</span>
                          <span className="text-[#4B5E63]">({f.pct}%)</span>
                        </div>
                      </div>

                      <div className="h-4 w-full bg-[#F2F5F3] rounded-md overflow-hidden p-0.5 border border-[#D0DDD7]/60">
                        <div
                          className="h-full rounded-sm transition-all duration-500"
                          style={{
                            width: `${Math.max(8, f.pct)}%`,
                            backgroundColor: f.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            <div className="p-3 rounded-xl bg-[#F9FBFA] border border-[#D0DDD7] text-[11px] text-[#4B5E63] flex items-center justify-between">
              <span>Primary Bottleneck: Transition from Site Visit to Bank Loan Approval</span>
              <span className="font-bold text-[#0F4C5C]">Advisor Action: Expedite HDFC/SBI APF ties</span>
            </div>
          </section>

          {/* Right: Lead Temperature & Revenue Timeline */}
          <section
            aria-label="Lead temperature and revenue projections"
            className="lg:col-span-5 rounded-2xl bg-white border border-[#D0DDD7] p-6 sm:p-7 shadow-xs flex flex-col gap-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#D0DDD7]">
              <div>
                <span className="text-xs uppercase font-bold text-[#B44D27] tracking-wider">
                  Pipeline Health
                </span>
                <h2 className="font-['Montserrat'] text-xl font-bold text-[#152226]">
                  Lead Temperature Velocity
                </h2>
              </div>
              <span className="text-xs text-[#4B5E63]">Click segment to filter</span>
            </div>

            {(() => {
              const hotLeads = buyerLeads.filter((l) => l.probability >= 75);
              const warmLeads = buyerLeads.filter((l) => l.probability >= 50 && l.probability < 75);
              const coldLeads = buyerLeads.filter((l) => l.probability < 50);

              const hotValCr = (hotLeads.reduce((a, b) => a + b.budgetNum, 0) / 100).toFixed(2);
              const warmValCr = (warmLeads.reduce((a, b) => a + b.budgetNum, 0) / 100).toFixed(2);
              const coldValCr = (coldLeads.reduce((a, b) => a + b.budgetNum, 0) / 100).toFixed(2);

              return (
                <div className="flex flex-col gap-4">
                  {/* Visual Segment Meter */}
                  <div className="h-6 w-full rounded-xl overflow-hidden flex shadow-2xs border border-[#D0DDD7]">
                    <div
                      style={{ width: `${(hotLeads.length / (totalLeads || 1)) * 100}%` }}
                      className="bg-[#1F7A4C] h-full"
                      title={`Hot Deals: ${hotLeads.length}`}
                    />
                    <div
                      style={{ width: `${(warmLeads.length / (totalLeads || 1)) * 100}%` }}
                      className="bg-[#0F4C5C] h-full"
                      title={`Warm Deals: ${warmLeads.length}`}
                    />
                    <div
                      style={{ width: `${(coldLeads.length / (totalLeads || 1)) * 100}%` }}
                      className="bg-[#B44D27] h-full"
                      title={`Cold Deals: ${coldLeads.length}`}
                    />
                  </div>

                  {/* 3 Clickable Filter Cards */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTemperatureFilter(temperatureFilter === 'Hot' ? 'All' : 'Hot')}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        temperatureFilter === 'Hot'
                          ? 'bg-[#DCFCE7] border-[#1F7A4C] ring-2 ring-[#1F7A4C]'
                          : 'bg-[#F9FBFA] border-[#D0DDD7] hover:border-[#1F7A4C]'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase text-[#14532D]">
                        🔥 Hot (≥75%)
                      </span>
                      <span className="text-lg font-bold font-['Red_Hat_Mono'] text-[#152226] tabular-nums">
                        {hotLeads.length} Deals
                      </span>
                      <span className="text-[10px] font-['Red_Hat_Mono'] text-[#1F7A4C] font-semibold tabular-nums">
                        ₹{hotValCr} Cr
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTemperatureFilter(temperatureFilter === 'Warm' ? 'All' : 'Warm')}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        temperatureFilter === 'Warm'
                          ? 'bg-[#E9F3F5] border-[#0F4C5C] ring-2 ring-[#0F4C5C]'
                          : 'bg-[#F9FBFA] border-[#D0DDD7] hover:border-[#0F4C5C]'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase text-[#09323D]">
                        ⚡ Warm (50-74%)
                      </span>
                      <span className="text-lg font-bold font-['Red_Hat_Mono'] text-[#152226] tabular-nums">
                        {warmLeads.length} Deals
                      </span>
                      <span className="text-[10px] font-['Red_Hat_Mono'] text-[#0F4C5C] font-semibold tabular-nums">
                        ₹{warmValCr} Cr
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTemperatureFilter(temperatureFilter === 'Cold' ? 'All' : 'Cold')}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        temperatureFilter === 'Cold'
                          ? 'bg-[#FCE8E0] border-[#B44D27] ring-2 ring-[#B44D27]'
                          : 'bg-[#F9FBFA] border-[#D0DDD7] hover:border-[#B44D27]'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase text-[#5C220D]">
                        ❄ Cold (&lt;50%)
                      </span>
                      <span className="text-lg font-bold font-['Red_Hat_Mono'] text-[#152226] tabular-nums">
                        {coldLeads.length} Deals
                      </span>
                      <span className="text-[10px] font-['Red_Hat_Mono'] text-[#B44D27] font-semibold tabular-nums">
                        ₹{coldValCr} Cr
                      </span>
                    </button>
                  </div>

                  {/* Projected 30/60/90 Day Pipeline Inflow */}
                  <div className="pt-3 border-t border-[#D0DDD7] flex flex-col gap-2">
                    <span className="text-xs font-bold text-[#152226]">
                      Projected Revenue Inflows (Close Timeframes)
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#4B5E63]">Next 30 Days (Ready to Sign)</span>
                        <span className="font-['Red_Hat_Mono'] font-bold text-[#1F7A4C] tabular-nums">
                          ₹{(parseFloat(hotValCr) * 0.75).toFixed(2)} Cr Expected
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#4B5E63]">30–60 Days (Post-Site Visits)</span>
                        <span className="font-['Red_Hat_Mono'] font-bold text-[#0F4C5C] tabular-nums">
                          ₹{(parseFloat(warmValCr) * 0.55).toFixed(2)} Cr Expected
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#4B5E63]">60–90 Days (Discovery &amp; Approvals)</span>
                        <span className="font-['Red_Hat_Mono'] font-bold text-[#4B5E63] tabular-nums">
                          ₹{(parseFloat(coldValCr) * 0.25).toFixed(2)} Cr Expected
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </section>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#D0DDD7]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex items-center min-w-[220px]">
              <Search className="w-4 h-4 text-[#4B5E63] absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search buyer name, project..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg bg-[#F2F5F3] border border-[#D0DDD7] text-[#152226] focus:bg-white focus:border-[#0F4C5C] outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#4B5E63]">Developer:</span>
              <select
                aria-label="Filter by developer"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="text-xs bg-[#F2F5F3] border border-[#D0DDD7] rounded-lg px-2.5 py-1.5 text-[#152226] font-medium cursor-pointer"
              >
                <option value="All">All Developers</option>
                <option value="Sobha Limited">Sobha Limited</option>
                <option value="Prestige Estates Projects Limited">Prestige Estates</option>
                <option value="Brigade Enterprises Limited">Brigade Enterprises</option>
                <option value="Godrej Properties Limited">Godrej Properties</option>
                <option value="DLF Limited">DLF Limited</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#4B5E63]">Stage:</span>
              <select
                aria-label="Filter by lead stage"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="text-xs bg-[#F2F5F3] border border-[#D0DDD7] rounded-lg px-2.5 py-1.5 text-[#152226] font-medium cursor-pointer"
              >
                <option value="All">All Stages</option>
                {KANBAN_STAGES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs font-['Red_Hat_Mono'] text-[#4B5E63] tabular-nums">
            Showing {filteredLeads.length} of {totalLeads} buyer leads
          </div>
        </div>

        {/* KANBAN BOARD VIEW */}
        {viewMode === 'kanban' ? (
          <div className="overflow-x-auto pb-4">
            <div className="flex items-start gap-4 min-w-[1280px]">
              {KANBAN_STAGES.map((stage) => {
                const stageLeads = filteredLeads.filter((l) => l.status === stage);
                return (
                  <div
                    key={stage}
                    className="flex-1 min-w-[270px] rounded-2xl bg-white border border-[#D0DDD7] p-3.5 shadow-xs flex flex-col gap-3"
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#D0DDD7]">
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-[#152226] truncate" title={stage}>
                          {stage}
                        </span>
                        <span className="text-[10px] text-[#4B5E63]">
                          {stageLeads.length} {stageLeads.length === 1 ? 'buyer' : 'buyers'}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#F2F5F3] border border-[#D0DDD7] text-[11px] font-['Red_Hat_Mono'] font-bold tabular-nums text-[#152226]">
                        {stageLeads.length}
                      </span>
                    </div>

                    {/* Cards List in Stage */}
                    <div className="flex flex-col gap-3 min-h-[300px]">
                      {stageLeads.map((lead) => {
                        return (
                          <div
                            key={lead.id}
                            className="rounded-xl bg-[#F2F5F3] hover:bg-white border border-[#D0DDD7] hover:border-[#B44D27] p-3.5 shadow-2xs hover:shadow-md transition-all flex flex-col gap-2.5 group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex flex-col">
                                <button
                                  onClick={() =>
                                    navigate('agent-lead-profile', {
                                      buyerId: lead.id,
                                      company: lead.company,
                                      project: lead.project,
                                      place: lead.place,
                                    })
                                  }
                                  className="text-left font-bold text-sm text-[#152226] hover:text-[#B44D27] transition-colors cursor-pointer"
                                >
                                  {lead.name}
                                </button>
                                <span className="text-[11px] text-[#4B5E63] truncate">
                                  {lead.project}
                                </span>
                              </div>

                              <span
                                className={`text-xs font-['Red_Hat_Mono'] font-bold tabular-nums ${getProbColor(
                                  lead.probability
                                )}`}
                              >
                                {lead.probability}%
                              </span>
                            </div>

                            {/* Probability Progress Bar */}
                            <div className="w-full h-2 rounded-full bg-[#E9EFEA] overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${getBarColor(
                                  lead.probability
                                )}`}
                                style={{ width: `${lead.probability}%` }}
                              />
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-[#4B5E63] pt-1 border-t border-[#D0DDD7]/60">
                              <span className="font-['Red_Hat_Mono'] font-semibold tabular-nums text-[#0F4C5C]">
                                {lead.budget}
                              </span>
                              <span>{lead.config}</span>
                            </div>

                            {/* One-click pipeline stage move controls */}
                            <div className="flex items-center justify-between pt-1 text-[11px]">
                              <button
                                onClick={() => retreatStage(lead)}
                                title="Move back to previous stage"
                                className="text-[#4B5E63] hover:text-[#152226] disabled:opacity-30 cursor-pointer"
                                disabled={KANBAN_STAGES.indexOf(lead.status) === 0}
                              >
                                ← Back
                              </button>

                              <button
                                onClick={() =>
                                  navigate('agent-lead-profile', {
                                    buyerId: lead.id,
                                    company: lead.company,
                                    project: lead.project,
                                    place: lead.place,
                                  })
                                }
                                className="text-[#0F4C5C] font-semibold hover:underline cursor-pointer"
                              >
                                Profile
                              </button>

                              <button
                                onClick={() => advanceStage(lead)}
                                title="Advance to next conversion stage"
                                className="text-[#B44D27] font-semibold hover:underline disabled:opacity-30 cursor-pointer"
                                disabled={
                                  KANBAN_STAGES.indexOf(lead.status) === KANBAN_STAGES.length - 1
                                }
                              >
                                Advance →
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {stageLeads.length === 0 && (
                        <div className="p-4 rounded-xl border border-dashed border-[#D0DDD7] text-center text-[11px] text-[#8FA3A8]">
                          No leads in this stage
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="rounded-2xl bg-white border border-[#D0DDD7] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F2F5F3] text-[#4B5E63] border-b border-[#D0DDD7] font-semibold">
                    <th className="py-3.5 px-4">Buyer Lead</th>
                    <th className="py-3.5 px-4">Target Property &amp; Developer</th>
                    <th className="py-3.5 px-4">Budget &amp; Config</th>
                    <th className="py-3.5 px-4">Conversion Stage</th>
                    <th className="py-3.5 px-4">Probability</th>
                    <th className="py-3.5 px-4">Contact &amp; Loan</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D0DDD7]/70 text-[#152226]">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#F2F5F3]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <button
                            onClick={() =>
                              navigate('agent-lead-profile', {
                                buyerId: lead.id,
                                company: lead.company,
                                project: lead.project,
                                place: lead.place,
                              })
                            }
                            className="text-left font-bold text-sm text-[#152226] hover:text-[#B44D27] transition-colors cursor-pointer"
                          >
                            {lead.name}
                          </button>
                          <span className="text-[11px] text-[#4B5E63]">{lead.occupation}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#152226]">{lead.project}</span>
                          <span className="text-[11px] text-[#4B5E63]">{lead.company}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col font-['Red_Hat_Mono'] tabular-nums">
                          <span className="font-bold text-[#0F4C5C]">{lead.budget}</span>
                          <span className="text-[11px] text-[#4B5E63]">{lead.config}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          aria-label={`Change stage for ${lead.name}`}
                          value={lead.status}
                          onChange={(e) =>
                            updateLeadStatus(lead.id, e.target.value as LeadStatus)
                          }
                          className="text-xs bg-[#F2F5F3] border border-[#D0DDD7] rounded-lg px-2.5 py-1 text-[#152226] font-semibold cursor-pointer"
                        >
                          {KANBAN_STAGES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4 min-w-[140px]">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[#4B5E63]">Score:</span>
                            <span
                              className={`font-['Red_Hat_Mono'] font-bold tabular-nums ${getProbColor(
                                lead.probability
                              )}`}
                            >
                              {lead.probability}%
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-[#E9EFEA] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getBarColor(lead.probability)}`}
                              style={{ width: `${lead.probability}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col text-[11px] text-[#4B5E63]">
                          <span>{lead.phone}</span>
                          <span className="text-[#1F7A4C] font-medium">{lead.loan}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() =>
                            navigate('agent-lead-profile', {
                              buyerId: lead.id,
                              company: lead.company,
                              project: lead.project,
                              place: lead.place,
                            })
                          }
                          className="px-3 py-1.5 rounded-lg bg-[#0F4C5C] hover:bg-[#09323D] text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Register New Buyer Lead Modal */}
        {showAddLeadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-[#D0DDD7] flex flex-col gap-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#D0DDD7]">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#B44D27]" />
                  <h3 className="font-['Montserrat'] font-bold text-lg text-[#152226]">
                    Register New Prospective Buyer
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddLeadModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLead} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#152226]">Buyer Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Meenal Joshi"
                      className="px-3.5 py-2 rounded-lg bg-[#F2F5F3] border border-[#D0DDD7] text-xs text-[#152226] focus:bg-white focus:border-[#B44D27] outline-hidden"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#152226]">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="px-3.5 py-2 rounded-lg bg-[#F2F5F3] border border-[#D0DDD7] text-xs text-[#152226] focus:bg-white focus:border-[#B44D27] outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#152226]">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="meenal.joshi@example.com"
                    className="px-3.5 py-2 rounded-lg bg-[#F2F5F3] border border-[#D0DDD7] text-xs text-[#152226] focus:bg-white focus:border-[#B44D27] outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#152226]">Developer Partner</label>
                    <select
                      value={newCompany}
                      onChange={(e) => {
                        setNewCompany(e.target.value);
                        if (e.target.value === 'Sobha Limited') {
                          setNewProject('Sobha Neopolis');
                          setNewPlace('Panathur Road, East Bengaluru');
                        } else if (e.target.value === 'Prestige Estates Projects Limited') {
                          setNewProject('Prestige Park Grove');
                          setNewPlace('Whitefield, East Bengaluru');
                        } else {
                          setNewProject('Brigade Utopia');
                          setNewPlace('Varthur Main Rd, East Bengaluru');
                        }
                      }}
                      className="px-3.5 py-2 rounded-lg bg-[#F2F5F3] border border-[#D0DDD7] text-xs text-[#152226]"
                    >
                      <option value="Sobha Limited">Sobha Limited</option>
                      <option value="Prestige Estates Projects Limited">Prestige Estates</option>
                      <option value="Brigade Enterprises Limited">Brigade Enterprises</option>
                      <option value="Godrej Properties Limited">Godrej Properties</option>
                      <option value="DLF Limited">DLF Limited</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#152226]">Target Project</label>
                    <input
                      type="text"
                      required
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                      className="px-3.5 py-2 rounded-lg bg-[#F2F5F3] border border-[#D0DDD7] text-xs text-[#152226]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#152226]">Configuration</label>
                    <select
                      value={newConfig}
                      onChange={(e) => setNewConfig(e.target.value)}
                      className="px-3.5 py-2 rounded-lg bg-[#F2F5F3] border border-[#D0DDD7] text-xs text-[#152226]"
                    >
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4+ BHK">4+ BHK</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#152226]">Budget Range</label>
                    <select
                      value={newBudget}
                      onChange={(e) => {
                        setNewBudget(e.target.value);
                        if (e.target.value === '< 50 Lakhs') setNewBudgetNum(45);
                        else if (e.target.value === '50L – 1 Cr') setNewBudgetNum(85);
                        else if (e.target.value === '1 Cr – 2 Cr') setNewBudgetNum(165);
                        else setNewBudgetNum(230);
                      }}
                      className="px-3.5 py-2 rounded-lg bg-[#F2F5F3] border border-[#D0DDD7] text-xs text-[#152226]"
                    >
                      <option value="< 50 Lakhs">&lt; 50 Lakhs</option>
                      <option value="50L – 1 Cr">50L – 1 Cr</option>
                      <option value="1 Cr – 2 Cr">1 Cr – 2 Cr</option>
                      <option value="> 2 Cr">&gt; 2 Cr</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#152226]">Initial Stage</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as LeadStatus)}
                      className="px-3.5 py-2 rounded-lg bg-[#F2F5F3] border border-[#D0DDD7] text-xs text-[#152226]"
                    >
                      {KANBAN_STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#152226]">
                      <span>Conversion Probability</span>
                      <span className="font-['Red_Hat_Mono'] text-[#B44D27]">{newProb}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={newProb}
                      onChange={(e) => setNewProb(parseInt(e.target.value, 10))}
                      className="w-full mt-2 accent-[#B44D27] cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D0DDD7] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddLeadModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#F2F5F3] text-[#4B5E63] text-xs font-semibold hover:text-[#152226] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#B44D27] hover:bg-[#5C220D] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    Register Lead in CRM
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
