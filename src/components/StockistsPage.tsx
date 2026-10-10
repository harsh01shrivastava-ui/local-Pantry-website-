import React, { useState } from 'react';
import { PANTRY_STOCKISTS } from '../data/pantryData';

interface StockistsPageProps {
  onBackToShop: () => void;
}

export const StockistsPage: React.FC<StockistsPageProps> = ({ onBackToShop }) => {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const cities = ['All', 'Jaipur', 'Udaipur', 'Mumbai', 'New Delhi', 'Banswara'];

  const filteredStockists = selectedCity === 'All'
    ? PANTRY_STOCKISTS
    : PANTRY_STOCKISTS.filter((s) => s.city.toLowerCase() === selectedCity.toLowerCase());

  const handleCopyAddress = (id: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full bg-[#fff8f5] py-12 animate-fadeIn">
      <div className="max-w-[1180px] mx-auto px-4 lg:px-8">
        {/* Back Link */}
        <button
          onClick={onBackToShop}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57423b] hover:text-[#9f3c16] mb-8"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Pantry Catalog</span>
        </button>

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[12px] uppercase font-bold text-[#516444] tracking-widest block font-sans mb-2">
            Weekend Farmers Markets &amp; Kitchen Pick-ups
          </span>
          <h1 className="font-serif text-[36px] sm:text-[44px] text-[#1e1b19] font-normal tracking-tight leading-tight">
            Find a Stall or Artisan Stockist
          </h1>
          <p className="text-[16px] text-[#57423b] mt-3 font-sans leading-relaxed">
            Sample freshly opened jars, pick up your weekly provisions directly from our team, or exchange clean empty glass jars for pantry store credits!
          </p>
        </div>

        {/* City Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                selectedCity === city
                  ? 'bg-[#9f3c16] text-white shadow-sm'
                  : 'bg-[#f5ece9] text-[#57423b] hover:text-[#1e1b19]'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Stockist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredStockists.map((stockist) => (
            <div
              key={stockist.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-[#efe6e3] shadow-[0_2px_12px_rgba(42,38,36,0.04)] flex flex-col justify-between"
            >
              <div>
                {/* Tag & City */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#516444]/15 text-[#516444] font-semibold">
                    {stockist.type}
                  </span>
                  <span className="font-bold text-[#9f3c16]">{stockist.city}</span>
                </div>

                <h3 className="font-serif text-[22px] text-[#1e1b19] font-medium mb-1">
                  {stockist.name}
                </h3>
                {stockist.stallNumber && (
                  <p className="text-xs font-semibold text-[#805200] mb-3">
                    📍 {stockist.stallNumber}
                  </p>
                )}

                <p className="text-[13px] text-[#57423b] leading-relaxed mb-4">
                  {stockist.address}
                </p>

                {/* Schedule details */}
                <div className="p-3 bg-[#fbf2ee] rounded-xl text-xs space-y-1.5 border border-[#efe6e3] mb-5">
                  <div className="flex items-center gap-2 text-[#1e1b19]">
                    <span className="material-symbols-outlined text-[#9f3c16] text-[16px]">
                      calendar_month
                    </span>
                    <strong>{stockist.nextDate}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-[#57423b]">
                    <span className="material-symbols-outlined text-[#8a726a] text-[16px]">
                      schedule
                    </span>
                    <span>{stockist.hours} ({stockist.schedule})</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#f5ece9]">
                <button
                  onClick={() => handleCopyAddress(stockist.id, stockist.address)}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#efe6e3] hover:bg-[#dec0b7] text-[#1e1b19] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedId === stockist.id ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedId === stockist.id ? 'Address Copied!' : 'Copy Address'}</span>
                </button>

                <a
                  href={`tel:${stockist.contact.replace(/\s/g, '')}`}
                  className="py-2 px-4 rounded-lg bg-[#516444] hover:bg-[#435338] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  <span>Call Stall</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Glass Jar Exchange Program Banner */}
        <div className="bg-[#f5ece9] p-6 sm:p-8 rounded-2xl border border-[#efe6e3] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#516444] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">recycling</span>
            </div>
            <div>
              <h4 className="font-serif text-[20px] text-[#1e1b19] font-medium mb-1">
                Bring Your Clean Glass Jars Back
              </h4>
              <p className="text-xs sm:text-sm text-[#57423b] leading-relaxed max-w-xl">
                Return 3 empty Local Pantry glass jars at any market stall and receive ₹50 credit towards your next fresh batch. We sterilize and reuse them in true circular tradition.
              </p>
            </div>
          </div>

          <button
            onClick={onBackToShop}
            className="py-2.5 px-5 bg-[#9f3c16] text-white text-xs font-semibold rounded-lg hover:bg-[#bf542c] transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Order Jars Online
          </button>
        </div>
      </div>
    </div>
  );
};
