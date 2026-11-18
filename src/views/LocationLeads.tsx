import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  TrendingUp,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Mail,
  Phone,
  SlidersHorizontal,
} from 'lucide-react';

export const LocationLeads: React.FC = () => {
  const {
    selectedCompany,
    selectedProjectName,
    selectedProjectPlace,
    buyerLeads,
    navigate,
  } = useApp();

  const [minProbability, setMinProbability] = useState<number>(0);

  // Filter leads for this location/project or matching company
  const locationLeads = buyerLeads.filter((lead) => {
    const matchesProject =
      lead.project.toLowerCase() === selectedProjectName.toLowerCase() ||
      lead.company.toLowerCase() === selectedCompany.toLowerCase();
    const matchesProb = lead.probability >= minProbability;
    return matchesProject && matchesProb;
  });

  const totalUsers = locationLeads.length;
  const avgConversion =
    totalUsers > 0
      ? Math.round(
          locationLeads.reduce((acc, l) => acc + l.probability, 0) / totalUsers
        )
      : 0;

  const getBarColor = (prob: number) => {
    if (prob >= 75) return 'bg-[#1F7A4C]';
    if (prob >= 50) return 'bg-[#0F4C5C]';
    return 'bg-[#B44D27]';
  };

  const getTextColor = (prob: number) => {
    if (prob >= 75) return 'text-[#1F7A4C]';
    if (prob >= 50) return 'text-[#0F4C5C]';
    return 'text-[#B44D27]';
  };

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 bg-[#F2F5F3]">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-[#4B5E63]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('agent-flats')}
              className="hover:text-[#B44D27] transition-colors cursor-pointer"
            >
              All Companies
            </button>
            <span>/</span>
            <button
              onClick={() =>
                navigate('agent-company-projects', { company: selectedCompany })
              }
              className="hover:text-[#B44D27] transition-colors cursor-pointer"
            >
              {selectedCompany}
            </button>
            <span>/</span>
            <span className="text-[#152226] font-semibold">{selectedProjectName} Leads</span>
          </div>

          <button
            onClick={() => navigate('agent-lead-dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B44D27] hover:underline cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Open in Lead Conversion Dashboard</span>
          </button>
        </div>

        {/* Location & Project Summary Header */}
        <section
          aria-label="Selected building location"
          className="rounded-2xl bg-white border border-[#D0DDD7] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FCE8E0] text-[#B44D27] font-['Red_Hat_Mono'] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                {selectedCompany}
              </span>
              <span className="text-xs font-['Red_Hat_Mono'] text-[#4B5E63] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#B44D27]" />
                {selectedProjectPlace}
              </span>
            </div>

            <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-[#152226] text-balance">
              {selectedProjectName}
            </h1>

            <p className="text-sm text-[#4B5E63]">
              Interested prospective buyers for this building location with their verified conversion probability.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 bg-[#F2F5F3] px-5 py-3 rounded-xl border border-[#D0DDD7]">
            <div className="flex flex-col items-center">
              <span className="text-xs text-[#4B5E63]">Total Buyers</span>
              <span className="font-['Playfair_Display'] text-2xl font-bold text-[#152226] tabular-nums">
                {totalUsers}
              </span>
            </div>
            <div className="w-[1px] h-8 bg-[#D0DDD7]" />
            <div className="flex flex-col items-center">
              <span className="text-xs text-[#4B5E63]">Avg. Conversion</span>
              <span className="font-['Playfair_Display'] text-2xl font-bold text-[#0F4C5C] tabular-nums">
                {avgConversion}%
              </span>
            </div>
          </div>
        </section>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#D0DDD7]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#4B5E63] flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter by Min Probability:
            </span>
            {[0, 50, 75].map((prob) => (
              <button
                key={prob}
                onClick={() => setMinProbability(prob)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  minProbability === prob
                    ? 'bg-[#B44D27] text-white'
                    : 'bg-[#F2F5F3] text-[#4B5E63] hover:text-[#152226]'
                }`}
              >
                {prob === 0 ? 'All Leads' : `≥ ${prob}%`}
              </button>
            ))}
          </div>

          <span className="text-xs font-['Red_Hat_Mono'] text-[#4B5E63] tabular-nums">
            Sorted by highest conversion score
          </span>
        </div>

        {/* Users List with Conversion Probability Bar Below Each Person */}
        <section aria-label="Interested users list" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#152226] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#B44D27]" />
              <span>Interested Buyers</span>
            </h2>
            <span className="text-xs font-['Red_Hat_Mono'] text-[#4B5E63]">
              Click any card to open detailed profile
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {locationLeads
              .sort((a, b) => b.probability - a.probability)
              .map((user) => {
                const barColor = getBarColor(user.probability);
                const textColor = getTextColor(user.probability);

                return (
                  <div
                    key={user.id}
                    onClick={() =>
                      navigate('agent-lead-profile', {
                        buyerId: user.id,
                        company: selectedCompany,
                        project: selectedProjectName,
                        place: selectedProjectPlace,
                      })
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      (e.key === 'Enter' || e.key === ' ') &&
                      navigate('agent-lead-profile', {
                        buyerId: user.id,
                        company: selectedCompany,
                        project: selectedProjectName,
                        place: selectedProjectPlace,
                      })
                    }
                    className="rounded-2xl bg-white border border-[#D0DDD7] hover:border-[#B44D27] p-6 shadow-xs hover:shadow-lg transition-all duration-150 cursor-pointer flex flex-col gap-5 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                      {/* Avatar */}
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#D0DDD7] bg-[#E9EFEA] shrink-0">
                        {user.photo ? (
                          <img
                            src={user.photo}
                            alt={user.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-xl text-[#0F4C5C]">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-['Montserrat'] text-xl font-bold text-[#152226] group-hover:text-[#B44D27] transition-colors">
                              {user.name}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-md bg-[#F2F5F3] border border-[#D0DDD7] font-['Red_Hat_Mono'] text-xs font-semibold text-[#152226]">
                              {user.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B44D27] group-hover:translate-x-1 transition-transform">
                            <span>Open Profile</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-[#4B5E63]">
                          {user.occupation}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#4B5E63] mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" /> {user.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" /> {user.phone}
                          </span>
                          <span className="font-['Red_Hat_Mono'] text-[#0F4C5C] font-semibold tabular-nums">
                            {user.requirement}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Conversion Probability Bar Below Each Person (Required by flow) */}
                    <div className="pt-4 border-t border-[#D0DDD7] flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#4B5E63]">
                          Conversion Probability
                        </span>
                        <span
                          className={`font-['Red_Hat_Mono'] text-base font-bold tabular-nums ${textColor}`}
                        >
                          {user.probability}%
                        </span>
                      </div>

                      <div
                        className="w-full h-3.5 rounded-full bg-[#E9EFEA] overflow-hidden"
                        role="progressbar"
                        aria-valuenow={user.probability}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Conversion probability for ${user.name}`}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                          style={{ width: `${user.probability}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {locationLeads.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-white border border-[#D0DDD7] flex flex-col items-center gap-2">
              <Users className="w-6 h-6 text-[#8FA3A8]" />
              <p className="text-xs text-[#4B5E63]">
                No leads match the minimum probability filter of {minProbability}%.
              </p>
              <button
                onClick={() => setMinProbability(0)}
                className="text-xs font-semibold text-[#B44D27] hover:underline cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
