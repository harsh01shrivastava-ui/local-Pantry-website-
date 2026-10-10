import React, { useState } from 'react';

interface ContactPageProps {
  onBackToShop: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBackToShop }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Wedding Favours & Hampers',
    jarsNeeded: '25 - 50 jars',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[12px] uppercase font-bold text-[#9f3c16] tracking-widest block font-sans mb-1.5">
                Reach Our Kitchen Founders
              </span>
              <h1 className="font-serif text-[34px] sm:text-[40px] text-[#1e1b19] font-normal leading-tight">
                Curated Gift Boxes, Favours &amp; Pantry Queries
              </h1>
              <p className="text-[14px] text-[#57423b] mt-3 leading-relaxed">
                Whether you're planning bespoke wedding favors with custom handwritten labels, seasonal festive hampers, or stockist queries, we would love to hear from you.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#efe6e3] shadow-sm space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#9f3c16] text-[20px] shrink-0 mt-0.5">
                  location_on
                </span>
                <div>
                  <strong className="block text-[#1e1b19]">Workshop &amp; Kitchen:</strong>
                  <span className="text-[#57423b]">Civil Lines, Mahi Dam Road, Banswara, Rajasthan 327001</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#516444] text-[20px] shrink-0 mt-0.5">
                  mail
                </span>
                <div>
                  <strong className="block text-[#1e1b19]">Email Enquiries:</strong>
                  <span className="text-[#57423b]">kitchen@thelocalpantry.in</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#805200] text-[20px] shrink-0 mt-0.5">
                  chat
                </span>
                <div>
                  <strong className="block text-[#1e1b19]">WhatsApp Direct Desk:</strong>
                  <span className="text-[#57423b]">+91 94140 33819 (Mon–Sat, 10 AM – 6 PM)</span>
                </div>
              </div>
            </div>

            {/* Sourcing Guarantee Box */}
            <div className="p-5 bg-[#516444]/10 rounded-xl border border-[#516444]/20 text-xs text-[#516444] space-y-1">
              <strong className="block text-[13px] font-serif font-bold">Small-Batch Freshness Guarantee</strong>
              <p>All hamper orders are handcrafted fresh to order with personalized dispatch dates to match your event.</p>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#efe6e3] shadow-md">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#516444]/15 text-[#516444] flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined text-[32px]">done_all</span>
                  </div>
                  <h3 className="font-serif text-[24px] text-[#1e1b19] font-medium mb-2">
                    Enquiry Received with Warmth!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57423b] max-w-sm mx-auto mb-6">
                    Our founder will review your request and connect with you on WhatsApp / email within 12 hours with tasting samples and curated options.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="py-2.5 px-5 bg-[#efe6e3] hover:bg-[#dec0b7] text-[#1e1b19] text-xs font-semibold rounded-lg transition-colors"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <h3 className="font-serif text-[20px] text-[#1e1b19] font-medium mb-1">
                    Bespoke Pantry &amp; Hamper Inquiry
                  </h3>
                  <p className="text-[#57423b] mb-4">
                    Fill in your details below and we will prepare a customized gift proposal:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#57423b] font-semibold mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Radhika Singhania"
                        className="w-full p-2.5 rounded-lg border border-[#efe6e3] focus:border-[#9f3c16] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#57423b] font-semibold mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98200 00000"
                        className="w-full p-2.5 rounded-lg border border-[#efe6e3] focus:border-[#9f3c16] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#57423b] font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="radhika@example.com"
                      className="w-full p-2.5 rounded-lg border border-[#efe6e3] focus:border-[#9f3c16] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#57423b] font-semibold mb-1">Occasion / Type</label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-[#efe6e3] focus:border-[#9f3c16] outline-none bg-white cursor-pointer"
                      >
                        <option value="Wedding Favours & Hampers">Wedding Favours &amp; Hampers</option>
                        <option value="Diwali / Festive Corporate Gifts">Diwali / Festive Corporate Gifts</option>
                        <option value="Stockist & Retail Partnership">Stockist &amp; Retail Partnership</option>
                        <option value="Pantry Product Query">Pantry Product Query</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#57423b] font-semibold mb-1">Estimated Quantity</label>
                      <select
                        value={formData.jarsNeeded}
                        onChange={(e) => setFormData({ ...formData, jarsNeeded: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-[#efe6e3] focus:border-[#9f3c16] outline-none bg-white cursor-pointer"
                      >
                        <option value="Single order (1 - 5 jars)">Single order (1 - 5 jars)</option>
                        <option value="Small celebration (10 - 25 jars)">Small celebration (10 - 25 jars)</option>
                        <option value="25 - 50 jars">25 - 50 jars</option>
                        <option value="50 - 150 jars">50 - 150 jars</option>
                        <option value="150+ jars (Bulk Custom Batch)">150+ jars (Bulk Custom Batch)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#57423b] font-semibold mb-1">Custom Notes or Favorites</label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Let us know if you want custom wax stamps, specific spice blends, or dietary requirements..."
                      className="w-full p-2.5 rounded-lg border border-[#efe6e3] focus:border-[#9f3c16] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#9f3c16] hover:bg-[#bf542c] text-white text-xs font-semibold rounded-lg transition-colors shadow-md cursor-pointer mt-2"
                  >
                    Send Hamper Inquiry to Kitchen
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
