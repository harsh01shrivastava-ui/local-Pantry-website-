import React from 'react';

interface CulinaryCodeProps {
  onLearnMore?: () => void;
}

export const CulinaryCode: React.FC<CulinaryCodeProps> = ({ onLearnMore }) => {
  return (
    <section className="w-full bg-[#fbf2ee] py-10 sm:py-14 lg:py-16 border-b border-[#f5ece9]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <span className="text-[11px] sm:text-[12px] text-[#9f3c16] tracking-widest uppercase font-semibold block font-sans">
            Our Culinary Code
          </span>
          <h2 className="font-serif text-[26px] xs:text-[30px] sm:text-[38px] text-[#1e1b19] mt-1 font-normal tracking-tight">
            Honest Food, The Way It Should Be
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Item 1 */}
          <div className="bg-white p-6 rounded-xl shadow-[0_2px_8px_rgba(42,38,36,0.04)] border border-[#efe6e3] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#516444]/15 text-[#516444] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">eco</span>
              </div>
              <h3 className="font-serif text-[20px] font-medium text-[#1e1b19] mb-2">
                100% Homemade
              </h3>
              <p className="text-[14px] leading-relaxed text-[#57423b]">
                Crafted in humble, small batches by culinary artisans using heritage recipes honed over generations.
              </p>
            </div>
            <button
              onClick={onLearnMore}
              className="text-[12px] text-[#516444] font-semibold mt-6 inline-flex items-center gap-1 hover:underline text-left cursor-pointer"
            >
              Zero industrial shortcuts →
            </button>
          </div>

          {/* Item 2 */}
          <div className="bg-white p-6 rounded-xl shadow-[0_2px_8px_rgba(42,38,36,0.04)] border border-[#efe6e3] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#9f3c16]/10 text-[#9f3c16] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">block</span>
              </div>
              <h3 className="font-serif text-[20px] font-medium text-[#1e1b19] mb-2">
                Zero Preservatives
              </h3>
              <p className="text-[14px] leading-relaxed text-[#57423b]">
                No artificial thickeners, synthetic colors, or chemical shelf-stabilizers. Just clean, honest kitchen pantries.
              </p>
            </div>
            <button
              onClick={onLearnMore}
              className="text-[12px] text-[#9f3c16] font-semibold mt-6 inline-flex items-center gap-1 hover:underline text-left cursor-pointer"
            >
              Pure botanical shelf life →
            </button>
          </div>

          {/* Item 3 */}
          <div className="bg-white p-6 rounded-xl shadow-[0_2px_8px_rgba(42,38,36,0.04)] border border-[#efe6e3] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#805200]/15 text-[#805200] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">agriculture</span>
              </div>
              <h3 className="font-serif text-[20px] font-medium text-[#1e1b19] mb-2">
                Farm-Fresh Quality
              </h3>
              <p className="text-[14px] leading-relaxed text-[#57423b]">
                Locally sourced produce from Rajasthan &amp; partner orchards curated for aromatic punch and nutrient integrity.
              </p>
            </div>
            <button
              onClick={onLearnMore}
              className="text-[12px] text-[#805200] font-semibold mt-6 inline-flex items-center gap-1 hover:underline text-left cursor-pointer"
            >
              Direct farmer tie-ups →
            </button>
          </div>

          {/* Item 4 */}
          <div className="bg-white p-6 rounded-xl shadow-[0_2px_8px_rgba(42,38,36,0.04)] border border-[#efe6e3] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#efe6e3] text-[#1e1b19] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">hourglass_top</span>
              </div>
              <h3 className="font-serif text-[20px] font-medium text-[#1e1b19] mb-2">
                Slow-Crafted Time
              </h3>
              <p className="text-[14px] leading-relaxed text-[#57423b]">
                Stone-crushed spices, slow-infused cold-pressed chili oils, and sauces reduced slowly on cast-iron fires.
              </p>
            </div>
            <button
              onClick={onLearnMore}
              className="text-[12px] text-[#1e1b19] font-semibold mt-6 inline-flex items-center gap-1 hover:underline text-left cursor-pointer"
            >
              Patience in every jar →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
