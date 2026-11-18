import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FLATS_DATABASE, DEVELOPERS_DATABASE } from '../data/mockData';
import {
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  SlidersHorizontal,
  Layers,
  Building,
} from 'lucide-react';

export const MatchingFlats: React.FC = () => {
  const {
    selectedCity,
    selectedZone,
    preferredPurpose,
    preferredBedrooms,
    preferredBudget,
    savedFlatIds,
    toggleSaveFlat,
    navigate,
  } = useApp();

  const [activeCityFilter, setActiveCityFilter] = useState<string>(selectedCity);
  const [activeBhkFilter, setActiveBhkFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [efficiencyFilter, setEfficiencyFilter] = useState<boolean>(false);
  const [hoveredFlatId, setHoveredFlatId] = useState<string | null>(null);

  // Filter flats
  const matchingFlats = FLATS_DATABASE.filter((flat) => {
    const matchesCity = activeCityFilter === 'All' || flat.city === activeCityFilter;
    const matchesBhk = activeBhkFilter === 'All' || flat.bedrooms === activeBhkFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      flat.name.toLowerCase().includes(q) ||
      flat.company.toLowerCase().includes(q) ||
      flat.locality.toLowerCase().includes(q);
    const carpetNum = parseInt(flat.carpet.replace(/\D/g, ''), 10) || 70;
    const matchesEfficiency = !efficiencyFilter || carpetNum >= 75;

    return matchesCity && matchesBhk && matchesSearch && matchesEfficiency;
  });

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 bg-[#F2F5F3]">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
        {/* Top Header Row with Stock Badge at the End */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D0DDD7]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#DCFCE7] text-[#14532D] font-['Red_Hat_Mono'] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                RERA Verified
              </span>
              <span className="text-xs font-['Red_Hat_Mono'] text-[#4B5E63]">
                {selectedCity} • {selectedZone || 'East'} Zone
              </span>
            </div>

            <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-[#152226] text-balance">
              Matching flats in your region
            </h1>

            <p className="text-sm text-[#4B5E63]">
              Showing verified properties matching {preferredPurpose} • {preferredBedrooms} • {preferredBudget}
            </p>
          </div>

          {/* Stock Link Button at the End (Google Stitch flow Requirement) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('customer-developer-stocks')}
              className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-[#D0DDD7] hover:border-[#0F4C5C] shadow-xs hover:shadow-md transition-all cursor-pointer group"
              title="Inspect developer publicly listed stock data"
            >
              <span className="w-8 h-8 rounded-lg bg-[#FCE8E0] text-[#B44D27] flex items-center justify-center transition-transform group-hover:scale-105">
                <TrendingUp className="w-4 h-4" />
              </span>
              <div className="flex flex-col text-left">
                <span className="text-xs text-[#4B5E63]">Market Health</span>
                <span className="text-sm font-bold text-[#152226]">Developer Stocks</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#D2E8ED] text-[#09323D] font-['Red_Hat_Mono'] text-xs font-bold tabular-nums">
                {DEVELOPERS_DATABASE.length}
              </span>
            </button>
          </div>
        </div>

        {/* Carpet Area Usability & Price Distribution Visualizer */}
        <section
          aria-label="Carpet area efficiency spectrum"
          className="p-5 rounded-2xl bg-white border border-[#D0DDD7] shadow-xs flex flex-col gap-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4C5C]">
                Spatial Intelligence Visualizer
              </span>
              <h2 className="text-sm font-bold text-[#152226]">
                Carpet Area Usability Distribution Spectrum
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEfficiencyFilter((prev) => !prev)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  efficiencyFilter
                    ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                    : 'bg-[#F2F5F3] text-[#4B5E63] hover:text-[#152226] border-[#D0DDD7]'
                }`}
              >
                ★ Only Super-Efficient (≥75% Carpet)
              </button>
            </div>
          </div>

          {/* Efficiency Spectrum Meter */}
          <div className="relative pt-6 pb-4 px-2">
            <div className="h-3 w-full rounded-full bg-linear-to-r from-[#D0DDD7] via-[#D2E8ED] to-[#DCFCE7] relative">
              {/* Threshold Marker at 75% */}
              <div
                className="absolute top-[-22px] left-[50%] -translate-x-1/2 flex flex-col items-center pointer-events-none"
              >
                <span className="text-[10px] font-['Red_Hat_Mono'] font-bold text-[#0F4C5C] bg-white px-1.5 py-0.2 rounded border border-[#0F4C5C]/30 shadow-2xs">
                  75% Benchmark
                </span>
                <div className="w-0.5 h-5 bg-[#0F4C5C]" />
              </div>

              {/* Plotted Flat Nodes */}
              {FLATS_DATABASE.map((f) => {
                const cNum = parseInt(f.carpet.replace(/\D/g, ''), 10) || 72;
                // Scale 70% to 80% across 0 to 100% width
                const pct = Math.max(5, Math.min(95, ((cNum - 70) / 10) * 100));
                const isHovered = hoveredFlatId === f.id;

                return (
                  <button
                    key={f.id}
                    type="button"
                    onMouseEnter={() => setHoveredFlatId(f.id)}
                    onMouseLeave={() => setHoveredFlatId(null)}
                    onClick={() => navigate('customer-flat-detail', { flatId: f.id })}
                    style={{ left: `${pct}%` }}
                    className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md transition-all cursor-pointer ${
                      cNum >= 75 ? 'bg-[#0F4C5C]' : 'bg-[#B44D27]'
                    } ${isHovered ? 'scale-150 z-20 ring-2 ring-[#0F4C5C]' : 'z-10'}`}
                    title={`${f.name} - ${f.carpet} (${f.price})`}
                  />
                );
              })}
            </div>

            <div className="flex justify-between text-[11px] font-['Red_Hat_Mono'] text-[#4B5E63] mt-2">
              <span>70% Standard Efficiency</span>
              <span className="text-[#0F4C5C] font-bold">75% GlassWindow Grade</span>
              <span>80% Bespoke Villa Efficiency</span>
            </div>
          </div>
        </section>

        {/* Search & Quick Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#D0DDD7] shadow-xs">
          {/* In-page Search Bar */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter flats by developer, project or locality..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F2F5F3] border border-[#D0DDD7] text-xs text-[#152226] placeholder-[#8FA3A8] focus:bg-white focus:border-[#0F4C5C] outline-hidden font-medium"
            />
            <span className="material-symbols-outlined text-[18px] text-[#4B5E63] absolute left-2.5 top-2.5 pointer-events-none">
              search
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-[#4B5E63] hover:text-[#152226] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#4B5E63] flex items-center gap-1 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> City:
            </span>

            {['All', 'Bangalore', 'Hyderabad', 'Delhi'].map((c) => (
              <button
                key={c}
                onClick={() => setActiveCityFilter(c)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeCityFilter === c
                    ? 'bg-[#0F4C5C] text-white shadow-xs'
                    : 'bg-[#F2F5F3] text-[#4B5E63] hover:text-[#152226]'
                }`}
              >
                {c === 'All' ? 'All' : c}
              </button>
            ))}

            <span className="text-[#D0DDD7] mx-1">|</span>

            {['All', '2 BHK', '3 BHK', '4+ BHK'].map((b) => (
              <button
                key={b}
                onClick={() => setActiveBhkFilter(b)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeBhkFilter === b
                    ? 'bg-[#0F4C5C] text-white shadow-xs'
                    : 'bg-[#F2F5F3] text-[#4B5E63] hover:text-[#152226]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <div className="text-xs font-['Red_Hat_Mono'] text-[#4B5E63] tabular-nums whitespace-nowrap">
            Showing {matchingFlats.length} of {FLATS_DATABASE.length} flats
          </div>
        </div>

        {/* Flats Grid */}
        <section aria-label="Available flats list" className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {matchingFlats.map((flat) => {
            const isSaved = savedFlatIds.includes(flat.id);
            return (
              <article
                key={flat.id}
                className="rounded-2xl bg-white border border-[#D0DDD7] hover:border-[#0F4C5C] p-6 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between gap-5 group"
              >
                <div className="flex flex-col gap-4">
                  {/* Image container */}
                  <div className="relative h-52 w-full rounded-xl overflow-hidden bg-[#E9EFEA]">
                    <img
                      src={flat.image}
                      alt={flat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        onClick={() => toggleSaveFlat(flat.id)}
                        title={isSaved ? 'Remove from shortlist' : 'Shortlist flat'}
                        className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-xs text-[#0F4C5C] flex items-center justify-center hover:bg-white shadow-xs cursor-pointer transition-colors"
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-[#B44D27]" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-md bg-[#0F4C5C]/90 backdrop-blur-xs text-white font-['Red_Hat_Mono'] text-xs font-semibold tabular-nums">
                        ★ {flat.score}
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-[#152226] text-xs font-medium">
                        {flat.city}
                      </span>
                    </div>
                  </div>

                  {/* Title & locality */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#0F4C5C] flex items-center gap-1">
                        <Building className="w-3 h-3" /> {flat.company}
                      </span>
                      <h3 className="font-['Montserrat'] text-xl font-bold text-[#152226] mt-0.5">
                        {flat.name}
                      </h3>
                      <p className="text-xs text-[#4B5E63] mt-0.5">{flat.locality}</p>
                    </div>

                    <span className="px-2.5 py-1 rounded-md bg-[#DCFCE7] text-[#14532D] font-['Red_Hat_Mono'] text-xs font-semibold tabular-nums shrink-0">
                      RERA Audited
                    </span>
                  </div>

                  {/* Pricing and Efficiency Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#D0DDD7]">
                    <div className="flex flex-col">
                      <span className="text-xs text-[#4B5E63]">Price</span>
                      <span className="font-['Red_Hat_Mono'] text-lg font-bold text-[#152226] tabular-nums">
                        {flat.price}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-[#4B5E63]">Carpet Area Efficiency</span>
                      <span className="font-['Red_Hat_Mono'] text-lg font-bold text-[#0F4C5C] tabular-nums flex items-center gap-1">
                        <Layers className="w-4 h-4 text-[#0F4C5C]" />
                        {flat.carpet}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#4B5E63] font-['Red_Hat_Mono'] tabular-nums">
                    {flat.config} • {flat.rate}
                  </p>
                </div>

                {/* Card CTA */}
                <button
                  type="button"
                  onClick={() => navigate('customer-flat-detail', { flatId: flat.id })}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0F4C5C] hover:bg-[#09323D] text-white font-semibold text-sm transition-all duration-150 cursor-pointer shadow-xs"
                >
                  <span>Find More &amp; View Specifications</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </article>
            );
          })}
        </section>

        {matchingFlats.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-white border border-[#D0DDD7] flex flex-col items-center gap-3">
            <Building className="w-8 h-8 text-[#8FA3A8]" />
            <h3 className="text-base font-bold text-[#152226]">No flats match the current filters</h3>
            <p className="text-xs text-[#4B5E63]">
              Try resetting the city or bedroom filters to explore other regions.
            </p>
            <button
              onClick={() => {
                setActiveCityFilter('All');
                setActiveBhkFilter('All');
              }}
              className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
