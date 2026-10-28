/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CulinaryCode } from './components/CulinaryCode';
import { ProductCatalog } from './components/ProductCatalog';
import { StorySection } from './components/StorySection';
import { RecipeSection } from './components/RecipeSection';
import { NewsfeedCarousel } from './components/NewsfeedCarousel';
import { Testimonials } from './components/Testimonials';
import { DispatchBanner } from './components/DispatchBanner';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { RecipeModal } from './components/RecipeModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { StoryPage } from './components/StoryPage';
import { StockistsPage } from './components/StockistsPage';
import { ContactPage } from './components/ContactPage';
import { AccountModal } from './components/AccountModal';
import { OwnerDashboard } from './components/OwnerDashboard';
import { AuthGate } from './components/AuthGate';
import logoImg from './assets/images/logo.png';

import {
  PANTRY_RECIPES,
  PANTRY_REVIEWS,
} from './data/pantryData';
import { Product, Recipe, CartItem } from './types';
import { CustomerOrder, OrderStatus, UserProfile, UserRole } from './types/auth';
import {
  isSupabaseConfigured,
  supabase,
  getSupabaseProducts,
  getSupabaseOrders,
  createSupabaseOrder,
  updateSupabaseOrderStatus,
  updateSupabaseProductPrice,
  updateSupabaseProductStock,
  mapSupabaseUserToProfile,
  signOutUser,
  subscribeToOrders,
} from './lib/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('shop');

  // Strict Real Auth State: Defaults to unauthenticated guest until verified by Supabase session
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Database-driven States: Initialized empty with loading indicators
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  // Cart and Wishlist state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  // Modals & Drawers state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const isOwner = Boolean(isLoggedIn && currentUser && currentUser.role === 'owner');

  // Supabase Auth session & Realtime listeners
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsAuthChecking(false);
      return;
    }

    // 1. Check existing session on boot (Session Persistence)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const profile = mapSupabaseUserToProfile(session.user);
        setCurrentUser(profile);
        setIsLoggedIn(true);
        if (profile.role === 'owner') {
          setActiveTab('owner-dashboard');
        }
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
      setIsAuthChecking(false);
    }).catch(() => {
      setIsAuthChecking(false);
    });

    // 2. Auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const profile = mapSupabaseUserToProfile(session.user);
        setCurrentUser(profile);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setActiveTab('shop');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch initial products and orders strictly from Supabase
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!isSupabaseConfigured) return;

      setIsLoadingProducts(true);
      try {
        const [prodResult, orderResult] = await Promise.all([
          getSupabaseProducts(),
          getSupabaseOrders(),
        ]);

        if (isMounted) {
          if (prodResult.data) {
            setProducts(prodResult.data);
          }
          if (orderResult.data) {
            setOrders(orderResult.data);
          }
        }
      } catch (e) {
        console.warn('Initial Supabase fetch error:', e);
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    }

    loadData();

    // Setup live subscription to orders so new checkouts & status changes update instantly
    const unsubscribeOrders = subscribeToOrders(async () => {
      const orderResult = await getSupabaseOrders();
      if (orderResult.data && isMounted) {
        setOrders(orderResult.data);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeOrders();
    };
  }, []);

  // Auth Operations
  const handleLogin = (role: UserRole, profile?: UserProfile) => {
    if (profile) {
      setCurrentUser(profile);
      setIsLoggedIn(true);
      if (profile.role === 'owner' || role === 'owner') {
        setActiveTab('owner-dashboard');
      } else {
        setActiveTab('shop');
      }
    }
    setIsAccountOpen(false);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await signOutUser();
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('shop');
    setIsAccountOpen(false);
  };

  // Owner Dashboard Operations (Direct Supabase mutations)
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
    if (isSupabaseConfigured) {
      await updateSupabaseOrderStatus(orderId, newStatus);
    }
  };

  const handleUpdateProductPrice = async (productId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === productId ? { ...prod, price: newPrice } : prod))
    );
    if (isSupabaseConfigured) {
      await updateSupabaseProductPrice(productId, newPrice);
    }
  };

  const handleUpdateProductStock = async (
    productId: string,
    stock: 'In Stock' | 'Low Stock' | 'Out of Stock'
  ) => {
    if (isSupabaseConfigured) {
      await updateSupabaseProductStock(productId, stock);
    }
  };

  const handleOrderCreated = async (newOrder: CustomerOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    if (isSupabaseConfigured) {
      const validUserId = isLoggedIn && currentUser ? currentUser.id : undefined;
      await createSupabaseOrder(newOrder, validUserId);
    }
  };

  const handleRefreshData = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const [prodRes, orderRes] = await Promise.all([
        getSupabaseProducts(),
        getSupabaseOrders(),
      ]);
      if (prodRes.data) setProducts(prodRes.data);
      if (orderRes.data) setOrders(orderRes.data);
      return {
        success: true,
        message: `Synced with Supabase: ${prodRes.data?.length || 0} products & ${orderRes.data?.length || 0} orders live.`,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Sync error: ${err.message}`,
      };
    }
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    quantity: number = 1,
    jarSize: 'Standard' | 'Grand (Double)' = 'Standard'
  ) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.jarSize === jarSize
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      }
      return [...prev, { product, quantity, jarSize }];
    });
  };

  const handleUpdateQuantity = (
    productId: string,
    jarSize: string,
    delta: number
  ) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.jarSize === jarSize) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string, jarSize: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.jarSize === jarSize)
      )
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const wishlistProducts = products.filter((p) => wishlistIds.has(p.id));
  const totalCartItemCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  // Navigation handlers
  const scrollToCatalog = () => {
    setActiveTab('shop');
    setTimeout(() => {
      const el = document.getElementById('shop-catalog');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const scrollToRecipes = () => {
    setActiveTab('shop');
    setTimeout(() => {
      const el = document.getElementById('recipes-grid');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // While session is restoring from Supabase, display warm brand loader
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#fff8f5] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <div className="relative mb-4">
          <img
            src={logoImg}
            alt="The Local Pantry"
            className="h-16 sm:h-20 w-auto object-contain rounded-2xl p-1 bg-white shadow-xs border border-[#dec0b7]/40 animate-pulse"
          />
        </div>
        <h2 className="font-serif text-[26px] text-[#1e1b19] font-medium tracking-tight">The Local Pantry</h2>
        <p className="text-[13px] text-[#57423b] mt-1">Connecting to kitchen pantry session...</p>
      </div>
    );
  }

  // Auth Gate / Login Wall: When visiting the website, if not logged in, show theme-matching Auth Gate
  if (!isLoggedIn) {
    return <AuthGate onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f5] text-[#1e1b19] font-sans antialiased selection:bg-[#9f3c16] selection:text-white">
      {/* Top Fixed Header with Badges and Nav */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartItemCount}
        wishlistCount={wishlistIds.size}
        currentUser={currentUser}
        isLoggedIn={isLoggedIn}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area (padded for fixed header) */}
      <main className="w-full pt-[96px] sm:pt-[108px] md:pt-[134px] flex-1">
        {activeTab === 'shop' || activeTab === 'best-sellers' ? (
          <div>
            {/* Hero Section */}
            <Hero
              onExploreClick={scrollToCatalog}
              onRecipesClick={scrollToRecipes}
            />

            {/* Culinary Code / 4 USPs */}
            <CulinaryCode onLearnMore={() => setActiveTab('our-story')} />

            {/* Product Catalog (exclusively powered by Supabase products) */}
            <ProductCatalog
              products={
                activeTab === 'best-sellers'
                  ? products.filter((p) => p.rating >= 4.8)
                  : products
              }
              isLoading={isLoadingProducts}
              onSelectProduct={(product) => setSelectedProduct(product)}
              onAddToCart={(product) => handleAddToCart(product, 1, 'Standard')}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
            />

            {/* Story Highlight */}
            <StorySection onReadMoreStory={() => setActiveTab('our-story')} />

            {/* Kitchen Table Journal & Live Newsfeed */}
            <NewsfeedCarousel
              onExploreRecipes={() => setActiveTab('recipes')}
            />

            {/* Customer Testimonials */}
            <Testimonials reviews={PANTRY_REVIEWS} />

            {/* Pincode Delivery Dispatch & Custom Hampers */}
            <DispatchBanner
              onOpenGiftingModal={() => setActiveTab('contact')}
            />
          </div>
        ) : activeTab === 'our-story' ? (
          <StoryPage onBackToShop={() => setActiveTab('shop')} />
        ) : activeTab === 'stockists' ? (
          <StockistsPage onBackToShop={() => setActiveTab('shop')} />
        ) : activeTab === 'recipes' ? (
          <div className="py-10">
            <RecipeSection
              recipes={PANTRY_RECIPES}
              onSelectRecipe={(recipe) => setSelectedRecipe(recipe)}
            />
            {/* Dynamic Product pairings row below recipes */}
            <div className="max-w-[1280px] mx-auto px-4 lg:px-8 mt-12">
              <h3 className="font-serif text-[26px] text-[#1e1b19] font-medium mb-4">
                Condiments Featured in These Recipes
              </h3>
              <ProductCatalog
                products={products.slice(0, 4)}
                isLoading={isLoadingProducts}
                onSelectProduct={(product) => setSelectedProduct(product)}
                onAddToCart={(product) => handleAddToCart(product, 1, 'Standard')}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
              />
            </div>
          </div>
        ) : activeTab === 'contact' ? (
          <ContactPage onBackToShop={() => setActiveTab('shop')} />
        ) : activeTab === 'owner-dashboard' ? (
          /* OWNER DASHBOARD ROUTE (Protected with Strict Role Check) */
          isOwner && currentUser ? (
            <OwnerDashboard
              currentUser={currentUser}
              orders={orders}
              products={products}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onUpdateProductPrice={handleUpdateProductPrice}
              onUpdateProductStock={handleUpdateProductStock}
              onRefreshData={handleRefreshData}
              onNavigateToShop={() => setActiveTab('shop')}
            />
          ) : (
            /* Protected Access Guard Notice - Zero Backdoor */
            <div className="max-w-[680px] mx-auto px-4 py-16 sm:py-24 text-center">
              <div className="bg-white p-7 sm:p-12 rounded-3xl border border-[#efe6e3] shadow-lg">
                <div className="w-16 h-16 rounded-2xl bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center mx-auto mb-4 shadow-xs">
                  <span className="material-symbols-outlined text-[34px]">lock</span>
                </div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#ba1a1a] font-sans">
                  Store Owner Restricted Area
                </span>
                <h2 className="font-serif text-[26px] sm:text-[32px] text-[#1e1b19] font-normal mt-1 mb-3">
                  {isLoggedIn ? 'Access Denied: Owner Privileges Required' : 'Store Owner Authentication Required'}
                </h2>
                <p className="text-[14px] sm:text-[15px] text-[#57423b] max-w-md mx-auto mb-6 leading-relaxed font-sans">
                  {isLoggedIn && currentUser ? (
                    <>
                      You are currently logged in as a <strong>Customer</strong> ({currentUser.email}). Only verified Store Owner accounts matching the kitchen administration profile can access batch orders and inventory.
                    </>
                  ) : (
                    <>
                      You are currently visiting as a guest. Please sign in with your verified Store Owner credentials to manage kitchen dispatches, orders, and product inventory.
                    </>
                  )}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setIsAccountOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#9f3c16] hover:bg-[#bf542c] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">login</span>
                    <span>{isLoggedIn ? 'Sign In with Owner Account' : 'Sign In as Store Owner'}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('shop')}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#f5ece9] hover:bg-[#efe6e3] text-[#1e1b19] font-semibold text-[14px] transition-all cursor-pointer"
                  >
                    Return to Storefront
                  </button>
                </div>
              </div>
            </div>
          )
        ) : null}
      </main>

      {/* Global Footer */}
      <Footer onNavClick={(tab) => setActiveTab(tab)} />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProduct ? wishlistIds.has(selectedProduct.id) : false}
      />

      {/* Recipe Detail Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        product={
          selectedRecipe
            ? products.find((p) => p.id === selectedRecipe.featuredProductId)
            : undefined
        }
        onClose={() => setSelectedRecipe(null)}
        onAddToCart={(prod) => handleAddToCart(prod, 1, 'Standard')}
      />

      {/* Slide-over Cart Drawer with Checkout Flow */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onExplore={scrollToCatalog}
        onOrderCreated={handleOrderCreated}
        currentUser={currentUser}
      />

      {/* Slide-over Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(product) => handleAddToCart(product, 1, 'Standard')}
      />

      {/* Instant Search Overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        recipes={PANTRY_RECIPES}
        onSelectProduct={(product) => setSelectedProduct(product)}
        onSelectRecipe={(recipe) => setSelectedRecipe(recipe)}
      />

      {/* User Account / Supabase Auth Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currentUser={currentUser}
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onNavigateToShop={() => {
          setIsAccountOpen(false);
          setActiveTab('shop');
        }}
        onNavigateToDashboard={() => {
          setIsAccountOpen(false);
          setActiveTab('owner-dashboard');
        }}
      />
    </div>
  );
}
