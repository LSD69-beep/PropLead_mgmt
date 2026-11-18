import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BUILDING_LOCATIONS } from '../data/mockData';
import { ConstructionStage } from '../types';
import {
  Compass,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Building,
  Users,
} from 'lucide-react';

const STAGES: ('All' | ConstructionStage)[] = [
  'All',
  'Already Present',
  'Under Construction',
  'About to Start',
];

export const CompanyProjects: React.FC = () => {
  const { selectedCompany, setSelectedCompany, navigate } = useApp();
  const [activeStage, setActiveStage] = useState<'All' | ConstructionStage>('All');

  const buildings = BUILDING_LOCATIONS.filter((b) => {
    const matchesCompany = b.companyName === selectedCompany;
    const matchesStage = activeStage === 'All' || b.stage === activeStage;
    return matchesCompany && matchesStage;
  });

  const getStageBadgeColor = (stage: ConstructionStage) => {
    switch (stage) {
      case 'Already Present':
        return 'bg-[#DCFCE7] text-[#14532D] border-[#1F7A4C]/30';
      case 'Under Construction':
        return 'bg-[#D2E8ED] text-[#09323D] border-[#0F4C5C]/30';
      case 'About to Start':
        return 'bg-[#FCE8E0] text-[#5C220D] border-[#B44D27]/30';
    }
  };

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 bg-[#F2F5F3]">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#4B5E63]">
          <button
            onClick={() => navigate('agent-flats')}
            className="hover:text-[#B44D27] transition-colors cursor-pointer"
          >
            All Companies &amp; Flats
          </button>
          <span>/</span>
          <span className="text-[#152226] font-semibold">{selectedCompany}</span>
        </div>

        {/* Company Header with Dropdown & Stage Filters */}
        <section
          aria-label="Selected developer company"
          className="rounded-2xl bg-white border border-[#D0DDD7] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FCE8E0] text-[#B44D27] font-['Red_Hat_Mono'] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Developer Portfolio
              </span>
              <span className="text-xs font-['Red_Hat_Mono'] text-[#4B5E63]">
                RERA Registered Entity
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="font-['Playfair_Display'] text-2xl sm:text-4xl font-bold text-[#152226] text-balance">
                {selectedCompany}
              </h1>

              {/* Company Switcher */}
              <select
                aria-label="Switch developer company"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="text-xs bg-[#F2F5F3] border border-[#D0DDD7] rounded-lg px-2.5 py-1.5 text-[#152226] font-semibold cursor-pointer hidden sm:block"
              >
                <option value="Sobha Limited">Sobha Limited</option>
                <option value="Prestige Estates Projects Limited">Prestige Estates</option>
                <option value="Brigade Enterprises Limited">Brigade Enterprises</option>
                <option value="Godrej Properties Limited">Godrej Properties</option>
                <option value="DLF Limited">DLF Limited</option>
              </select>
            </div>

            <p className="text-xs sm:text-sm text-[#4B5E63]">
              All building sites across Already Present, Under Construction, and About to Start stages. Click any site map to view interested buyer leads.
            </p>
          </div>

          {/* Stage Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {STAGES.map((stage) => {
              const isSelected = activeStage === stage;
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setActiveStage(stage)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#B44D27] text-white border-[#B44D27] shadow-xs'
                      : 'bg-[#F2F5F3] text-[#4B5E63] border-[#D0DDD7] hover:text-[#152226] hover:bg-white'
                  }`}
                >
                  {stage}
                </button>
              );
            })}
          </div>
        </section>

        {/* Buildings & Embedded Locations Grid */}
        <section aria-label="Company buildings and locations" className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#152226] flex items-center gap-2">
              <Building className="w-5 h-5 text-[#B44D27]" />
              <span>Building Locations &amp; GIS Coordinates</span>
            </h2>
            <span className="text-xs font-['Red_Hat_Mono'] text-[#4B5E63] tabular-nums">
              {buildings.length} sites
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {buildings.map((b) => (
              <article
                key={b.id}
                className="rounded-2xl bg-white border border-[#D0DDD7] hover:border-[#B44D27] p-6 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between gap-5 group"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md border text-xs font-['Red_Hat_Mono'] font-bold ${getStageBadgeColor(
                        b.stage
                      )}`}
                    >
                      {b.stage}
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-['Red_Hat_Mono'] font-bold text-[#0F4C5C] bg-[#D2E8ED] px-2 py-0.5 rounded-md">
                      <Users className="w-3 h-3" />
                      {b.leadCount} Leads ({b.avgConversion}%)
                    </span>
                  </div>

                  <h3 className="font-['Montserrat'] text-lg font-bold text-[#152226]">
                    {b.name}
                  </h3>

                  {/* Embedded Location Map Widget (Clickable to View User Leads) */}
                  <div
                    onClick={() =>
                      navigate('agent-location-leads', {
                        company: selectedCompany,
                        project: b.name,
                        place: b.place,
                      })
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      (e.key === 'Enter' || e.key === ' ') &&
                      navigate('agent-location-leads', {
                        company: selectedCompany,
                        project: b.name,
                        place: b.place,
                      })
                    }
                    className="block rounded-xl bg-[#E9EFEA] border border-[#D0DDD7] overflow-hidden hover:border-[#B44D27] transition-all cursor-pointer group/map"
                    title="Click to view interested buyer leads for this location"
                  >
                    <svg
                      viewBox="0 0 320 150"
                      className="w-full h-36 block"
                      role="img"
                      aria-label={`Embedded GIS map for ${b.name}`}
                    >
                      <rect width="320" height="150" fill="#E9EFEA" />
                      {/* Grid streets */}
                      <path
                        d="M0 45 L320 45 M0 105 L320 105 M90 0 L90 150 M210 0 L210 150"
                        stroke="#D0DDD7"
                        strokeWidth="2"
                      />
                      <path
                        d="M20 130 Q 150 90 300 30"
                        fill="none"
                        stroke="#8FA3A8"
                        strokeWidth="2.5"
                        strokeDasharray="5 4"
                      />
                      {/* Interactive Pin with Ripple */}
                      <circle cx={b.pinX} cy={b.pinY} r="18" fill="#0F4C5C" fillOpacity="0.16" />
                      <circle
                        cx={b.pinX}
                        cy={b.pinY}
                        r="7"
                        fill="#B44D27"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                    </svg>

                    <div className="p-3 bg-white border-t border-[#D0DDD7] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-[#152226] font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#B44D27] shrink-0" />
                        <span className="truncate">{b.place}</span>
                      </div>
                      <span className="text-xs font-semibold text-[#B44D27] flex items-center gap-1 shrink-0 group-hover/map:underline">
                        View Leads
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-xs">
                    <span className="font-['Red_Hat_Mono'] text-[#4B5E63] tabular-nums">
                      GPS: {b.coords}
                    </span>
                    <span className="text-[#152226] font-medium">{b.units}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate('agent-location-leads', {
                      company: selectedCompany,
                      project: b.name,
                      place: b.place,
                    })
                  }
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F2F5F3] hover:bg-[#B44D27] hover:text-white text-[#152226] font-semibold text-xs border border-[#D0DDD7] transition-all cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Inspect Interested Buyers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </article>
            ))}
          </div>

          {buildings.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-white border border-[#D0DDD7] flex flex-col items-center gap-2">
              <Compass className="w-6 h-6 text-[#8FA3A8]" />
              <p className="text-xs text-[#4B5E63]">
                No projects found in this construction stage for {selectedCompany}.
              </p>
              <button
                onClick={() => setActiveStage('All')}
                className="text-xs font-semibold text-[#B44D27] hover:underline cursor-pointer"
              >
                Show All Stages
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
