import { useState, useEffect } from "react";
import api from "../api/clientApi";
import HorizontalScroller from "./HorizontalScroller"; // مسیر را تنظیم کنید

export default function CategoryTabs({ categories, active, onCategoryChange, fullyDiscountedCategories = [] }) {
  const isCategoryFullyDiscounted = (catId) => {
    return fullyDiscountedCategories.includes(catId);
  };

  return (
    <div className="w-full">
      {/* موبایل */}
      <HorizontalScroller 
        className="px-2 py-2 scrollbar-hide lg:hidden" 
        innerClassName="gap-2"
      >
        {categories.map((cat) => {
          const isDiscounted = isCategoryFullyDiscounted(cat.id);
          const isActive = active?.id === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat)}
              className={`relative flex-shrink-0 whitespace-nowrap px-4 py-2 my-2 mx-0.5 rounded-3xl text-sm font-bold transition-all
                ${isActive 
                  ? "bg-sky-200 scale-105 mx-1" 
                  : isDiscounted 
                    ? "bg-green-100 text-green-800 border border-green-200  animate-[pulse_2s_ease-in-out_infinite] shadow-sm hover:shadow-md" 
                    : "bg-white"
                }`}
            >
              {cat.name}
            </button>
          );
        })}
      </HorizontalScroller>

      {/* دسکتاپ */}
      <HorizontalScroller 
        className="hidden lg:flex px-1 py-3 scrollbar-hide" 
        innerClassName="gap-3"
      >
        {categories.map((cat) => {
          const isDiscounted = isCategoryFullyDiscounted(cat.id);
          const isActive = active?.id === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat)}
              className={`relative flex-shrink-0 whitespace-nowrap px-6 py-2 mx-1 rounded-3xl text-sm font-bold transition-all
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
      </HorizontalScroller>
    </div>
  );
}
