import React from 'react';

interface HeroProps {
  onExploreClick: () => void;
  onRecipesClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onRecipesClick }) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#fff8f5] pt-6 pb-12 lg:pb-16 border-b border-[#f5ece9]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Text Column */}
          <div className="lg:col-span-6 flex flex-col items-start z-10">
            {/* Pill Header */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#516444]/10 text-[#516444] mb-4">
              <span className="material-symbols-outlined text-[18px]">grain</span>
              <span className="text-xs font-semibold tracking-wider uppercase font-sans">
                Small-Batch Indian Heritage &amp; World Flavours
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="font-serif text-[42px] sm:text-[50px] lg:text-[56px] leading-[1.1] text-[#1e1b19] tracking-tight mb-4 font-normal">
              Dips, Preserves,
              <br />
              Condiments &amp; More.
            </h1>

            {/* Body Description */}
            <p className="text-[17px] lg:text-[18px] leading-relaxed text-[#57423b] max-w-xl mb-7 font-sans">
              No additives. No preservatives. Handcrafted in small batches directly from our family kitchen in Banswara, Rajasthan.
            </p>

            {/* Interactive CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#9f3c16] hover:bg-[#bf542c] text-white text-[14px] font-semibold rounded-lg shadow-sm hover:shadow-md transition-all group"
              >
                <span>Explore the Pantry</span>
                <span className="material-symbols-outlined ml-2 text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
              <button
                onClick={onRecipesClick}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#f5ece9] hover:bg-[#efe6e3] text-[#1e1b19] text-[14px] font-semibold rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined mr-2 text-[18px] text-[#57423b]">
                  menu_book
                </span>
                <span>View Recipes</span>
              </button>
            </div>

            {/* Quick Trust Badges */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#57423b] text-[12px] sm:text-[13px] pt-4 border-t border-[#dec0b7]/40 w-full">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#516444] text-[16px]">
                  check_circle
                </span>
                <span>100% Pure Cold-Pressed Oils</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#516444] text-[16px]">
                  check_circle
                </span>
                <span>Farm-Grown Seasonal Produce</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#516444] text-[16px]">
                  check_circle
                </span>
                <span>Plastic-Free Glass Packed</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Showcase */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-[540px] rounded-xl overflow-hidden shadow-xl bg-[#fbf2ee] p-2 border border-[#efe6e3]">
              {/* Hero Image */}
              <img
                className="w-full h-[380px] sm:h-[440px] lg:h-[480px] object-cover rounded-lg"
                alt="Artisanal glass jars of crunchy chili oil, vibrant emerald basil pesto, and rich simmered pizza sauce sitting on a rustic stone kitchen counter alongside fresh basil leaves, sourdough bread, whole garlic cloves, and stone-ground spices in soft morning sun"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7oZ_ZA17d34-C9qnG4Df89XYdQNZ-AUO1Yn5Q5mgJPneHJjPALziDFxVjfj3EbEM3RU7qUeOqlsHHQ3-FXzmt0Ov3XJrZXitKiqRkeWug0jeg8o-h0uzbHXhgSi-2hu6du3Q2gNzF2rKlwS-WyYf1qgZ6KzzwX3TH9_LG94bYziayocdoezVrbI9u4UdlGhGTsp5dvqUFLTLXlZIAX9frFZzGMbAmPBx4Oroycq_ISJIdJ0C9yqgD"
                loading="eager"
              />

              {/* Floating Sticker Badge 1 */}
              <div className="absolute top-5 left-5 bg-[#fff8f5]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-2 text-[#1e1b19] border border-white/60">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9f3c16] animate-pulse"></span>
                <span className="text-[11px] font-semibold tracking-wide uppercase font-sans">
                  Batch #48 Now Open
                </span>
              </div>

              {/* Floating Sticker Badge 2 */}
              <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-3 max-w-[250px] border border-[#dec0b7]/30">
                <span className="material-symbols-outlined text-[#9f6912] text-[26px]">
                  workspace_premium
                </span>
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-[#1e1b19] leading-tight">
                    Small Kitchen Craft
                  </span>
                  <span className="text-[11px] text-[#57423b] leading-tight mt-0.5">
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
