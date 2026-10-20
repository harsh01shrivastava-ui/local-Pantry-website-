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

import {
  PANTRY_PRODUCTS,
  PANTRY_RECIPES,
  PANTRY_REVIEWS,
} from './data/pantryData';
import { Product, Recipe, CartItem } from './types';
import { CustomerOrder, OrderStatus, UserProfile, UserRole } from './types/auth';
import { INITIAL_ORDERS, MOCK_CUSTOMER, MOCK_OWNER } from './data/mockOrders';
import {
  isSupabaseConfigured,
  supabase,
  getSupabaseProducts,
  getSupabaseOrders,
  createSupabaseOrder,
  updateSupabaseOrderStatus,
  updateSupabaseProductPrice,
  updateSupabaseProductStock,
  seedProductsToSupabase,
  seedSampleOrdersToSupabase,
  mapSupabaseUserToProfile,
  signOutUser,
  subscribeToOrders,
} from './lib/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('shop');

  // Auth & Role state with persistent local storage
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedRole = localStorage.getItem('local_pantry_auth_role');
    return savedRole === 'owner' ? MOCK_OWNER : MOCK_CUSTOMER;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('local_pantry_is_logged_in') !== 'false';
  });

  // Orders State (supports incoming new orders from cart checkout!)
  const [orders, setOrders] = useState<CustomerOrder[]>(INITIAL_ORDERS);

  // Products State (supports owner price updates)
  const [products, setProducts] = useState<Product[]>(PANTRY_PRODUCTS);

  // Pre-seed cart with 2 items to match default preview
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PANTRY_PRODUCTS[0], // Smokey Tandoori
      quantity: 1,
      jarSize: 'Standard',
    },
    {
      product: PANTRY_PRODUCTS[1], // Mint Dip
      quantity: 1,
      jarSize: 'Standard',
    },
  ]);

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  // Modals & Drawers state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Supabase Auth session & Realtime listeners
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // 1. Initial Session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const profile = mapSupabaseUserToProfile(session.user);
        setCurrentUser(profile);
        setIsLoggedIn(true);
      }
    });

    // 2. Auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const profile = mapSupabaseUserToProfile(session.user);
        setCurrentUser(profile);
        setIsLoggedIn(true);
      } else if (_event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setCurrentUser(MOCK_CUSTOMER);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch initial products and orders from Supabase (or fallback to local data)
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!isSupabaseConfigured) return;

      try {
        const [prodResult, orderResult] = await Promise.all([
          getSupabaseProducts(),
          getSupabaseOrders(),
        ]);

        if (isMounted) {
          if (prodResult.data && prodResult.data.length > 0) {
            setProducts(prodResult.data);
          }
          if (orderResult.data && orderResult.data.length > 0) {
            setOrders(orderResult.data);
          }
        }
      } catch (e) {
        console.warn('Initial Supabase fetch fallback:', e);
      }
    }

    loadData();

    // Setup live subscription to orders so checkout & status updates arrive in real-time
    const unsubscribeOrders = subscribeToOrders(async () => {
      const orderResult = await getSupabaseOrders();
      if (orderResult.data && orderResult.data.length > 0 && isMounted) {
        setOrders(orderResult.data);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeOrders();
    };
  }, []);

  // Auth Operations
  const handleSwitchRole = (role: UserRole) => {
    const newUser = role === 'owner' ? MOCK_OWNER : MOCK_CUSTOMER;
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('local_pantry_auth_role', role);
    localStorage.setItem('local_pantry_is_logged_in', 'true');
    if (role === 'owner') {
      setActiveTab('owner-dashboard');
    } else if (activeTab === 'owner-dashboard') {
      setActiveTab('shop');
    }
  };

  const handleLogin = (role: UserRole, profile?: UserProfile) => {
    if (profile) {
      setCurrentUser(profile);
      setIsLoggedIn(true);
      localStorage.setItem('local_pantry_auth_role', profile.role);
      localStorage.setItem('local_pantry_is_logged_in', 'true');
      if (profile.role === 'owner') {
        setActiveTab('owner-dashboard');
      } else if (activeTab === 'owner-dashboard') {
        setActiveTab('shop');
      }
    } else {
      handleSwitchRole(role);
    }
    setIsAccountOpen(false);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await signOutUser();
    }
    setIsLoggedIn(false);
    localStorage.setItem('local_pantry_is_logged_in', 'false');
    if (activeTab === 'owner-dashboard') {
      setActiveTab('shop');
    }
    setIsAccountOpen(false);
  };

  // Owner Dashboard Operations
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
      await createSupabaseOrder(newOrder, isLoggedIn ? currentUser.id : undefined);
    }
  };

  const handleSeedDatabase = async (): Promise<{ success: boolean; message: string }> => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        message: 'Please set your valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env first.',
      };
    }
    try {
      await seedProductsToSupabase(PANTRY_PRODUCTS);
      await seedSampleOrdersToSupabase(INITIAL_ORDERS);
      const prodRes = await getSupabaseProducts();
      if (prodRes.data && prodRes.data.length > 0) setProducts(prodRes.data);
      const orderRes = await getSupabaseOrders();
      if (orderRes.data && orderRes.data.length > 0) setOrders(orderRes.data);
      return {
        success: true,
        message: `Successfully seeded ${PANTRY_PRODUCTS.length} products & sample orders to Supabase!`,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Seed error: ${err.message}`,
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

            {/* Product Catalog */}
            <ProductCatalog
              products={
                activeTab === 'best-sellers'
                  ? products.filter((p) => p.rating >= 4.8)
                  : products
              }
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
            {/* Quick Product pairings row below recipes */}
            <div className="max-w-[1280px] mx-auto px-4 lg:px-8 mt-12">
              <h3 className="font-serif text-[26px] text-[#1e1b19] font-medium mb-4">
                Condiments Featured in These Recipes
              </h3>
              <ProductCatalog
                products={products.slice(0, 4)}
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
          /* OWNER DASHBOARD ROUTE (Protected with Access Guard) */
          isLoggedIn && currentUser.role === 'owner' ? (
            <OwnerDashboard
              currentUser={currentUser}
              orders={orders}
              products={products}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onUpdateProductPrice={handleUpdateProductPrice}
              onUpdateProductStock={handleUpdateProductStock}
              onSeedDatabase={handleSeedDatabase}
              onNavigateToShop={() => setActiveTab('shop')}
              onSwitchRole={handleSwitchRole}
            />
          ) : (
            /* Protected Access Guard Notice */
            <div className="max-w-[680px] mx-auto px-4 py-16 sm:py-24 text-center">
              <div className="bg-white p-7 sm:p-12 rounded-3xl border border-[#efe6e3] shadow-lg">
                <div className="w-16 h-16 rounded-2xl bg-[#9f3c16]/10 text-[#9f3c16] flex items-center justify-center mx-auto mb-4 shadow-xs">
                  <span className="material-symbols-outlined text-[34px]">lock</span>
                </div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#9f3c16] font-sans">
                  Store Owner Restricted Area
                </span>
                <h2 className="font-serif text-[26px] sm:text-[32px] text-[#1e1b19] font-normal mt-1 mb-3">
                  Owner Credentials Required
                </h2>
                <p className="text-[14px] sm:text-[15px] text-[#57423b] max-w-md mx-auto mb-6 leading-relaxed font-sans">
                  You are currently logged in as a <strong>Customer</strong> ({currentUser.name}) or logged out. Please switch to the Store Owner account to manage incoming batch orders and inventory.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => handleSwitchRole('owner')}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#9f3c16] hover:bg-[#bf542c] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                    <span>Switch to Store Owner Mode</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('shop')}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#f5ece9] hover:bg-[#efe6e3] text-[#1e1b19] font-semibold text-[14px] transition-all cursor-pointer"
                  >
                    Return to Shop
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

      {/* User Account / Auth & Role Switcher Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currentUser={currentUser}
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
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
