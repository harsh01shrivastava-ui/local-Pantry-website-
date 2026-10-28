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
import { CheckoutPage } from './components/CheckoutPage';
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
  subscribeToProducts,
} from './lib/supabase';

export default function App() {
  const [activeTab, setActiveTabState] = useState<string>(() => {
    try {
      return sessionStorage.getItem('lp_active_tab') || 'shop';
    } catch {
      return 'shop';
    }
  });

  const setActiveTab = (tab: string) => {
    try {
      sessionStorage.setItem('lp_active_tab', tab);
    } catch {}
    setActiveTabState(tab);
  };

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
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const isOwner = Boolean(isLoggedIn && currentUser && currentUser.role === 'owner');

  // Supabase Auth session & Realtime listeners
  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured) {
      try {
        const saved = localStorage.getItem('local_pantry_user');
        if (saved) {
          const profile: UserProfile = JSON.parse(saved);
          setCurrentUser(profile);
          setIsLoggedIn(true);
          if (profile.role === 'owner' && (activeTab === 'shop' || !sessionStorage.getItem('lp_active_tab'))) {
            setActiveTab('owner-dashboard');
          }
        }
      } catch (e) {
        console.warn('Failed to parse cached user:', e);
      }
      setIsAuthChecking(false);
      return;
    }

    // 1. Fetch initial session via getSession() on app load & store in state
    async function initSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (isMounted) {
          if (session?.user) {
            const profile = mapSupabaseUserToProfile(session.user);
            setCurrentUser(profile);
            setIsLoggedIn(true);
            try {
              localStorage.setItem('local_pantry_user', JSON.stringify(profile));
            } catch {}
            if (profile.role === 'owner' && (activeTab === 'shop' || !sessionStorage.getItem('lp_active_tab'))) {
              setActiveTab('owner-dashboard');
            }
          } else {
            // Check fallback cached user if any
            const saved = localStorage.getItem('local_pantry_user');
            if (saved) {
              try {
                const profile: UserProfile = JSON.parse(saved);
                setCurrentUser(profile);
                setIsLoggedIn(true);
                if (profile.role === 'owner' && (activeTab === 'shop' || !sessionStorage.getItem('lp_active_tab'))) {
                  setActiveTab('owner-dashboard');
                }
              } catch {
                setCurrentUser(null);
                setIsLoggedIn(false);
              }
            } else {
              setCurrentUser(null);
              setIsLoggedIn(false);
            }
          }
        }
      } catch (err) {
        console.warn('Supabase getSession error on load:', err);
        if (isMounted) {
          const saved = localStorage.getItem('local_pantry_user');
          if (saved) {
            try {
              const profile: UserProfile = JSON.parse(saved);
              setCurrentUser(profile);
              setIsLoggedIn(true);
            } catch {
              setCurrentUser(null);
              setIsLoggedIn(false);
            }
          } else {
            setCurrentUser(null);
            setIsLoggedIn(false);
          }
        }
      } finally {
        if (isMounted) {
          setIsAuthChecking(false);
        }
      }
    }

    initSession();

    // 2. Auth state change listener: listen to SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, and INITIAL_SESSION
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          const profile = mapSupabaseUserToProfile(session.user);
          setCurrentUser(profile);
          setIsLoggedIn(true);
          try {
            localStorage.setItem('local_pantry_user', JSON.stringify(profile));
          } catch {}
          if (event === 'SIGNED_IN' && profile.role === 'owner') {
            setActiveTab('owner-dashboard');
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setIsLoggedIn(false);
        try {
          localStorage.removeItem('local_pantry_user');
          sessionStorage.removeItem('lp_active_tab');
        } catch {}
        setActiveTab('shop');
      } else if (event === 'INITIAL_SESSION') {
        if (session?.user) {
          const profile = mapSupabaseUserToProfile(session.user);
          setCurrentUser(profile);
          setIsLoggedIn(true);
          try {
            localStorage.setItem('local_pantry_user', JSON.stringify(profile));
          } catch {}
          if (profile.role === 'owner' && (activeTab === 'shop' || !sessionStorage.getItem('lp_active_tab'))) {
            setActiveTab('owner-dashboard');
          }
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fetch initial products and orders strictly from Supabase + Subscribe to 100% Real-Time streams
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

    // 100% Real-time subscription to orders (inserts, updates, status changes stream instantly)
    const unsubscribeOrders = subscribeToOrders(async () => {
      const orderResult = await getSupabaseOrders();
      if (orderResult.data && isMounted) {
        setOrders(orderResult.data);
      }
    });

    // 100% Real-time subscription to products & inventory (prices, stock status stream instantly)
    const unsubscribeProducts = subscribeToProducts(async () => {
      const prodResult = await getSupabaseProducts();
      if (prodResult.data && isMounted) {
        setProducts(prodResult.data);
      }
    });

    // Automatic re-sync when tab visibility is restored
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isSupabaseConfigured) {
        const [prodResult, orderResult] = await Promise.all([
          getSupabaseProducts(),
          getSupabaseOrders(),
        ]);
        if (isMounted) {
          if (prodResult.data) setProducts(prodResult.data);
          if (orderResult.data) setOrders(orderResult.data);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      unsubscribeOrders();
      unsubscribeProducts();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Auth Operations
  const handleLogin = (role: UserRole, profile?: UserProfile) => {
    if (profile) {
      setCurrentUser(profile);
      setIsLoggedIn(true);
      try {
        localStorage.setItem('local_pantry_user', JSON.stringify(profile));
      } catch {}
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
    try {
      localStorage.removeItem('local_pantry_user');
      sessionStorage.removeItem('lp_active_tab');
    } catch {}
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
    setProducts((prev) =>
      prev.map((prod) =>
        prod.id === productId
          ? { ...prod, stock_status: stock, stockStatus: stock }
          : prod
      )
    );
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
        onOpenCart={() => {
          setActiveTab('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
        ) : activeTab === 'checkout' ? (
          /* DEDICATED FULL-PAGE CHECKOUT & PANTRY BAG ROUTE */
          <CheckoutPage
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onBackToShop={() => {
              setActiveTab('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOrderCreated={handleOrderCreated}
            currentUser={currentUser}
            onNavigateToOwnerDashboard={() => {
              setActiveTab('owner-dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
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
        onProceedToCheckout={() => {
          setSelectedProduct(null);
          setActiveTab('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
