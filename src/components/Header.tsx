import React from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAccount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-[#fff8f5]/95 backdrop-blur-xl border-b border-[#e1d8d5]/40 shadow-[0_1px_12px_rgba(42,38,36,0.04)]">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#516444] text-white px-4 lg:px-8 py-1.5 text-center transition-all">
        <p className="text-[11px] md:text-xs font-semibold tracking-wide font-sans flex items-center justify-center gap-1.5">
          <span>✨</span>
          <span>Small Batch Drops • Homemade in Banswara with 100% Natural Ingredients • Free Shipping on Orders Over ₹999</span>
        </p>
      </div>

      {/* Main Header Bar */}
      <div className="h-20 max-w-[1280px] mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <button
          onClick={() => handleNavClick('shop')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <img
            alt="The Local Pantry Logo"
            className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida/AEtjO1WN66p7RjXeS9XxdKoqvHKg4QLUwgyLahcIK-as2sgOka-lINGNQl8uWOfioe-2w_3pbaFO1QD_E-z7MiMT4r-8XQNyPpNs380c-HPBmAuV3SfCM5X_TQi4stsJ0PRhL5-FhK0mlsathasRKfNNprA-eQuYt7X6YGg8zSgwe7rqhG1R1ged9oErsV_Gb4SpGDsEFaOvBohxn6ohKVeBWOEGdRF7As6OT6MHbB8C3kR_6p4HxOcDJst8uvw"
          />
          <div className="flex flex-col">
            <span className="font-serif text-[22px] md:text-[24px] font-semibold text-[#1e1b19] tracking-tight leading-none">
              The Local Pantry
            </span>
            <span className="text-[11px] text-[#57423b] italic tracking-tight mt-0.5">
              Curated with love in Banswara
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          <button
            onClick={() => handleNavClick('shop')}
            className={`py-1 text-[15px] transition-colors whitespace-nowrap ${
              activeTab === 'shop'
                ? 'text-[#9f3c16] font-semibold border-b-2 border-[#9f3c16]'
                : 'text-[#57423b] hover:text-[#9f3c16]'
            }`}
          >
            Shop
          </button>
          <button
            onClick={() => handleNavClick('our-story')}
            className={`py-1 text-[15px] transition-colors whitespace-nowrap ${
              activeTab === 'our-story'
                ? 'text-[#9f3c16] font-semibold border-b-2 border-[#9f3c16]'
                : 'text-[#57423b] hover:text-[#9f3c16]'
            }`}
          >
            Our Story
          </button>
          <button
            onClick={() => handleNavClick('best-sellers')}
            className={`py-1 text-[15px] transition-colors whitespace-nowrap ${
              activeTab === 'best-sellers'
                ? 'text-[#9f3c16] font-semibold border-b-2 border-[#9f3c16]'
                : 'text-[#57423b] hover:text-[#9f3c16]'
            }`}
          >
            Best Sellers
          </button>
          <button
            onClick={() => handleNavClick('recipes')}
            className={`py-1 text-[15px] transition-colors whitespace-nowrap ${
              activeTab === 'recipes'
                ? 'text-[#9f3c16] font-semibold border-b-2 border-[#9f3c16]'
                : 'text-[#57423b] hover:text-[#9f3c16]'
            }`}
          >
            Recipes/Inspiration
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`py-1 text-[15px] transition-colors whitespace-nowrap ${
              activeTab === 'contact'
                ? 'text-[#9f3c16] font-semibold border-b-2 border-[#9f3c16]'
                : 'text-[#57423b] hover:text-[#9f3c16]'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="Search pantry catalog"
            className="text-[#57423b] hover:text-[#9f3c16] transition-colors flex items-center p-2 rounded-full hover:bg-[#efe6e3]/60 focus:outline-none"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={onOpenWishlist}
            aria-label="View saved wishlist"
            className="relative text-[#57423b] hover:text-[#9f3c16] transition-colors flex items-center p-2 rounded-full hover:bg-[#efe6e3]/60 focus:outline-none"
          >
            <span className="material-symbols-outlined text-[22px]">favorite</span>
            {wishlistCount > 0 && (
              <span className="absolute 1 top-0.5 right-0.5 bg-[#9f3c16] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            aria-label="View shopping bag"
            className="relative text-[#57423b] hover:text-[#9f3c16] transition-colors flex items-center p-2 rounded-full hover:bg-[#efe6e3]/60 focus:outline-none"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            <span className="absolute 1 top-0.5 right-0.5 bg-[#9f3c16] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          </button>

          {/* Find a Stall / Stockist Button */}
          <button
            onClick={() => handleNavClick('stockists')}
            className="hidden md:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#efe6e3] hover:bg-[#e9e1dd] text-[#1e1b19] text-[13px] font-semibold tracking-wide transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-[#516444]">location_on</span>
            <span>Find a Stall / Stockist</span>
          </button>

          {/* User Profile / Orders */}
          <button
            onClick={onOpenAccount}
            aria-label="User account and past orders"
            className="w-8 h-8 rounded-full bg-[#9f3c16] hover:bg-[#bf542c] text-white flex items-center justify-center transition-colors focus:outline-none"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-1.5 text-[#1e1b19] focus:outline-none"
          >
            <span className="material-symbols-outlined text-[26px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e1d8d5] bg-[#fff8f5] px-6 py-4 shadow-xl flex flex-col gap-3">
          <button
            onClick={() => handleNavClick('shop')}
            className={`text-left py-2 text-base font-medium ${
              activeTab === 'shop' ? 'text-[#9f3c16] font-semibold' : 'text-[#1e1b19]'
            }`}
          >
            Shop All Provisions
          </button>
          <button
            onClick={() => handleNavClick('best-sellers')}
            className={`text-left py-2 text-base font-medium ${
              activeTab === 'best-sellers' ? 'text-[#9f3c16] font-semibold' : 'text-[#1e1b19]'
            }`}
          >
            Best Sellers 🔥
          </button>
          <button
            onClick={() => handleNavClick('our-story')}
            className={`text-left py-2 text-base font-medium ${
              activeTab === 'our-story' ? 'text-[#9f3c16] font-semibold' : 'text-[#1e1b19]'
            }`}
          >
            Our Story & Heritage
          </button>
          <button
            onClick={() => handleNavClick('recipes')}
            className={`text-left py-2 text-base font-medium ${
              activeTab === 'recipes' ? 'text-[#9f3c16] font-semibold' : 'text-[#1e1b19]'
            }`}
          >
            Recipes & Inspiration
          </button>
          <button
            onClick={() => handleNavClick('stockists')}
            className={`text-left py-2 text-base font-medium ${
              activeTab === 'stockists' ? 'text-[#9f3c16] font-semibold' : 'text-[#1e1b19]'
            }`}
          >
            Find a Stall / Stockist (Markets)
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`text-left py-2 text-base font-medium ${
              activeTab === 'contact' ? 'text-[#9f3c16] font-semibold' : 'text-[#1e1b19]'
            }`}
          >
            Contact & Custom Hampers
          </button>
        </div>
      )}
    </header>
  );
};
