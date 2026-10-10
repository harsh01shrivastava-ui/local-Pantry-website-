import React, { useState } from 'react';
import { Product, CategoryId } from '../types';

interface ProductCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: Set<string>;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
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
      return product.category === selectedCategory;
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
    <section className="w-full bg-[#fff8f5] py-14 lg:py-16" id="shop-catalog">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Section Heading & Category Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-[12px] text-[#516444] tracking-widest uppercase font-semibold block font-sans">
              Small-Batch Provisions
            </span>
            <h2 className="font-serif text-[32px] sm:text-[40px] text-[#1e1b19] mt-1 font-normal tracking-tight">
              From Our Kitchen Pantry
            </h2>
            <p className="text-[15px] text-[#57423b] max-w-lg mt-2 font-sans leading-relaxed">
              Hand-stirred condiments and pantry staples crafted to elevate your daily sourdough toasts, pastas, noodles, and dosas.
            </p>
          </div>

          {/* Category Filter Controls */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#f5ece9] rounded-lg self-start md:self-auto border border-[#dec0b7]/40">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded text-[13px] font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#9f3c16] text-white shadow-sm'
                  : 'text-[#57423b] hover:text-[#1e1b19]'
              }`}
            >
              All Favorites
            </button>
            <button
              onClick={() => setSelectedCategory('chili')}
              className={`px-3.5 py-1.5 rounded text-[13px] font-semibold transition-colors ${
                selectedCategory === 'chili'
                  ? 'bg-[#9f3c16] text-white shadow-sm'
                  : 'text-[#57423b] hover:text-[#1e1b19]'
              }`}
            >
              Chili Oils &amp; Crisps
            </button>
            <button
              onClick={() => setSelectedCategory('pesto')}
              className={`px-3.5 py-1.5 rounded text-[13px] font-semibold transition-colors ${
                selectedCategory === 'pesto'
                  ? 'bg-[#9f3c16] text-white shadow-sm'
                  : 'text-[#57423b] hover:text-[#1e1b19]'
              }`}
            >
              Fresh Pesto &amp; Dips
            </button>
            <button
              onClick={() => setSelectedCategory('sauces')}
              className={`px-3.5 py-1.5 rounded text-[13px] font-semibold transition-colors ${
                selectedCategory === 'sauces'
                  ? 'bg-[#9f3c16] text-white shadow-sm'
                  : 'text-[#57423b] hover:text-[#1e1b19]'
              }`}
            >
              Simmered Sauces
            </button>
            <button
              onClick={() => setSelectedCategory('heritage')}
              className={`px-3.5 py-1.5 rounded text-[13px] font-semibold transition-colors ${
                selectedCategory === 'heritage'
                  ? 'bg-[#9f3c16] text-white shadow-sm'
                  : 'text-[#57423b] hover:text-[#1e1b19]'
              }`}
            >
              Heritage &amp; Treats
            </button>
          </div>
        </div>

        {/* Quick Sorting / Results Count */}
        <div className="flex items-center justify-between text-xs text-[#57423b] mb-6 pb-2 border-b border-[#efe6e3]">
          <span>
            Showing <strong className="text-[#1e1b19]">{filteredProducts.length}</strong> small-batch creations
          </span>
          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-[#1e1b19] font-medium border-0 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="products-grid">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlistIds.has(product.id);
            const isJustAdded = addedProductId === product.id;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(42,38,36,0.04)] border border-[#efe6e3] hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {/* Image Container with Badges */}
                <div className="relative overflow-hidden aspect-[4/3] bg-[#f5ece9]">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={product.altText}
                    src={product.imageUrl}
                    loading="lazy"
                  />

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
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-colors shadow-sm ${
                      isWishlisted ? 'text-[#9f3c16]' : 'text-[#57423b] hover:text-[#9f3c16]'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        isWishlisted ? 'fill-current' : ''
                      }`}
                    >
                      favorite
                    </span>
                  </button>
                </div>

                {/* Card Details */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Meta Row: Weight & Rating */}
                    <div className="flex items-center justify-between text-[#57423b] text-[12px] font-sans mb-1.5">
                      <span>{product.subtitle}</span>
                      <span className="flex items-center text-[#805200] font-medium gap-0.5">
                        <span className="material-symbols-outlined text-[15px] fill-current">
                          star
                        </span>
                        <span>
                          {product.rating.toFixed(1)} ({product.reviewCount})
                        </span>
                      </span>
                    </div>

                    {/* Product Title */}
                    <h3 className="font-serif text-[22px] font-medium text-[#1e1b19] mb-2 group-hover:text-[#9f3c16] transition-colors leading-snug">
                      {product.name}
                    </h3>

                    {/* Brief description */}
                    <p className="text-[13px] leading-relaxed text-[#57423b] mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing and Action Button */}
                  <div className="pt-4 border-t border-[#f5ece9] flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wider text-[#57423b] font-semibold">
                        Price
                      </span>
                      <span className="font-serif text-[22px] font-medium text-[#1e1b19] tabular-nums">
                        ₹{product.price}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleAddClick(e, product)}
                      className={`px-4 py-2 rounded-lg font-sans text-[13px] font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
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
      </div>
    </section>
  );
};
