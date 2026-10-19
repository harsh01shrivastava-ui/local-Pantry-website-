import React from 'react';
import titleImg from '../assets/images/title_image.png';

interface HeroProps {
  onExploreClick: () => void;
  onRecipesClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onRecipesClick }) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#fff8f5] pt-1 sm:pt-2 pb-6 lg:pb-8 border-b border-[#f5ece9]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Hero Text Column */}
          <div className="lg:col-span-6 flex flex-col items-start z-10">
            {/* Pill Header */}
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#516444]/10 text-[#516444] mb-2.5">
              <span className="material-symbols-outlined text-[17px]">grain</span>
              <span className="text-[11px] font-semibold tracking-wider uppercase font-sans">
                Small-Batch Indian Heritage &amp; World Flavours
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="font-serif text-[34px] sm:text-[42px] lg:text-[46px] leading-[1.12] text-[#1e1b19] tracking-tight mb-2.5 font-normal">
              Dips, Preserves,
              <br />
              Condiments &amp; More.
            </h1>

            {/* Body Description */}
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#57423b] max-w-lg mb-5 font-sans">
              No additives. No preservatives. Handcrafted in small batches directly from our family kitchen in Banswara, Rajasthan.
            </p>

            {/* Interactive CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-5">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-[#9f3c16] hover:bg-[#bf542c] text-white text-[13px] sm:text-[14px] font-semibold rounded-lg shadow-sm hover:shadow-md transition-all group"
              >
                <span>Explore the Pantry</span>
                <span className="material-symbols-outlined ml-2 text-[17px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
              <button
                onClick={onRecipesClick}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-[#f5ece9] hover:bg-[#efe6e3] text-[#1e1b19] text-[13px] sm:text-[14px] font-semibold rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined mr-1.5 text-[17px] text-[#57423b]">
                  menu_book
                </span>
                <span>View Recipes</span>
              </button>
            </div>

            {/* Quick Trust Badges */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[#57423b] text-[11px] sm:text-[12px] pt-3 border-t border-[#dec0b7]/30 w-full">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#516444] text-[15px]">
                  check_circle
                </span>
                <span>100% Pure Cold-Pressed Oils</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#516444] text-[15px]">
                  check_circle
                </span>
                <span>Farm-Grown Seasonal Produce</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#516444] text-[15px]">
                  check_circle
                </span>
                <span>Plastic-Free Glass Packed</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Showcase */}
          <div className="lg:col-span-6 relative mt-2 lg:mt-0">
            <div className="relative mx-auto max-w-[500px] rounded-xl overflow-hidden shadow-lg bg-[#fbf2ee] p-1.5 border border-[#efe6e3]">
              {/* Hero Image */}
              <img
                className="w-full h-[280px] sm:h-[330px] lg:h-[360px] object-cover rounded-lg"
                alt="Artisanal glass jars of The Local Pantry Chunky Pizza Sauce, Podi, Chilli Oil, and Hummus with fresh pita crisps and festive lighting"
                src={titleImg}
                loading="eager"
              />

              {/* Floating Sticker Badge 1 */}
              <div className="absolute top-4 left-4 bg-[#fff8f5]/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 text-[#1e1b19] border border-white/60">
                <span className="w-2 h-2 rounded-full bg-[#9f3c16] animate-pulse"></span>
                <span className="text-[10px] font-semibold tracking-wide uppercase font-sans">
                  Batch #48 Now Open
                </span>
              </div>

              {/* Floating Sticker Badge 2 */}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-lg shadow-lg flex items-center gap-2.5 max-w-[240px] border border-[#dec0b7]/30">
                <span className="material-symbols-outlined text-[#9f6912] text-[22px]">
                  workspace_premium
                </span>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-[#1e1b19] leading-tight">
                    Small Kitchen Craft
                  </span>
                  <span className="text-[10px] text-[#57423b] leading-tight mt-0.5">
                    Stone-ground pods &amp; cold infusions
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
