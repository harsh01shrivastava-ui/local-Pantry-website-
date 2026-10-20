import React from 'react';
import titleImg from '../assets/images/title_image.png';

interface HeroProps {
  onExploreClick: () => void;
  onRecipesClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onRecipesClick }) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#fff8f5] pt-3 sm:pt-6 pb-8 lg:pb-12 border-b border-[#f5ece9]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Hero Text Column */}
          <div className="lg:col-span-6 flex flex-col items-start z-10">
            {/* Pill Header */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#516444]/10 text-[#516444] mb-3">
              <span className="material-symbols-outlined text-[15px] sm:text-[17px]">grain</span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase font-sans">
                Small-Batch Heritage &amp; Flavours
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="font-serif text-[28px] xs:text-[34px] sm:text-[42px] lg:text-[46px] leading-[1.14] text-[#1e1b19] tracking-tight mb-3 font-normal">
              Dips, Preserves,
              <br />
              Condiments &amp; More.
            </h1>

            {/* Body Description */}
            <p className="text-[14px] sm:text-[16px] leading-relaxed text-[#57423b] max-w-lg mb-5 font-sans">
              No additives. No preservatives. Handcrafted in small batches directly from our family kitchen in Banswara, Rajasthan.
            </p>

            {/* Mobile-Friendly CTAs */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 w-full sm:w-auto mb-6">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center px-5 py-3 bg-[#9f3c16] hover:bg-[#bf542c] text-white text-[14px] font-semibold rounded-xl shadow-sm hover:shadow-md transition-all group active:scale-98 cursor-pointer min-h-[46px]"
              >
                <span>Explore the Pantry</span>
                <span className="material-symbols-outlined ml-2 text-[17px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
              <button
                onClick={onRecipesClick}
                className="inline-flex items-center justify-center px-5 py-3 bg-[#f5ece9] hover:bg-[#efe6e3] text-[#1e1b19] text-[14px] font-semibold rounded-xl transition-colors active:scale-98 cursor-pointer min-h-[46px]"
              >
                <span className="material-symbols-outlined mr-1.5 text-[17px] text-[#57423b]">
                  menu_book
                </span>
                <span>View Recipes</span>
              </button>
            </div>

            {/* Responsive Trust Badges */}
            <div className="grid grid-cols-1 xs:grid-cols-3 sm:flex sm:flex-wrap items-center gap-2 sm:gap-x-5 text-[#57423b] text-[11px] sm:text-[12px] pt-3.5 border-t border-[#dec0b7]/30 w-full">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#516444] text-[15px] shrink-0">
                  check_circle
                </span>
                <span>Cold-Pressed Oils</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#516444] text-[15px] shrink-0">
                  check_circle
                </span>
                <span>Seasonal Produce</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#516444] text-[15px] shrink-0">
                  check_circle
                </span>
                <span>Plastic-Free Glass</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Showcase */}
          <div className="lg:col-span-6 relative mt-2 lg:mt-0 w-full">
            <div className="relative mx-auto w-full max-w-[440px] lg:max-w-[500px] rounded-2xl overflow-hidden shadow-lg bg-[#fbf2ee] p-1.5 border border-[#efe6e3]">
              {/* Hero Image */}
              <img
                className="w-full h-[220px] xs:h-[260px] sm:h-[320px] lg:h-[360px] object-cover rounded-xl"
                alt="Artisanal glass jars of The Local Pantry Chunky Pizza Sauce, Podi, Chilli Oil, and Hummus with fresh pita crisps"
                src={titleImg}
                loading="eager"
              />

              {/* Floating Sticker Badge 1 */}
              <div className="absolute top-3.5 left-3.5 bg-[#fff8f5]/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 text-[#1e1b19] border border-white/60">
                <span className="w-2 h-2 rounded-full bg-[#9f3c16] animate-pulse"></span>
                <span className="text-[10px] font-semibold tracking-wide uppercase font-sans">
                  Batch #48 Open
                </span>
              </div>

              {/* Floating Sticker Badge 2 */}
              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md p-2 sm:px-3 sm:py-2 rounded-xl shadow-lg flex items-center gap-2 max-w-[190px] sm:max-w-[240px] border border-[#dec0b7]/30">
                <span className="material-symbols-outlined text-[#9f6912] text-[20px] sm:text-[22px] shrink-0">
                  workspace_premium
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#1e1b19] leading-tight">
                    Small Kitchen Craft
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-[#57423b] leading-tight mt-0.5 truncate">
                    Stone-ground &amp; cold infusions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
