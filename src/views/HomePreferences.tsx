import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyPurpose, Bedrooms, BudgetRange } from '../types';
import { Home, Key, ArrowRight, Check } from 'lucide-react';

export const HomePreferences: React.FC = () => {
  const {
    preferredPurpose,
    setPreferredPurpose,
    preferredBedrooms,
    setPreferredBedrooms,
    preferredBudget,
    setPreferredBudget,
    selectedCity,
    selectedZone,
    navigate,
  } = useApp();

  const bedroomRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);

  const handlePurposeChange = (purpose: PropertyPurpose) => {
    setPreferredPurpose(purpose);
    bedroomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleBedroomsChange = (bhk: Bedrooms) => {
    setPreferredBedrooms(bhk);
    budgetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleBudgetChange = (budget: BudgetRange) => {
    setPreferredBudget(budget);
  };

  const handleVerifyMatching = () => {
    navigate('customer-matching-flats');
  };

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 bg-[#F2F5F3]">
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#4B5E63]">
              Tell us about your home.
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#DCFCE7] text-[#14532D] text-xs font-['Red_Hat_Mono'] font-semibold tabular-nums">
              2/4
            </span>
          </div>
          <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-[#152226] text-balance">
            Your flat preferences
          </h1>
          <p className="text-sm text-[#4B5E63]">
            Searching in <strong className="text-[#0F4C5C]">{selectedCity}</strong> ({selectedZone || 'East'} Zone)
          </p>
        </div>

        {/* 3 Vertically Stacked Steps */}
        <div className="flex flex-col gap-6">
          {/* Step 1: Purpose */}
          <section className="rounded-2xl bg-white border border-[#D0DDD7] p-6 sm:p-8 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-[#152226]">
                1. Are you looking for rental or own?
              </h2>
              {preferredPurpose && (
                <span className="flex items-center gap-1 text-xs text-[#1F7A4C] font-semibold bg-[#DCFCE7] px-2 py-0.5 rounded-md">
                  <Check className="w-3.5 h-3.5" />
                  Selected
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handlePurposeChange('Own')}
                className={`text-left rounded-xl p-5 flex items-center gap-4 transition-all cursor-pointer border ${
                  preferredPurpose === 'Own'
                    ? 'border-[#0F4C5C] bg-[#D2E8ED]/30 ring-1 ring-[#0F4C5C]'
                    : 'border-[#D0DDD7] bg-white hover:border-[#0F4C5C]/60 hover:bg-[#F2F5F3]'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#D2E8ED] text-[#0F4C5C] flex items-center justify-center shrink-0">
                  <Home className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base text-[#152226]">Own / Buy</span>
                  <span className="text-xs text-[#4B5E63]">Purchase a verified residential flat</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePurposeChange('Rental')}
                className={`text-left rounded-xl p-5 flex items-center gap-4 transition-all cursor-pointer border ${
                  preferredPurpose === 'Rental'
                    ? 'border-[#0F4C5C] bg-[#D2E8ED]/30 ring-1 ring-[#0F4C5C]'
                    : 'border-[#D0DDD7] bg-white hover:border-[#0F4C5C]/60 hover:bg-[#F2F5F3]'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#D2E8ED] text-[#0F4C5C] flex items-center justify-center shrink-0">
                  <Key className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base text-[#152226]">Rental</span>
                  <span className="text-xs text-[#4B5E63]">Lease a verified apartment</span>
                </div>
              </button>
            </div>
          </section>

          {/* Step 2: Bedrooms */}
          <section
            ref={bedroomRef}
            className="rounded-2xl bg-white border border-[#D0DDD7] p-6 sm:p-8 shadow-xs flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-[#152226]">
                2. How many bedrooms do you want?
              </h2>
              {preferredBedrooms && (
                <span className="flex items-center gap-1 text-xs text-[#1F7A4C] font-semibold bg-[#DCFCE7] px-2 py-0.5 rounded-md">
                  <Check className="w-3.5 h-3.5" />
                  Selected
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['1 BHK', '2 BHK', '3 BHK', '4+ BHK'] as Bedrooms[]).map((bhk) => {
                const isSelected = preferredBedrooms === bhk;
                return (
                  <button
                    key={bhk}
                    type="button"
                    onClick={() => handleBedroomsChange(bhk)}
                    className={`rounded-xl p-4 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                      isSelected
                        ? 'border-[#0F4C5C] bg-[#D2E8ED]/30 ring-1 ring-[#0F4C5C]'
                        : 'border-[#D0DDD7] bg-white hover:border-[#0F4C5C]/60 hover:bg-[#F2F5F3]'
                    }`}
                  >
                    <span className="font-['Red_Hat_Mono'] text-lg font-bold text-[#152226] tabular-nums">
                      {bhk}
                    </span>
                    <span className="text-xs text-[#4B5E63]">
                      {bhk === '1 BHK'
                        ? '1 Bedroom'
                        : bhk === '2 BHK'
                        ? '2 Bedrooms'
                        : bhk === '3 BHK'
                        ? '3 Bedrooms'
                        : '4+ Bedrooms'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 3: Budget Range */}
          <section
            ref={budgetRef}
            className="rounded-2xl bg-white border border-[#D0DDD7] p-6 sm:p-8 shadow-xs flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-[#152226]">
                3. What is your flat budget range?
              </h2>
              {preferredBudget && (
                <span className="flex items-center gap-1 text-xs text-[#1F7A4C] font-semibold bg-[#DCFCE7] px-2 py-0.5 rounded-md">
                  <Check className="w-3.5 h-3.5" />
                  Selected
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['< 50 Lakhs', '50L – 1 Cr', '1 Cr – 2 Cr', '> 2 Cr'] as BudgetRange[]).map((b) => {
                const isSelected = preferredBudget === b;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleBudgetChange(b)}
                    className={`rounded-xl p-4 flex items-center justify-center text-center transition-all cursor-pointer border ${
                      isSelected
                        ? 'border-[#0F4C5C] bg-[#D2E8ED]/30 ring-1 ring-[#0F4C5C]'
                        : 'border-[#D0DDD7] bg-white hover:border-[#0F4C5C]/60 hover:bg-[#F2F5F3]'
                    }`}
                  >
                    <span className="font-['Red_Hat_Mono'] text-sm sm:text-base font-semibold text-[#152226] tabular-nums">
                      {b}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Action Button */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleVerifyMatching}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#0F4C5C] hover:bg-[#09323D] text-white font-semibold text-base transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md"
          >
            <span>Verify Matching Flats</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-center text-xs text-[#4B5E63]">
            Matches are scored using GlassWindow&apos;s 80-point inspection algorithm and verified carpet ratios.
          </p>
        </div>
      </div>
    </div>
  );
};
