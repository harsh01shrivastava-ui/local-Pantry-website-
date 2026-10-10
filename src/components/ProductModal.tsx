import React, { useState } from 'react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, jarSize: 'Standard' | 'Grand (Double)') => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [jarSize, setJarSize] = useState<'Standard' | 'Grand (Double)'>('Standard');
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'pairings'>('details');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const currentPrice = jarSize === 'Standard' ? product.price : Math.round(product.price * 1.75);
  const currentWeight = jarSize === 'Standard' ? product.weight : `${parseInt(product.weight) * 2}g`;

  const handleAdd = () => {
    onAddToCart(product, quantity, jarSize);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-[#efe6e3] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm text-[#57423b] hover:text-[#1e1b19] flex items-center justify-center shadow-md transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Product Image Column */}
          <div className="md:col-span-5 relative bg-[#f5ece9] min-h-[300px] md:min-h-full">
            <img
              src={product.imageUrl}
              alt={product.altText}
              className="w-full h-full object-cover"
            />
            {product.tag && (
              <span className="absolute top-4 left-4 bg-[#9f3c16] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                {product.tag}
              </span>
            )}
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`absolute bottom-4 left-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-colors ${
                isWishlisted ? 'text-[#9f3c16]' : 'text-[#57423b] hover:text-[#9f3c16]'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isWishlisted ? 'fill-current' : ''}`}>
                favorite
              </span>
            </button>
          </div>

          {/* Product Content Column */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-[#57423b] mb-2 font-sans">
                <span className="uppercase tracking-wider font-semibold text-[#516444]">
                  {product.category}
                </span>
                <span className="flex items-center text-[#805200] font-medium gap-1">
                  <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                  <span>{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
                </span>
              </div>

              {/* Title & Price */}
              <h2 className="font-serif text-[28px] sm:text-[32px] text-[#1e1b19] font-normal leading-tight mb-2">
                {product.name}
              </h2>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-serif text-[26px] font-medium text-[#9f3c16] tabular-nums">
                  ₹{currentPrice}
                </span>
                <span className="text-xs text-[#57423b]">({currentWeight} packed in fragile glass)</span>
              </div>

              {/* Jar Size Selector */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-[#57423b] uppercase tracking-wider mb-2 font-sans">
                  Select Jar Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setJarSize('Standard')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-left flex flex-col ${
                      jarSize === 'Standard'
                        ? 'border-[#9f3c16] bg-[#fbf2ee] text-[#9f3c16]'
                        : 'border-[#efe6e3] hover:border-[#dec0b7] text-[#1e1b19]'
                    }`}
                  >
                    <span>Standard Jar ({product.weight})</span>
                    <span className="text-[11px] opacity-75 font-normal">₹{product.price}</span>
                  </button>
                  <button
                    onClick={() => setJarSize('Grand (Double)')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-left flex flex-col ${
                      jarSize === 'Grand (Double)'
                        ? 'border-[#9f3c16] bg-[#fbf2ee] text-[#9f3c16]'
                        : 'border-[#efe6e3] hover:border-[#dec0b7] text-[#1e1b19]'
                    }`}
                  >
                    <span>Grand Jar ({parseInt(product.weight) * 2}g)</span>
                    <span className="text-[11px] opacity-75 font-normal">₹{Math.round(product.price * 1.75)} (Save 12%)</span>
                  </button>
                </div>
              </div>

              {/* Info Tabs */}
              <div className="flex border-b border-[#efe6e3] mb-4 gap-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'details'
                      ? 'border-[#9f3c16] text-[#9f3c16]'
                      : 'border-transparent text-[#57423b] hover:text-[#1e1b19]'
                  }`}
                >
                  Story &amp; Flavor
                </button>
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'ingredients'
                      ? 'border-[#9f3c16] text-[#9f3c16]'
                      : 'border-transparent text-[#57423b] hover:text-[#1e1b19]'
                  }`}
                >
                  Pure Ingredients
                </button>
                <button
                  onClick={() => setActiveTab('pairings')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'pairings'
                      ? 'border-[#9f3c16] text-[#9f3c16]'
                      : 'border-transparent text-[#57423b] hover:text-[#1e1b19]'
                  }`}
                >
                  How to Serve
                </button>
              </div>

              {/* Tab Contents */}
              <div className="mb-6 text-[13px] leading-relaxed text-[#57423b]">
                {activeTab === 'details' && (
                  <div>
                    <p className="mb-3">{product.longDescription}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {product.dietary.map((d, i) => (
                        <span
                          key={i}
                          className="bg-[#516444]/10 text-[#516444] text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                        >
                          ✓ {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'ingredients' && (
                  <div>
                    <p className="font-semibold text-[#1e1b19] mb-2">100% Raw Ingredients List:</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {product.ingredients.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-[#f5ece9] text-[#1e1b19] px-2.5 py-1 rounded-md text-[12px]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="p-2.5 bg-[#fbf2ee] rounded-lg text-xs border border-[#efe6e3] mt-2">
                      <strong className="text-[#1e1b19]">Shelf-Life:</strong> {product.shelfLife}
                    </div>
                  </div>
                )}

                {activeTab === 'pairings' && (
                  <ul className="space-y-1.5">
                    {product.pairingSuggestions.map((pairing, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[#9f3c16] text-[16px] shrink-0 mt-0.5">
                          restaurant
                        </span>
                        <span>{pairing}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Quantity and Add to Cart Row */}
            <div className="pt-4 border-t border-[#efe6e3] flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#efe6e3] rounded-lg bg-[#fbf2ee] p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center text-[#1e1b19] hover:bg-white rounded transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-[#1e1b19] hover:bg-white rounded transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add CTA */}
              <button
                onClick={handleAdd}
                className={`flex-1 py-3 px-5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm ${
                  added
                    ? 'bg-[#516444] text-white'
                    : 'bg-[#9f3c16] hover:bg-[#bf542c] text-white'
                }`}
              >
                {added ? (
                  <>
                    <span className="material-symbols-outlined text-[18px]">done</span>
                    <span>Added to Pantry Bag!</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">
                      shopping_bag
                    </span>
                    <span>Add to Bag • ₹{currentPrice * quantity}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
