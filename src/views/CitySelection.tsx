import React from 'react';
import { useApp } from '../context/AppContext';
import { City, DirectionZone } from '../types';
import { CITY_AREAS } from '../data/mockData';
import { MapPin, ArrowRight, HelpCircle, Check, Compass } from 'lucide-react';

const CITIES: City[] = ['Hyderabad', 'Bangalore', 'Delhi'];

export const CitySelection: React.FC = () => {
  const { selectedCity, setSelectedCity, selectedZone, setSelectedZone, navigate } = useApp();

  const handleCityChange = (city: City) => {
    setSelectedCity(city);
    // Default zone if not selected
    if (!selectedZone || selectedZone === 'Advice') {
      setSelectedZone('East');
    }
  };

  const handleZoneSelect = (zone: DirectionZone) => {
    setSelectedZone(zone);
  };

  const handleContinue = () => {
    navigate('customer-preferences');
  };

  const currentAreas = CITY_AREAS[selectedCity];

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 bg-[#F2F5F3]">
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-8">
        {/* Top City Slider Bar */}
        <section aria-label="Select city" className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#4B5E63]">
            Select your city
          </span>
          <div className="w-full max-w-xl">
            <div className="grid grid-cols-3 p-1 rounded-2xl bg-white border border-[#D0DDD7] shadow-xs gap-1.5">
              {CITIES.map((city) => {
                const isSelected = selectedCity === city;
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleCityChange(city)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F4C5C] text-white shadow-sm'
                        : 'text-[#4B5E63] hover:text-[#152226] hover:bg-[#F2F5F3]'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{city}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Split Card: Left 4 Directional Options + Right Interactive City Map */}
        <section className="rounded-2xl bg-white border border-[#D0DDD7] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Half: 4 Directional Options */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#4B5E63]">
                  Tell us about your home.
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#DCFCE7] text-[#14532D] text-xs font-['Red_Hat_Mono'] font-semibold tabular-nums">
                  1/4
                </span>
              </div>

              <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-[#152226] text-balance">
                What&apos;s your preferred area in {selectedCity}?
              </h1>

              {/* 4 Area Options: North, South, East, West */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(['North', 'South', 'East', 'West'] as DirectionZone[]).map((zone) => {
                  const isSelected = selectedZone === zone;
                  return (
                    <button
                      key={zone}
                      type="button"
                      onClick={() => handleZoneSelect(zone)}
                      className={`text-left rounded-xl p-4 flex flex-col gap-1 transition-all cursor-pointer border ${
                        isSelected
                          ? 'border-[#0F4C5C] bg-[#D2E8ED]/30 ring-1 ring-[#0F4C5C]'
                          : 'border-[#D0DDD7] bg-white hover:border-[#0F4C5C]/60 hover:bg-[#F2F5F3]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-base text-[#152226]">
                          {zone}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#0F4C5C]" />}
                      </div>
                      <span className="text-xs text-[#4B5E63] leading-relaxed">
                        {currentAreas[zone as keyof typeof currentAreas]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Need Advice Card */}
              <button
                type="button"
                onClick={() => handleZoneSelect('Advice')}
                className={`w-full text-left rounded-xl p-4 flex items-center justify-between gap-3 border transition-all cursor-pointer ${
                  selectedZone === 'Advice'
                    ? 'border-[#0F4C5C] bg-[#D2E8ED]/30 ring-1 ring-[#0F4C5C]'
                    : 'border-[#D0DDD7] bg-[#F2F5F3] hover:border-[#0F4C5C]/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-[#D0DDD7] text-[#0F4C5C] flex items-center justify-center shrink-0 mt-0.5">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-[#152226]">
                      Need Advisory Consultation
                    </span>
                    <span className="text-xs text-[#4B5E63]">
                      We&apos;ve helped 1,500+ families evaluate commute, water security &amp; appreciation.
                    </span>
                  </div>
                </div>
                {selectedZone === 'Advice' && <Check className="w-4 h-4 text-[#0F4C5C] shrink-0" />}
              </button>

              {/* Zone Feedback */}
              {selectedZone && (
                <div className="p-3 rounded-lg bg-[#DCFCE7] text-[#14532D] text-xs font-medium flex items-center gap-2">
                  <Compass className="w-4 h-4 shrink-0 text-[#1F7A4C]" />
                  <span>
                    {selectedZone === 'Advice'
                      ? `A certified GlassWindow advisor in ${selectedCity} will help you select the ideal sub-region.`
                      : `Selected ${selectedZone} ${selectedCity} (${currentAreas[selectedZone as keyof typeof currentAreas]})`}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={handleContinue}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0F4C5C] hover:bg-[#09323D] text-white font-semibold text-sm transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md"
              >
                <span>Continue to Home Preferences</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#4B5E63]">
              By proceeding, you agree to GlassWindow&apos;s impartial inspection standards and privacy policy.
            </p>
          </div>

          {/* Right Half: Interactive City Map */}
          <div className="lg:col-span-6 bg-[#E9EFEA] border-t lg:border-t-0 lg:border-l border-[#D0DDD7] p-6 sm:p-8 flex flex-col items-center justify-center gap-4">
            <div className="w-full flex items-center justify-between">
              <span className="font-semibold text-sm text-[#0F4C5C] flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                {selectedCity} Zone Map
              </span>
              <span className="text-xs font-['Red_Hat_Mono'] text-[#4B5E63]">
                Click map to select
              </span>
            </div>

            <div className="w-full max-w-sm aspect-square flex items-center justify-center">
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full drop-shadow-xs"
                role="img"
                aria-label={`Interactive map of ${selectedCity}`}
              >
                {/* Background base */}
                <rect x="0" y="0" width="400" height="400" rx="20" fill="#FFFFFF" stroke="#D0DDD7" strokeWidth="1" />
                
                {/* Arterial Grid roads */}
                <path
                  d="M40 200 L360 200 M200 40 L200 360 M85 85 L315 315 M315 85 L85 315"
                  stroke="#DDE6E0"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Central Ring */}
                <circle cx="200" cy="200" r="34" fill="#FFFFFF" stroke="#8FA3A8" strokeWidth="1.5" />
                <text
                  x="200"
                  y="204"
                  textAnchor="middle"
                  fill="#0F4C5C"
                  fontFamily="Montserrat, sans-serif"
                  fontSize="10"
                  fontWeight="700"
                >
                  CBD
                </text>

                {/* North Zone Polygon */}
                <path
                  id="map-zone-North"
                  onClick={() => handleZoneSelect('North')}
                  d="M115 70 L200 38 L285 70 L300 135 L200 165 L100 135 Z"
                  fill={selectedZone === 'North' ? '#D2E8ED' : '#F2F5F3'}
                  stroke={selectedZone === 'North' ? '#0F4C5C' : '#8FA3A8'}
                  strokeWidth={selectedZone === 'North' ? '2.5' : '1.5'}
                  className="transition-colors cursor-pointer hover:opacity-85"
                />
                <text
                  x="200"
                  y="108"
                  textAnchor="middle"
                  fill="#152226"
                  fontFamily="Montserrat, sans-serif"
                  fontSize="14"
                  fontWeight="600"
                  pointerEvents="none"
                >
                  North
                </text>

                {/* East Zone Polygon */}
                <path
                  id="map-zone-East"
                  onClick={() => handleZoneSelect('East')}
                  d="M300 135 L360 200 L305 275 L235 200 Z"
                  fill={selectedZone === 'East' ? '#D2E8ED' : '#F2F5F3'}
                  stroke={selectedZone === 'East' ? '#0F4C5C' : '#8FA3A8'}
                  strokeWidth={selectedZone === 'East' ? '2.5' : '1.5'}
                  className="transition-colors cursor-pointer hover:opacity-85"
                />
                <text
                  x="285"
                  y="205"
                  textAnchor="middle"
                  fill="#152226"
                  fontFamily="Montserrat, sans-serif"
                  fontSize="14"
                  fontWeight="600"
                  pointerEvents="none"
                >
                  East
                </text>

                {/* South Zone Polygon */}
                <path
                  id="map-zone-South"
                  onClick={() => handleZoneSelect('South')}
                  d="M100 275 L200 235 L305 275 L275 345 L200 365 L125 345 Z"
                  fill={selectedZone === 'South' ? '#D2E8ED' : '#F2F5F3'}
                  stroke={selectedZone === 'South' ? '#0F4C5C' : '#8FA3A8'}
                  strokeWidth={selectedZone === 'South' ? '2.5' : '1.5'}
                  className="transition-colors cursor-pointer hover:opacity-85"
                />
                <text
                  x="200"
                  y="305"
                  textAnchor="middle"
                  fill="#152226"
                  fontFamily="Montserrat, sans-serif"
                  fontSize="14"
                  fontWeight="600"
                  pointerEvents="none"
                >
                  South
                </text>

                {/* West Zone Polygon */}
                <path
                  id="map-zone-West"
                  onClick={() => handleZoneSelect('West')}
                  d="M100 135 L165 200 L100 275 L45 200 Z"
                  fill={selectedZone === 'West' ? '#D2E8ED' : '#F2F5F3'}
                  stroke={selectedZone === 'West' ? '#0F4C5C' : '#8FA3A8'}
                  strokeWidth={selectedZone === 'West' ? '2.5' : '1.5'}
                  className="transition-colors cursor-pointer hover:opacity-85"
                />
                <text
                  x="115"
                  y="205"
                  textAnchor="middle"
                  fill="#152226"
                  fontFamily="Montserrat, sans-serif"
                  fontSize="14"
                  fontWeight="600"
                  pointerEvents="none"
                >
                  West
                </text>
              </svg>
            </div>

            <div className="text-center text-xs text-[#4B5E63]">
              Active Zone: <strong className="text-[#0F4C5C] font-semibold">{selectedZone || 'East'}</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
