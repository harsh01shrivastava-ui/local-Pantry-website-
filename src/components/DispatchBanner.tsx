import React, { useState } from 'react';

interface DispatchBannerProps {
  onOpenGiftingModal: () => void;
}

export const DispatchBanner: React.FC<DispatchBannerProps> = ({ onOpenGiftingModal }) => {
  const [pincode, setPincode] = useState('');
  const [checkResult, setCheckResult] = useState<{
    status: 'success' | 'error' | null;
    message: string;
  }>({ status: null, message: '' });

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincode.trim();
    if (!/^\d{6}$/.test(clean)) {
      setCheckResult({
        status: 'error',
        message: 'Please enter a valid 6-digit Indian postal pincode (e.g. 314001).',
      });
      return;
    }

    // Determine delivery estimate based on prefix
    if (clean.startsWith('31') || clean.startsWith('32') || clean.startsWith('30')) {
      setCheckResult({
        status: 'success',
        message: `Direct dispatch from Banswara / Jaipur hub to ${clean}: Arriving in 24–48 hours with fresh cooling pack!`,
      });
    } else if (clean.startsWith('40') || clean.startsWith('41') || clean.startsWith('11') || clean.startsWith('12')) {
      setCheckResult({
        status: 'success',
        message: `Express air courier to ${clean} (Metro Hub): Dispatch Tuesday & Friday, arriving in 2 business days.`,
      });
    } else {
      setCheckResult({
        status: 'success',
        message: `Pan-India fragile-protected delivery active for ${clean}: Estimated 2–4 business days via Bluedart/Delhivery.`,
      });
    }
  };

  return (
    <section className="w-full bg-[#fff8f5] py-16">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="bg-gradient-to-br from-[#f5ece9] to-[#efe6e3] rounded-2xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-sm border border-[#dec0b7]/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Column: Pincode Checker */}
            <div className="lg:col-span-7">
              <span className="text-[12px] text-[#9f3c16] uppercase tracking-widest font-semibold block mb-2 font-sans">
                Pantry Direct Dispatch
              </span>
              <h2 className="font-serif text-[28px] sm:text-[36px] text-[#1e1b19] mb-3 font-normal tracking-tight leading-snug">
                Catch us at the next weekend artisan market or order your weekly drop.
              </h2>
              <p className="text-[15px] leading-relaxed text-[#57423b] max-w-lg mb-6 font-sans">
                We ship our fresh batches across India every Tuesday &amp; Friday with thermal bubble insulation and fragile glass protection.
              </p>

              {/* Interactive Postal Code Checker */}
              <div className="bg-white p-4 rounded-xl max-w-md shadow-sm border border-[#efe6e3]">
                <label
                  className="block text-[12px] text-[#57423b] mb-1.5 font-semibold font-sans"
                  htmlFor="pincode-input"
                >
                  Check Delivery Time for Your City
                </label>
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input
                    id="pincode-input"
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit Pincode (e.g. 314001)"
                    className="flex-1 bg-[#fbf2ee] px-3.5 py-2 rounded-lg text-[14px] text-[#1e1b19] placeholder:text-[#8a726a] border border-transparent focus:border-[#9f3c16] focus:bg-white focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-[#9f3c16] hover:bg-[#bf542c] text-white text-[13px] font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
                  >
                    Check
                  </button>
                </form>

                {checkResult.status === 'success' && (
                  <div className="text-[#516444] text-[12px] mt-3 flex items-start gap-1.5 font-sans animate-fadeIn">
                    <span className="material-symbols-outlined text-[17px] shrink-0 mt-0.5">
                      local_shipping
                    </span>
                    <span>{checkResult.message}</span>
                  </div>
                )}

                {checkResult.status === 'error' && (
                  <div className="text-[#ba1a1a] text-[12px] mt-3 flex items-start gap-1.5 font-sans animate-fadeIn">
                    <span className="material-symbols-outlined text-[17px] shrink-0 mt-0.5">
                      info
                    </span>
                    <span>{checkResult.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: WhatsApp / Bulk Enquiry Box */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border-l-4 border-[#516444] border-t border-r border-b border-[#efe6e3]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-[#516444] text-[28px]">
                    chat
                  </span>
                  <h3 className="font-serif text-[22px] font-medium text-[#1e1b19]">
                    Curated Gift Boxes &amp; Hampers
                  </h3>
                </div>
                <p className="text-[13px] leading-relaxed text-[#57423b] mb-6 font-sans">
                  Planning wedding favours, corporate festive gifts, or custom condiment assortments? Speak directly with our kitchen founder.
                </p>
                <button
                  onClick={onOpenGiftingModal}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-[#516444] hover:bg-[#435338] text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Chat with us on WhatsApp / Custom Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
