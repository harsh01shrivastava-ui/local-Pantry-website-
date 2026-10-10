import React from 'react';
import { Recipe } from '../types';

interface RecipeSectionProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onExploreAllRecipes?: () => void;
}

export const RecipeSection: React.FC<RecipeSectionProps> = ({
  recipes,
  onSelectRecipe,
  onExploreAllRecipes,
}) => {
  return (
    <section className="w-full bg-[#fff8f5] py-16 border-b border-[#f5ece9]" id="recipes-grid">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-[12px] text-[#9f3c16] tracking-widest uppercase font-semibold block font-sans">
              Kitchen Table Journal
            </span>
            <h2 className="font-serif text-[32px] sm:text-[40px] text-[#1e1b19] mt-1 font-normal tracking-tight">
              From Our Kitchen to Yours
            </h2>
            <p className="text-[15px] text-[#57423b] max-w-lg mt-2 font-sans leading-relaxed">
              Simple 10-minute serving ideas that unlock the full sensory potential of every pantry jar.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onExploreAllRecipes}
              className="inline-flex items-center gap-1.5 text-[#1e1b19] hover:text-[#9f3c16] text-[13px] font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              <span>Follow @thelocalpantry_</span>
            </button>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => onSelectRecipe(recipe)}
              className="group bg-[#fbf2ee] rounded-xl overflow-hidden flex flex-col justify-between shadow-[0_2px_8px_rgba(42,38,36,0.04)] border border-[#efe6e3] hover:shadow-md transition-all cursor-pointer"
            >
              <div>
                {/* Image & Time Tag */}
                <div className="relative aspect-square overflow-hidden bg-[#f5ece9]">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={recipe.altText}
                    src={recipe.imageUrl}
                    loading="lazy"
                  />
                  <div className="absolute bottom-2.5 left-2.5 bg-[#fff8f5]/95 text-[#1e1b19] text-[11px] font-semibold px-2.5 py-1 rounded backdrop-blur-sm border border-white/60 font-sans shadow-sm">
                    {recipe.prepTime}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#516444] block mb-1 font-sans">
                    {recipe.condimentTag}
                  </span>
                  <h3 className="font-serif text-[19px] sm:text-[20px] font-medium text-[#1e1b19] mb-2 group-hover:text-[#9f3c16] transition-colors leading-snug">
                    {recipe.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-[#57423b] line-clamp-2">
                    {recipe.description}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="px-4 sm:px-5 pb-5">
                <span className="inline-flex items-center text-[#9f3c16] font-semibold text-[13px] group-hover:underline gap-1">
                  <span>View Recipe</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
