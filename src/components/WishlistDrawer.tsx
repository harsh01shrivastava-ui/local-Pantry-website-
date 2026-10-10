import React from 'react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#efe6e3] animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#efe6e3] flex items-center justify-between bg-[#fff8f5]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#9f3c16] text-[24px]">
              favorite
            </span>
            <h2 className="font-serif text-[22px] font-semibold text-[#1e1b19]">
              Saved Kitchen Favorites
            </h2>
            <span className="bg-[#f5ece9] text-[#57423b] text-xs font-bold px-2 py-0.5 rounded-full font-sans">
              {wishlistProducts.length}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close wishlist"
            className="w-8 h-8 rounded-full hover:bg-[#efe6e3] text-[#57423b] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <span className="material-symbols-outlined text-[#dec0b7] text-[48px] mb-2">
                favorite_border
              </span>
              <h3 className="font-serif text-[20px] text-[#1e1b19] font-medium mb-1">
                No items saved yet
              </h3>
              <p className="text-xs text-[#57423b] max-w-xs mb-4">
                Click the heart icon on any pantry jar to save it for your next batch drop.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#efe6e3] shadow-sm"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-[#f5ece9] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-[16px] text-[#1e1b19] font-medium leading-snug truncate">
                      {product.name}
                    </h4>
                    <span className="text-xs text-[#57423b] block mt-0.5 font-sans">
                      {product.weight} • <strong className="text-[#9f3c16]">₹{product.price}</strong>
                    </span>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          onAddToCart(product);
                          onRemoveFromWishlist(product.id);
                        }}
                        className="py-1 px-3 bg-[#9f3c16] hover:bg-[#bf542c] text-white text-[11px] font-semibold rounded-md transition-colors"
                      >
                        Move to Bag
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(product.id)}
                        className="text-xs text-[#ba1a1a] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#efe6e3] bg-[#fff8f5] text-center">
          <p className="text-[11px] text-[#57423b]">
            Items in wishlist are preserved for your local browser session.
          </p>
        </div>
      </div>
    </div>
  );
};
