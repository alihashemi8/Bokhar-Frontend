import { useState, useEffect } from "react";
import api from "../api/clientApi";

export default function CategoryTabs({ categories, active, onCategoryChange, fullyDiscountedCategories = [] }) {
  const isCategoryFullyDiscounted = (catId) => {
    return fullyDiscountedCategories.includes(catId);
  };

  return (
    <div className="w-full">
      {/* موبایل */}
      <div className="flex gap-2 px-2 py-2 overflow-x-auto scrollbar-hide lg:hidden">
        {categories.map((cat) => {
          const isDiscounted = isCategoryFullyDiscounted(cat.id);
          const isActive = active?.id === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat)}
              className={`relative flex-shrink-0 whitespace-nowrap px-4 py-2 my-2 rounded-3xl text-sm font-bold transition-all
                ${isActive 
                  ? "bg-sky-200 scale-105" 
                  : isDiscounted 
                    ? "bg-green-100 text-green-800 border border-green-200 animate-[pulse_2s_ease-in-out_infinite] shadow-sm hover:shadow-md" 
                    : "bg-white"
                }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* دسکتاپ */}
      <div className="hidden lg:flex gap-3 px-1 py-3 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => {
          const isDiscounted = isCategoryFullyDiscounted(cat.id);
          const isActive = active?.id === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat)}
              className={`relative flex-shrink-0 whitespace-nowrap px-6 py-2 rounded-3xl text-sm font-bold transition-all
                ${isActive 
                  ? "bg-sky-200 scale-105" 
                  : isDiscounted 
                    ? "bg-green-100 text-green-800 border border-green-200 animate-[pulse_2s_ease-in-out_infinite] shadow-sm hover:shadow-md" 
                    : "bg-white"
                }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
