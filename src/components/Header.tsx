import React, { useState, useEffect } from 'react';
import logoImg from '../assets/images/logo.png';
import { UserProfile } from '../types/auth';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  wishlistCount: number;
  currentUser?: UserProfile | null;
  isLoggedIn?: boolean;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount,
  currentUser,
  isLoggedIn = false,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAccount,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isOwner = Boolean(isLoggedIn && currentUser && currentUser.role === 'owner');

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-[#fff8f5]/95 backdrop-blur-xl border-b border-[#e1d8d5]/50 shadow-[0_1px_12px_rgba(42,38,36,0.04)]">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#516444] text-white px-3 sm:px-4 lg:px-8 py-1 sm:py-1.5 text-center transition-all">
        <p className="text-[10px] sm:text-xs font-semibold tracking-wide font-sans flex items-center justify-center gap-1 sm:gap-1.5 leading-snug">
          <span>✨</span>
          <span className="truncate">
            {isOwner
              ? '👑 Store Owner Active • Managing Kitchen Dispatches & Inventory'
              : 'Small Batch Drops • 100% Natural Ingredients • Free Shipping Over ₹999'}
          </span>
        </p>
      </div>

      {/* Main Header Bar */}
      <div className="min-h-[64px] sm:min-h-[76px] md:min-h-[96px] max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3 md:py-4 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Lockup */}
        <button
          onClick={() => handleNavClick('shop')}
          className="flex items-center gap-2.5 sm:gap-3.5 text-left group focus:outline-none cursor-pointer"
        >
          <img
            alt="The Local Pantry Logo"
            className="h-10 sm:h-12 md:h-16 w-auto object-contain rounded-lg transition-transform group-hover:scale-105 shadow-xs border border-[#dec0b7]/30 shrink-0"
            src={logoImg}
          />
          <div className="flex flex-col">
            <span className="font-serif text-[18px] sm:text-[22px] md:text-[27px] font-semibold text-[#1e1b19] tracking-tight leading-none">
              The Local Pantry
            </span>
            <span className="text-[10px] sm:text-[11px] md:text-[13px] text-[#57423b] italic tracking-tight mt-0.5 sm:mt-1 hidden xs:block">
              Curated with love in Banswara
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          <button
            onClick={() => handleNavClick('shop')}
            className={`py-2 text-[15px] font-medium tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'shop'
                ? 'text-[#9f3c16] font-semibold border-b-2 border-[#9f3c16]'
                : 'text-[#57423b] hover:text-[#9f3c16]'
            }`}
          >
            Shop
          </button>
          <button
            onClick={() => handleNavClick('our-story')}
            className={`py-2 text-[15px] font-medium tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'our-story'
                ? 'text-[#9f3c16] font-semibold border-b-2 border-[#9f3c16]'
                : 'text-[#57423b] hover:text-[#9f3c16]'
            }`}
          >
            Our Story
          </button>
          <button
            onClick={() => handleNavClick('best-sellers')}
            className={`py-2 text-[15px] font-medium tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'best-sellers'
                ? 'text-[#9f3c16] font-semibold border-b-2 border-[#9f3c16]'
                : 'text-[#57423b] hover:text-[#9f3c16]'
            }`}
          >
            Best Sellers
          </button>
          <button
            onClick={() => handleNavClick('recipes')}
            className={`py-2 text-[15px] font-medium tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'recipes'
                ? 'text-[#9f3c16] font-semibold border-b-2 border-[#9f3c16]'
                : 'text-[#57423b] hover:text-[#9f3c16]'
            }`}
          >
            Recipes &amp; Ideas
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`py-2 text-[15px] font-medium tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'contact'
                ? 'text-[#9f3c16] font-semibold border-b-2 border-[#9f3c16]'
                : 'text-[#57423b] hover:text-[#9f3c16]'
            }`}
          >
            Contact
          </button>

          {/* Owner Dashboard link: Shown ONLY when logged in as Owner */}
          {isOwner && (
            <button
              onClick={() => handleNavClick('owner-dashboard')}
              className={`py-1.5 px-3 rounded-full text-[13px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                activeTab === 'owner-dashboard'
                  ? 'bg-[#9f3c16] text-white shadow-sm'
                  : 'bg-[#516444]/15 hover:bg-[#516444]/25 text-[#516444] border border-[#516444]/30'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              <span>Owner Dashboard</span>
            </button>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="Search pantry catalog"
            className="text-[#57423b] hover:text-[#9f3c16] transition-colors flex items-center justify-center p-2 sm:p-2.5 rounded-full hover:bg-[#efe6e3]/70 focus:outline-none cursor-pointer min-w-[38px] min-h-[38px]"
          >
            <span className="material-symbols-outlined text-[21px] sm:text-[23px]">search</span>
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={onOpenWishlist}
            aria-label="View saved wishlist"
            className="relative text-[#57423b] hover:text-[#9f3c16] transition-colors flex items-center justify-center p-2 rounded-full hover:bg-[#efe6e3]/60 focus:outline-none cursor-pointer min-w-[38px] min-h-[38px]"
          >
            <span className="material-symbols-outlined text-[21px] sm:text-[22px]">favorite</span>
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#9f3c16] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            aria-label="View shopping bag & checkout"
            className={`relative transition-colors flex items-center justify-center p-2 rounded-full focus:outline-none cursor-pointer min-w-[38px] min-h-[38px] ${
              activeTab === 'checkout'
                ? 'text-[#9f3c16] bg-[#f5ece9] ring-1 ring-[#9f3c16]/40'
                : 'text-[#57423b] hover:text-[#9f3c16] hover:bg-[#efe6e3]/60'
            }`}
          >
            <span className="material-symbols-outlined text-[21px] sm:text-[22px]">shopping_bag</span>
            <span className="absolute top-0.5 right-0.5 bg-[#9f3c16] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          </button>

          {/* User Profile / Auth Modal Trigger */}
          <button
            onClick={onOpenAccount}
            aria-label="User account and role switcher"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors focus:outline-none cursor-pointer shrink-0 font-medium text-[12px] shadow-xs ${
              isOwner
                ? 'bg-[#516444] text-white hover:bg-[#435338] ring-2 ring-[#516444]/30'
                : 'bg-[#9f3c16] text-white hover:bg-[#bf542c]'
            }`}
            title={
              isOwner
                ? 'Store Owner Account (Chef Vikas Oli)'
                : currentUser?.username
                ? `@${currentUser.username} (Account)`
                : 'Customer Account'
            }
          >
            {currentUser?.avatarInitials || <span className="material-symbols-outlined text-[18px]">person</span>}
          </button>

          {/* Direct Sign Out Button in Header (visible on larger screens) */}
          {isLoggedIn && onLogout && (
            <button
              onClick={onLogout}
              aria-label="Sign out of account"
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[12px] font-semibold text-[#57423b] hover:text-[#ba1a1a] hover:bg-[#efe6e3] transition-colors cursor-pointer border border-[#dec0b7]/40 shadow-2xs"
              title="Sign out of session"
            >
              <span className="material-symbols-outlined text-[15px]">logout</span>
              <span>Sign Out</span>
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu"
            className="lg:hidden p-2 text-[#1e1b19] hover:bg-[#efe6e3]/70 rounded-lg focus:outline-none cursor-pointer flex items-center justify-center min-w-[40px] min-h-[40px]"
          >
            <span className="material-symbols-outlined text-[26px]">menu</span>
          </button>
        </div>
      </div>

      {/* Modern Slide-In Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Dimmed Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-in Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-[85%] max-w-[340px] bg-[#fff8f5] shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideLeft border-l border-[#efe6e3] z-50">
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between p-5 border-b border-[#efe6e3] bg-[#fbf2ee]">
                <div className="flex items-center gap-2.5">
                  <img
                    src={logoImg}
                    alt="The Local Pantry Logo"
                    className="h-10 w-auto object-contain rounded-md shadow-xs border border-[#dec0b7]/30"
                  />
                  <div>
                    <span className="font-serif text-[18px] font-semibold text-[#1e1b19] block leading-tight">
                      The Local Pantry
                    </span>
                    <span className="text-[11px] text-[#57423b] italic">
                      {isOwner ? '👑 Owner Mode Active' : 'Curated in Banswara'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu drawer"
                  className="w-9 h-9 rounded-full bg-[#efe6e3] hover:bg-[#9f3c16] hover:text-white text-[#1e1b19] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Owner Dashboard mobile link (highlighted when logged in as owner) */}
              {isOwner && (
                <div className="p-4 pb-0">
                  <button
                    onClick={() => handleNavClick('owner-dashboard')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#516444] text-white font-semibold text-[14px] shadow-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                    <span>👑 Open Owner Dashboard</span>
                  </button>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="p-4 space-y-1">
                <button
                  onClick={() => handleNavClick('shop')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-[15px] font-medium transition-all ${
                    activeTab === 'shop'
                      ? 'bg-[#9f3c16] text-white font-semibold shadow-xs'
                      : 'text-[#1e1b19] hover:bg-[#f5ece9]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">storefront</span>
                  <span>Shop All Provisions</span>
                </button>

                <button
                  onClick={() => handleNavClick('best-sellers')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-[15px] font-medium transition-all ${
                    activeTab === 'best-sellers'
                      ? 'bg-[#9f3c16] text-white font-semibold shadow-xs'
                      : 'text-[#1e1b19] hover:bg-[#f5ece9]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
                  <span>Best Sellers 🔥</span>
                </button>

                <button
                  onClick={() => handleNavClick('our-story')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-[15px] font-medium transition-all ${
                    activeTab === 'our-story'
                      ? 'bg-[#9f3c16] text-white font-semibold shadow-xs'
                      : 'text-[#1e1b19] hover:bg-[#f5ece9]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">auto_stories</span>
                  <span>Our Story &amp; Heritage</span>
                </button>

                <button
                  onClick={() => handleNavClick('recipes')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-[15px] font-medium transition-all ${
                    activeTab === 'recipes'
                      ? 'bg-[#9f3c16] text-white font-semibold shadow-xs'
                      : 'text-[#1e1b19] hover:bg-[#f5ece9]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                  <span>Recipes &amp; Serving Ideas</span>
                </button>

                <button
                  onClick={() => handleNavClick('stockists')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-[15px] font-medium transition-all ${
                    activeTab === 'stockists'
                      ? 'bg-[#9f3c16] text-white font-semibold shadow-xs'
                      : 'text-[#1e1b19] hover:bg-[#f5ece9]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                  <span>Artisan Stalls &amp; Markets</span>
                </button>

                <button
                  onClick={() => handleNavClick('contact')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-[15px] font-medium transition-all ${
                    activeTab === 'contact'
                      ? 'bg-[#9f3c16] text-white font-semibold shadow-xs'
                      : 'text-[#1e1b19] hover:bg-[#f5ece9]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                  <span>Contact &amp; Custom Hampers</span>
                </button>
              </nav>

              {/* Mobile Drawer Quick Shortcuts */}
              <div className="px-4 py-2 space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAccount();
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#fbf2ee] border border-[#efe6e3] text-[#1e1b19] text-[13px] font-medium hover:bg-[#efe6e3] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#9f3c16]">
                      {isOwner ? 'admin_panel_settings' : 'person'}
                    </span>
                    <span>{isOwner ? 'Store Owner Dashboard & Account' : isLoggedIn ? 'My Account Profile' : 'Sign In / Register'}</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-[#8a726a]">chevron_right</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenWishlist();
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#fbf2ee] border border-[#efe6e3] text-[#1e1b19] text-[13px] font-medium hover:bg-[#efe6e3] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#9f3c16]">favorite</span>
                    <span>Saved Wishlist</span>
                  </span>
                  <span className="bg-[#9f3c16] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {wishlistCount}
                  </span>
                </button>
              </div>
            </div>

            {/* Drawer Bottom Action */}
            <div className="p-4 border-t border-[#efe6e3] bg-[#fbf2ee] space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCart();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#9f3c16] hover:bg-[#bf542c] text-white text-[14px] font-semibold shadow-md transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                <span>Pantry Bag &amp; Checkout ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
              </button>

              {/* Mobile Drawer Logout Button */}
              {isLoggedIn && onLogout && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white border border-red-200 text-[#ba1a1a] hover:bg-red-50 text-[13px] font-semibold transition-colors cursor-pointer shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[17px]">logout</span>
                  <span>Sign Out ({currentUser?.name?.split(' ')[0] || 'Account'})</span>
                </button>
              )}

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#516444] font-medium text-center">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                <span>Small batch kitchen dispatches from Banswara</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
