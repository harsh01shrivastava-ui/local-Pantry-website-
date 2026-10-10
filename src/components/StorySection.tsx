import React from 'react';

interface StorySectionProps {
  onReadMoreStory: () => void;
}

export const StorySection: React.FC<StorySectionProps> = ({ onReadMoreStory }) => {
  return (
    <section className="w-full bg-[#f5ece9] py-16 overflow-hidden border-b border-[#efe6e3]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(42,38,36,0.04)] p-6 sm:p-8 lg:p-12 border border-[#efe6e3]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Story Narrative */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-1.5 text-[#9f3c16] text-[12px] uppercase tracking-widest font-semibold mb-2 font-sans">
                <span className="material-symbols-outlined text-[18px]">favorite</span>
                <span>Our Roots &amp; Conviction</span>
              </div>

              <h2 className="font-serif text-[32px] sm:text-[40px] text-[#1e1b19] mb-4 font-normal tracking-tight">
                Born in a Home Kitchen in Banswara
              </h2>

              <p className="text-[17px] leading-relaxed text-[#57423b] mb-4 font-sans">
                What began as small, handwritten jars gifted to close friends and visiting family across southern Rajasthan has quietly evolved into a dedicated pantry of mindful essentials.
              </p>

              <p className="text-[15px] leading-relaxed text-[#57423b] mb-6 font-sans">
                We never take industrial shortcuts. We do not use pectin to fake jam consistency, artificial acids to prolong shelf life, or palm blends to dilute cold-pressed aromatics. Every single batch is weighed, hand-stirred on slow flames, and labeled right here at home.
              </p>

              {/* Founder stamp & Read More */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#dec0b7]/40 w-full">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#efe6e3] flex items-center justify-center text-[#9f3c16] font-serif text-[18px] font-bold shadow-sm">
                    LP
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-[18px] text-[#1e1b19] font-medium leading-tight">
                      The Joshi Family Kitchen
                    </span>
                    <span className="text-[12px] text-[#57423b] italic font-sans mt-0.5">
                      Banswara, Rajasthan • Hand-stirred since 2021
                    </span>
                  </div>
                </div>

                <button
                  onClick={onReadMoreStory}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#9f3c16] hover:text-[#bf542c] group"
                >
                  <span>Explore Our Heritage Story</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>

            {/* Visual / Location Card & Stats */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative rounded-xl overflow-hidden shadow-md border border-[#efe6e3]">
                <img
                  className="w-full h-72 object-cover"
                  alt="Traditional Rajasthani stone kitchen with brass ladles clay bowls and fresh red chilies laid out in sunlight near a rustic window with potted herbs"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1b6a6DS731wZnLClwcDTMGtxpEZP_F088O-AMigfJP5d9ddu4xxU1BNlLyN2zKyAxcUox2rmqvTw7PlUJHju09fzd063Kg_e0vXKWqE8gPkrFxCoILI2UUHq7-9ERzI0DZ_PKSYWPxP--OaRbrbqZomzsdHlMIOFYrHGK5GDuwweKysTf3QTVT0p0KC5QpyuN2qLSY9wDqiyoSWWH10es7C9LW83Ba3yApIMhutXkVa-twxBHg7Y-"
                  loading="lazy"
                />
                <div className="absolute bottom-3 left-3 right-3 bg-[#fff8f5]/90 backdrop-blur-sm p-3 rounded-lg flex items-center justify-between border border-white/50">
                  <span className="text-[13px] text-[#1e1b19] font-semibold">
                    Banswara Heritage Workshop
                  </span>
                  <span className="text-[11px] text-[#516444] bg-[#516444]/15 px-2 py-0.5 rounded font-medium">
                    Rajasthan, India
                  </span>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#fbf2ee] p-3 rounded-lg border border-[#efe6e3]">
                  <span className="font-serif text-[24px] text-[#9f3c16] block font-bold leading-tight tabular-nums">
                    120+
                  </span>
                  <span className="text-[11px] text-[#57423b] font-medium">Batches Brewed</span>
                </div>
                <div className="bg-[#fbf2ee] p-3 rounded-lg border border-[#efe6e3]">
                  <span className="font-serif text-[24px] text-[#516444] block font-bold leading-tight tabular-nums">
                    0%
                  </span>
                  <span className="text-[11px] text-[#57423b] font-medium">Chemical Additives</span>
                </div>
                <div className="bg-[#fbf2ee] p-3 rounded-lg border border-[#efe6e3]">
                  <span className="font-serif text-[24px] text-[#805200] block font-bold leading-tight tabular-nums">
                    4,800+
                  </span>
                  <span className="text-[11px] text-[#57423b] font-medium">Jars Delivered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
