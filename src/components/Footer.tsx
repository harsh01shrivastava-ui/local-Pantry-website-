import React, { useState } from 'react';
import logoImg from '../assets/images/logo.png';

interface FooterProps {
  onNavClick: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#fbf2ee] mt-12 border-t border-[#dec0b7]/40 shadow-[0_-1px_12px_rgba(42,38,36,0.03)]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={logoImg}
                alt="The Local Pantry Logo"
                className="h-9 w-auto object-contain rounded-md"
              />
              <span className="font-serif text-[24px] font-semibold text-[#1e1b19]">
                The Local Pantry
              </span>
            </div>
            <p className="text-[14px] leading-relaxed text-[#57423b] mb-6 max-w-sm font-sans">
              Pure medley of flavours, homemade in small batches. Rooted in the heritage of Banswara, crafted with clean ingredients and zero preservatives.
            </p>
            <div className="flex items-center gap-4 text-[#57423b]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#9f3c16] transition-colors flex items-center gap-1 text-[12px] font-medium"
              >
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                <span>@thelocalpantry_</span>
              </a>
              <a
                href="#pinterest"
                onClick={(e) => e.preventDefault()}
                className="hover:text-[#9f3c16] transition-colors flex items-center gap-1 text-[12px] font-medium"
              >
                <span className="material-symbols-outlined text-[16px]">push_pin</span>
                <span>Pinterest</span>
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#9f3c16] transition-colors flex items-center gap-1 text-[12px] font-medium"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-[18px] font-medium text-[#1e1b19] mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavClick('shop')}
                  className="text-[13px] text-[#57423b] hover:text-[#9f3c16] transition-colors cursor-pointer text-left"
                >
                  Shop All
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('best-sellers')}
                  className="text-[13px] text-[#57423b] hover:text-[#9f3c16] transition-colors cursor-pointer text-left"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('shop')}
                  className="text-[13px] text-[#57423b] hover:text-[#9f3c16] transition-colors cursor-pointer text-left"
                >
                  Artisanal Dips
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('shop')}
                  className="text-[13px] text-[#57423b] hover:text-[#9f3c16] transition-colors cursor-pointer text-left"
                >
                  Preserves &amp; Chutneys
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('shop')}
                  className="text-[13px] text-[#57423b] hover:text-[#9f3c16] transition-colors cursor-pointer text-left"
                >
                  Spice Blends (Podi)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('recipes')}
                  className="text-[13px] text-[#57423b] hover:text-[#9f3c16] transition-colors cursor-pointer text-left"
                >
                  Recipes &amp; Pairings
                </button>
              </li>
            </ul>
          </div>

          {/* Story & Values */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-[18px] font-medium text-[#1e1b19] mb-3">
              Story &amp; Values
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavClick('our-story')}
                  className="text-[13px] text-[#57423b] hover:text-[#9f3c16] transition-colors cursor-pointer text-left"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('our-story')}
                  className="text-[13px] text-[#57423b] hover:text-[#9f3c16] transition-colors cursor-pointer text-left"
                >
                  Sourcing Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('our-story')}
                  className="text-[13px] text-[#57423b] hover:text-[#9f3c16] transition-colors cursor-pointer text-left"
                >
                  Small-batch Process
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('recipes')}
                  className="text-[13px] text-[#57423b] hover:text-[#9f3c16] transition-colors cursor-pointer text-left"
                >
                  Kitchen Journal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('stockists')}
                  className="text-[13px] text-[#57423b] hover:text-[#9f3c16] transition-colors cursor-pointer text-left"
                >
                  Stockists &amp; Pop-ups
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-4 bg-[#f5ece9] p-6 rounded-xl border border-[#efe6e3]">
            <h3 className="font-serif text-[19px] font-medium text-[#1e1b19] mb-2">
              Join Our Kitchen Table
            </h3>
            <p className="text-[13px] leading-relaxed text-[#57423b] mb-4 font-sans">
              Get exclusive first access to limited seasonal batches, farmers market schedules, and kitchen recipes.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#516444]/15 text-[#516444] rounded-lg text-[13px] font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Welcome to our table! We will send your batch preview soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-white px-3.5 py-2.5 rounded-lg text-[13px] text-[#1e1b19] placeholder:text-[#8a726a] border border-[#efe6e3] focus:border-[#9f3c16] focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#9f3c16] hover:bg-[#bf542c] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-12 pt-6 border-t border-[#dec0b7]/30 flex flex-col md:flex-row items-center justify-between text-[#57423b] text-[12px] gap-3 font-sans">
          <span>© 2026 The Local Pantry. All rights reserved. Handcrafted with heart in Banswara.</span>
          <div className="flex items-center gap-5">
            <button
              onClick={() => onNavClick('contact')}
              className="hover:text-[#9f3c16] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavClick('contact')}
              className="hover:text-[#9f3c16] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onNavClick('contact')}
              className="hover:text-[#9f3c16] transition-colors cursor-pointer"
            >
              Shipping &amp; Returns
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
