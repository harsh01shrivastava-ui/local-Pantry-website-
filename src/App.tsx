/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CulinaryCode } from './components/CulinaryCode';
import { ProductCatalog } from './components/ProductCatalog';
import { StorySection } from './components/StorySection';
import { RecipeSection } from './components/RecipeSection';
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

import {
  PANTRY_PRODUCTS,
  PANTRY_RECIPES,
  PANTRY_REVIEWS,
} from './data/pantryData';
import { Product, Recipe, CartItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('shop');

  // Pre-seed cart with 2 items to match the "2" badge in the provided screenshot!
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PANTRY_PRODUCTS[0], // Crunchy Chilli Oil
      quantity: 1,
      jarSize: 'Standard',
    },
    {
      product: PANTRY_PRODUCTS[1], // Farm-Fresh Basil Pesto
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

  const wishlistProducts = PANTRY_PRODUCTS.filter((p) => wishlistIds.has(p.id));
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
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* Main Content Area (padded for fixed header) */}
      <main className="w-full pt-28 flex-1">
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
                  ? PANTRY_PRODUCTS.filter((p) => p.rating >= 4.8)
                  : PANTRY_PRODUCTS
              }
              onSelectProduct={(product) => setSelectedProduct(product)}
              onAddToCart={(product) => handleAddToCart(product, 1, 'Standard')}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
            />

            {/* Story Highlight */}
            <StorySection onReadMoreStory={() => setActiveTab('our-story')} />

            {/* Recipes Journal */}
            <RecipeSection
              recipes={PANTRY_RECIPES}
              onSelectRecipe={(recipe) => setSelectedRecipe(recipe)}
              onExploreAllRecipes={() => setActiveTab('recipes')}
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
                products={PANTRY_PRODUCTS.slice(0, 4)}
                onSelectProduct={(product) => setSelectedProduct(product)}
                onAddToCart={(product) => handleAddToCart(product, 1, 'Standard')}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
              />
            </div>
          </div>
        ) : activeTab === 'contact' ? (
          <ContactPage onBackToShop={() => setActiveTab('shop')} />
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
            ? PANTRY_PRODUCTS.find((p) => p.id === selectedRecipe.featuredProductId)
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
        products={PANTRY_PRODUCTS}
        recipes={PANTRY_RECIPES}
        onSelectProduct={(product) => setSelectedProduct(product)}
        onSelectRecipe={(recipe) => setSelectedRecipe(recipe)}
      />

      {/* User Account / Orders Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onNavigateToShop={() => {
          setIsAccountOpen(false);
          setActiveTab('shop');
        }}
      />
    </div>
  );
}
