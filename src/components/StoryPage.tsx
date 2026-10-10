import React from 'react';

interface StoryPageProps {
  onBackToShop: () => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({ onBackToShop }) => {
  return (
    <div className="w-full bg-[#fff8f5] py-12 animate-fadeIn">
      <div className="max-w-[1080px] mx-auto px-4 lg:px-8">
        {/* Back Link */}
        <button
          onClick={onBackToShop}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57423b] hover:text-[#9f3c16] mb-8"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Pantry Catalog</span>
        </button>

        {/* Hero Banner */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[12px] uppercase font-bold text-[#9f3c16] tracking-widest block font-sans mb-2">
            The Chronicle of The Local Pantry
          </span>
          <h1 className="font-serif text-[38px] sm:text-[48px] text-[#1e1b19] font-normal tracking-tight leading-tight">
            Rooted in the Soil and Simmer of Banswara
          </h1>
          <p className="text-[17px] text-[#57423b] mt-4 font-sans leading-relaxed">
            From handwritten labels gifted to visiting family, to a slow-crafted culinary movement across India.
          </p>
        </div>

        {/* Big Editorial Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl mb-12 border border-[#efe6e3]">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1b6a6DS731wZnLClwcDTMGtxpEZP_F088O-AMigfJP5d9ddu4xxU1BNlLyN2zKyAxcUox2rmqvTw7PlUJHju09fzd063Kg_e0vXKWqE8gPkrFxCoILI2UUHq7-9ERzI0DZ_PKSYWPxP--OaRbrbqZomzsdHlMIOFYrHGK5GDuwweKysTf3QTVT0p0KC5QpyuN2qLSY9wDqiyoSWWH10es7C9LW83Ba3yApIMhutXkVa-twxBHg7Y-"
            alt="Banswara kitchen with clay bowls, stone mortars, and drying chillies"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-medium text-[#1e1b19]">
            The Joshi Family Workshop • Banswara, Southern Rajasthan
          </div>
        </div>

        {/* Multi-Section Narrative */}
        <div className="space-y-12 text-[#57423b] text-[16px] leading-relaxed">
          {/* Chapter 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4">
              <span className="font-serif text-[36px] text-[#dec0b7] block font-light leading-none">
                01
              </span>
              <h3 className="font-serif text-[24px] text-[#1e1b19] font-medium mt-1">
                The City of A Hundred Islands
              </h3>
            </div>
            <div className="md:col-span-8 space-y-4">
              <p>
                Banswara rests in the verdant Vagad region of southern Rajasthan, where the Mahi river basin creates rich alluvial micro-climates unlike anywhere else in the desert state.
              </p>
              <p>
                Here, native garlic varieties grow smaller but intensely aromatic; local yellow mustard seeds yield deep golden, pungent oils; and sun-cured chillies carry warmth without harsh chemical bitterness.
              </p>
            </div>
          </div>

          {/* Chapter 2 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-8 border-t border-[#efe6e3]">
            <div className="md:col-span-4">
              <span className="font-serif text-[36px] text-[#dec0b7] block font-light leading-none">
                02
              </span>
              <h3 className="font-serif text-[24px] text-[#1e1b19] font-medium mt-1">
                The Stone Mortar &amp; Low Cast-Iron Flames
              </h3>
            </div>
            <div className="md:col-span-8 space-y-4">
              <p>
                Most modern food brands rely on industrial blade homogenizers running at thousands of RPMs. The friction generates intense heat, oxidizing delicate herbal aromas before they even reach the jar.
              </p>
              <p>
                At The Local Pantry, our spices for Gunpowder Podi are slow-roasted in heavy cast-iron kadhais and ground cold. Our chili oil garlic chips are hand-sliced and fried at strictly governed temperatures so the crunch endures for months without rancidity.
              </p>
            </div>
          </div>

          {/* Chapter 3 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-8 border-t border-[#efe6e3]">
            <div className="md:col-span-4">
              <span className="font-serif text-[36px] text-[#dec0b7] block font-light leading-none">
                03
              </span>
              <h3 className="font-serif text-[24px] text-[#1e1b19] font-medium mt-1">
                Our Glass &amp; Soil Covenant
              </h3>
            </div>
            <div className="md:col-span-8 space-y-4">
              <p>
                We maintain a strict zero-plastic packaging policy. Every jar is reusable apothecary glass. For shipping across India, our boxes use expandable virgin kraft paper webbing and biodegradable cornstarch cushioning instead of plastic bubble wrap.
              </p>
              <p>
                When you finish a jar, soak it in warm water to release our water-soluble label, and repurpose it for kitchen spices, paperclips, or homemade jams.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Strip */}
        <div className="mt-16 p-8 bg-[#f5ece9] rounded-2xl border border-[#efe6e3] text-center">
          <h3 className="font-serif text-[26px] text-[#1e1b19] font-medium mb-2">
            Taste the Craft in Batch #48
          </h3>
          <p className="text-sm text-[#57423b] max-w-md mx-auto mb-6">
            Currently open for nationwide fragile dispatch every Tuesday and Friday.
          </p>
          <button
            onClick={onBackToShop}
            className="py-3 px-6 bg-[#9f3c16] hover:bg-[#bf542c] text-white text-xs font-semibold rounded-lg shadow-md transition-colors"
          >
            Explore the Pantry Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
