import React, { useState } from 'react';
import { Product, CategoryId } from '../types';

interface ProductCatalogProps {
  products: Product[];
  isLoading?: boolean;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: Set<string>;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  isLoading = false,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const filteredProducts = products
    .filter((product) => {
      if (selectedCategory === 'all') return true;
      const cat = (product.category || '').toLowerCase();
      if (selectedCategory === 'chili') {
        return cat.includes('chili') || cat.includes('oil') || cat === 'chili';
      }
      if (selectedCategory === 'pesto') {
        return cat.includes('pesto') || cat.includes('dip') || cat.includes('spread') || cat === 'pesto';
      }
      if (selectedCategory === 'sauces') {
        return cat.includes('sauce') || cat.includes('marinade') || cat === 'sauces';
      }
      if (selectedCategory === 'heritage') {
        return cat.includes('heritage') || cat.includes('spice') || cat.includes('sweet') || cat.includes('podi') || cat === 'heritage';
      }
      return cat === selectedCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured original order
    });

  const handleAddClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId((current) => (current === product.id ? null : current));
    }, 1500);
  };

  const getBadgeStyle = (tagType?: string) => {
    switch (tagType) {
      case 'bestseller':
        return 'bg-[#9f3c16] text-white';
      case 'fresh':
        return 'bg-[#516444] text-white';
      case 'heritage':
        return 'bg-[#805200] text-white';
      case 'essential':
        return 'bg-[#e1d8d5] text-[#1e1b19]';
      case 'new':
        return 'bg-[#bf542c] text-white';
      case 'weekend':
        return 'bg-[#d3e9c1] text-[#0f2007]';
      default:
        return 'bg-[#9f3c16] text-white';
    }
  };

  return (
    <section className="w-full bg-[#fff8f5] py-12 sm:py-16" id="shop-catalog">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Section Heading & Category Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-10">
          <div>
            <span className="text-[11px] sm:text-[12px] text-[#516444] tracking-widest uppercase font-semibold block font-sans">
              Small-Batch Provisions
            </span>
            <h2 className="font-serif text-[28px] xs:text-[32px] sm:text-[40px] text-[#1e1b19] mt-1 font-normal tracking-tight">
              From Our Kitchen Pantry
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#57423b] max-w-lg mt-2 font-sans leading-relaxed">
              Hand-stirred condiments and pantry staples crafted to elevate your daily toasts, pastas, noodles, and dosas.
            </p>
          </div>

          {/* Horizontally scrollable category filters on mobile */}
          <div className="w-full md:w-auto overflow-hidden">
            <div className="flex items-center gap-1.5 p-1 bg-[#f5ece9] rounded-xl border border-[#dec0b7]/40 overflow-x-auto no-scrollbar py-1.5 px-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer min-h-[38px] ${
                  selectedCategory === 'all'
                    ? 'bg-[#9f3c16] text-white shadow-xs'
                    : 'text-[#57423b] hover:text-[#1e1b19]'
                }`}
              >
                All Favorites
              </button>
              <button
                onClick={() => setSelectedCategory('chili')}
                className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer min-h-[38px] ${
                  selectedCategory === 'chili'
                    ? 'bg-[#9f3c16] text-white shadow-xs'
                    : 'text-[#57423b] hover:text-[#1e1b19]'
                }`}
              >
                Chili Oils &amp; Crisps
              </button>
              <button
                onClick={() => setSelectedCategory('pesto')}
                className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer min-h-[38px] ${
                  selectedCategory === 'pesto'
                    ? 'bg-[#9f3c16] text-white shadow-xs'
                    : 'text-[#57423b] hover:text-[#1e1b19]'
                }`}
              >
                Fresh Pesto &amp; Dips
              </button>
              <button
                onClick={() => setSelectedCategory('sauces')}
                className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer min-h-[38px] ${
                  selectedCategory === 'sauces'
                    ? 'bg-[#9f3c16] text-white shadow-xs'
                    : 'text-[#57423b] hover:text-[#1e1b19]'
                }`}
              >
                Simmered Sauces
              </button>
              <button
                onClick={() => setSelectedCategory('heritage')}
                className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer min-h-[38px] ${
                  selectedCategory === 'heritage'
                    ? 'bg-[#9f3c16] text-white shadow-xs'
                    : 'text-[#57423b] hover:text-[#1e1b19]'
                }`}
              >
                Heritage &amp; Treats
              </button>
            </div>
          </div>
        </div>

        {/* Quick Sorting & Results Count */}
        <div className="flex items-center justify-between text-xs text-[#57423b] mb-6 pb-2 border-b border-[#efe6e3]">
          <span>
            Showing <strong className="text-[#1e1b19]">{filteredProducts.length}</strong> creations
          </span>
          <div className="flex items-center gap-1.5">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-[#1e1b19] font-medium border-0 focus:outline-none cursor-pointer py-1"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid: Stacked 1-col on mobile, 2-col on tablet, 3-col on desktop */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-[#efe6e3] animate-pulse"
              >
                <div className="aspect-[16/10] sm:aspect-[4/3] bg-[#f5ece9]" />
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="h-5 bg-[#f5ece9] rounded-md w-3/4" />
                  <div className="h-4 bg-[#f5ece9] rounded-md w-1/2" />
                  <div className="h-12 bg-[#f5ece9] rounded-md w-full" />
                  <div className="pt-4 border-t border-[#f5ece9] flex justify-between items-center">
                    <div className="h-6 bg-[#f5ece9] rounded-md w-16" />
                    <div className="h-10 bg-[#f5ece9] rounded-xl w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#efe6e3] max-w-lg mx-auto shadow-sm">
            <span className="material-symbols-outlined text-[42px] text-[#9f3c16]/40 mb-3">
              inventory_2
            </span>
            <h3 className="font-serif text-[22px] text-[#1e1b19] font-normal mb-2">
              No creations found
            </h3>
            <p className="text-[14px] text-[#57423b] mb-5">
              We couldn't find any provisions in this category right now. Fresh small batches are hand-stirred weekly in our Banswara kitchen!
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-5 py-2.5 rounded-xl bg-[#9f3c16] text-white font-semibold text-[13px] hover:bg-[#bf542c] transition-colors cursor-pointer"
            >
              View All Favorites
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8" id="products-grid">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlistIds.has(product.id);
              const isJustAdded = addedProductId === product.id;

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(42,38,36,0.04)] border border-[#efe6e3] hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                {/* Image Container with Badges */}
                <div className="relative overflow-hidden aspect-[16/10] sm:aspect-[4/3] bg-[#f5ece9] flex items-center justify-center">
                  {product.imageUrl ? (
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={product.altText}
                      src={product.imageUrl}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#f6eee8] text-[#a8958c] select-none p-6 text-center transition-colors group-hover:bg-[#f2e5dd]">
                      <div className="w-12 h-12 rounded-xl bg-[#ebdcd5] border border-[#ddcec7] flex items-center justify-center mb-2.5 shadow-sm text-[#8e7b72]">
                        <span className="material-symbols-outlined text-[24px]">image</span>
                      </div>
                      <span className="text-[12px] font-semibold tracking-wider uppercase text-[#6d5b53]">
                        Image Placeholder
                      </span>
                    </div>
                  )}

                  {/* Top-Left Tag Badge */}
                  {product.tag && (
                    <span
                      className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm font-sans ${getBadgeStyle(
                        product.tagType
                      )}`}
                    >
                      {product.tag}
                    </span>
                  )}

                  {/* Wishlist Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product.id);
                    }}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center transition-colors shadow-sm cursor-pointer ${
                      isWishlisted ? 'text-[#9f3c16]' : 'text-[#57423b] hover:text-[#9f3c16]'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[19px] ${
                        isWishlisted ? 'fill-current' : ''
                      }`}
                    >
                      favorite
                    </span>
                  </button>
                </div>

                {/* Card Details */}
                <div className="p-4 sm:p-6 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Meta Row: Weight & Rating */}
                    <div className="flex items-center justify-between text-[#57423b] text-[12px] font-sans mb-1.5">
                      <span className="font-medium">{product.subtitle}</span>
                      <span className="flex items-center text-[#805200] font-semibold gap-0.5">
                        <span className="material-symbols-outlined text-[15px] fill-current text-[#9f6912]">
                          star
                        </span>
                        <span>
                          {product.rating.toFixed(1)} ({product.reviewCount})
                        </span>
                      </span>
                    </div>

                    {/* Product Title */}
                    <h3 className="font-serif text-[20px] sm:text-[22px] font-medium text-[#1e1b19] mb-1.5 group-hover:text-[#9f3c16] transition-colors leading-snug">
                      {product.name}
                    </h3>

                    {/* Brief description */}
                    <p className="text-[13px] leading-relaxed text-[#57423b] mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Shelf Life info */}
                    <div className="flex items-center gap-1.5 text-[11px] text-[#516444] font-medium mb-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span>Shelf life: {product.shelfLife}</span>
                    </div>
                  </div>

                  {/* Pricing and Mobile-Friendly Large Tap Action Button */}
                  <div className="pt-4 border-t border-[#f5ece9] flex items-center justify-between gap-3 mt-4">
                    <div className="flex flex-col shrink-0">
                      <span className="text-[10px] uppercase tracking-wider text-[#8a726a] font-semibold">
                        Price
                      </span>
                      <span className="font-serif text-[20px] sm:text-[22px] font-medium text-[#1e1b19] tabular-nums">
                        ₹{product.price}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleAddClick(e, product)}
                      className={`min-h-[44px] px-4 py-2.5 rounded-xl font-sans text-[13px] sm:text-[14px] font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                        isJustAdded
                          ? 'bg-[#516444] text-white'
                          : product.isPreOrder
                          ? 'bg-[#516444] text-white hover:bg-[#435338]'
                          : 'bg-[#efe6e3] hover:bg-[#9f3c16] hover:text-white text-[#1e1b19]'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <span className="material-symbols-outlined text-[18px]">done</span>
                          <span>Added!</span>
                        </>
                      ) : product.isPreOrder ? (
                        <>
                          <span className="material-symbols-outlined text-[18px]">event_available</span>
                          <span>Pre-Order</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">
                            add_shopping_cart
                          </span>
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </section>
  );
};
