import React, { useState } from 'react';
import { Recipe, Product } from '../types';

interface RecipeModalProps {
  recipe: Recipe | null;
  product?: Product;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  product,
  onClose,
  onAddToCart,
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [productAdded, setProductAdded] = useState(false);

  if (!recipe) return null;

  const toggleIngredient = (idx: number) => {
    const next = new Set(checkedIngredients);
    if (next.has(idx)) {
      next.delete(idx);
    } else {
      next.add(idx);
    }
    setCheckedIngredients(next);
  };

  const handleAddFeaturedProduct = () => {
    if (product && onAddToCart) {
      onAddToCart(product);
      setProductAdded(true);
      setTimeout(() => setProductAdded(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-[#efe6e3] my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm text-[#57423b] hover:text-[#1e1b19] flex items-center justify-center shadow-md transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Hero Header with Recipe Image */}
        <div className="relative h-52 sm:h-72 w-full bg-[#f5ece9] overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.altText}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <span className="bg-[#516444] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {recipe.condimentTag}
            </span>
            <h2 className="font-serif text-[28px] sm:text-[34px] font-normal leading-tight mt-2 text-white">
              {recipe.title}
            </h2>
            <div className="flex items-center gap-4 text-xs text-white/90 mt-1">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>{recipe.prepTime}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">group</span>
                <span>{recipe.servings}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Recipe Body Content */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
          <p className="text-[14px] text-[#57423b] leading-relaxed mb-6 font-sans italic">
            "{recipe.description}"
          </p>

          {/* Featured Condiment Card */}
          {product && (
            <div className="mb-6 p-4 rounded-xl bg-[#fbf2ee] border border-[#efe6e3] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-14 h-14 rounded-lg object-cover border border-[#dec0b7]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-[#f6eee8] border border-[#ddcec7] shrink-0 flex items-center justify-center text-[#8e7b72]">
                    <span className="material-symbols-outlined text-[20px]">image</span>
                  </div>
                )}
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#9f3c16] tracking-wider block">
                    Essential Pantry Jar
                  </span>
                  <h4 className="font-serif text-[17px] text-[#1e1b19] font-medium leading-tight">
                    {product.name}
                  </h4>
                  <span className="text-xs text-[#57423b]">₹{product.price} • {product.weight}</span>
                </div>
              </div>

              <button
                onClick={handleAddFeaturedProduct}
                className={`py-2 px-4 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5 ${
                  productAdded
                    ? 'bg-[#516444] text-white'
                    : 'bg-[#9f3c16] hover:bg-[#bf542c] text-white'
                }`}
              >
                {productAdded ? (
                  <>
                    <span className="material-symbols-outlined text-[16px]">done</span>
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">
                      shopping_bag
                    </span>
                    <span>Add Jar to Bag</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Ingredients Checklist */}
            <div className="md:col-span-5">
              <h3 className="font-serif text-[20px] text-[#1e1b19] font-medium mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#9f3c16] text-[20px]">
                  check_box
                </span>
                <span>Ingredients</span>
              </h3>
              <p className="text-[11px] text-[#57423b] mb-3">
                Tap items to cross them off as you prep:
              </p>
              <ul className="space-y-2">
                {recipe.ingredients.map((item, idx) => {
                  const isChecked = checkedIngredients.has(idx);
                  return (
                    <li
                      key={idx}
                      onClick={() => toggleIngredient(idx)}
                      className={`text-[13px] p-2 rounded-lg cursor-pointer transition-colors flex items-start gap-2.5 ${
                        isChecked
                          ? 'bg-[#efe6e3]/50 text-[#8a726a] line-through'
                          : 'hover:bg-[#fbf2ee] text-[#1e1b19]'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] shrink-0 ${
                          isChecked ? 'text-[#516444]' : 'text-[#8a726a]'
                        }`}
                      >
                        {isChecked ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <span>{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="md:col-span-7">
              <h3 className="font-serif text-[20px] text-[#1e1b19] font-medium mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#516444] text-[20px]">
                  skillet
                </span>
                <span>Step-by-Step Method</span>
              </h3>
              <div className="space-y-4">
                {recipe.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#f5ece9] text-[#9f3c16] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 font-sans">
                      {idx + 1}
                    </span>
                    <p className="text-[13px] leading-relaxed text-[#57423b]">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chef's Tip Box */}
              <div className="mt-6 p-4 rounded-xl bg-[#516444]/10 border border-[#516444]/20 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#516444] text-[22px] shrink-0 mt-0.5">
                  tips_and_updates
                </span>
                <div>
                  <h5 className="text-xs font-bold text-[#516444] uppercase tracking-wider mb-1 font-sans">
                    Kitchen Note from Banswara
                  </h5>
                  <p className="text-[12px] leading-relaxed text-[#1e1b19]">
                    {recipe.chefTip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#fbf2ee] border-t border-[#efe6e3] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#efe6e3] hover:bg-[#dec0b7] text-[#1e1b19] text-xs font-semibold transition-colors"
          >
            Close Recipe
          </button>
        </div>
      </div>
    </div>
  );
};
