import React, { useState } from 'react';
import { Product, Recipe } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  recipes: Recipe[];
  onSelectProduct: (product: Product) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  recipes,
  onSelectProduct,
  onSelectRecipe,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingProducts = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(q))
      )
    : [];

  const matchingRecipes = q
    ? recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.ingredients.some((ing) => ing.toLowerCase().includes(q))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 pt-16 animate-fadeIn">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-[#efe6e3]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#efe6e3] flex items-center gap-3 bg-[#fff8f5]">
          <span className="material-symbols-outlined text-[#9f3c16] text-[24px]">
            search
          </span>
          <input
            type="text"
            autoFocus
            placeholder="Search garlic chili crisp, basil pesto, gunpowder podi, recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-[#1e1b19] placeholder:text-[#8a726a] outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#8a726a] hover:text-[#1e1b19] text-xs p-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="w-8 h-8 rounded-full hover:bg-[#efe6e3] text-[#57423b] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Search Results / Suggestions */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {!q ? (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#57423b] block mb-2 font-sans">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Chilli Oil', 'Basil Pesto', 'Gunpowder Podi', 'Pizza Sauce', 'Sourdough Toast', 'Desi Ghee'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1 bg-[#f5ece9] hover:bg-[#efe6e3] text-[#1e1b19] text-xs rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-[#fbf2ee] rounded-xl border border-[#efe6e3] text-xs text-[#57423b]">
                <strong className="text-[#1e1b19] block mb-1">Search by Ingredients:</strong>
                Looking for recipes that use cold-pressed mustard oil, Kashmiri chillies, or Genovese basil? Type any ingredient to find matched condiments and dishes.
              </div>
            </div>
          ) : matchingProducts.length === 0 && matchingRecipes.length === 0 ? (
            <div className="py-8 text-center text-[#57423b]">
              <span className="material-symbols-outlined text-[36px] text-[#dec0b7] mb-2">
                search_off
              </span>
              <p className="font-serif text-[18px] text-[#1e1b19] font-medium">
                No results found for "{query}"
              </p>
              <p className="text-xs mt-1">Try searching for chili, garlic, basil, or idli.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Matched Products */}
              {matchingProducts.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9f3c16] mb-3 font-sans">
                    Pantry Provisions ({matchingProducts.length})
                  </h4>
                  <div className="space-y-2">
                    {matchingProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#fbf2ee] cursor-pointer transition-colors border border-transparent hover:border-[#efe6e3]"
                      >
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover bg-[#f5ece9]"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-[#f6eee8] border border-[#ddcec7] shrink-0 flex items-center justify-center text-[#8e7b72]">
                            <span className="material-symbols-outlined text-[18px]">image</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h5 className="font-serif text-[16px] text-[#1e1b19] font-medium leading-tight">
                            {p.name}
                          </h5>
                          <span className="text-xs text-[#57423b] line-clamp-1">{p.subtitle}</span>
                        </div>
                        <span className="font-serif text-[16px] font-semibold text-[#9f3c16] tabular-nums">
                          ₹{p.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Recipes */}
              {matchingRecipes.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#516444] mb-3 font-sans">
                    Kitchen Recipes ({matchingRecipes.length})
                  </h4>
                  <div className="space-y-2">
                    {matchingRecipes.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => {
                          onSelectRecipe(r);
                          onClose();
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#fbf2ee] cursor-pointer transition-colors border border-transparent hover:border-[#efe6e3]"
                      >
                        <img
                          src={r.imageUrl}
                          alt={r.title}
                          className="w-12 h-12 rounded-lg object-cover bg-[#f5ece9]"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-serif text-[16px] text-[#1e1b19] font-medium leading-tight">
                            {r.title}
                          </h5>
                          <span className="text-xs text-[#57423b] line-clamp-1">{r.condimentTag} • {r.prepTime}</span>
                        </div>
                        <span className="material-symbols-outlined text-[#8a726a] text-[18px]">
                          arrow_forward
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
