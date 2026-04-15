import { useState, useEffect } from "react";
import api from "../api/clientApi";

export default function CategoryTabs({ categories, active, onCategoryChange }) {
  return (
    <div className="w-full">
      {/* موبایل */}
      <div className="flex gap-2 px-2 py-2 overflow-x-auto lg:hidden">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat)}
            className={`min-w-[115px] px-1 py-2 my-2 rounded-3xl text-sm font-bold transition-all
               ${active?.id === cat.id ? "bg-sky-200 scale-105" : "bg-white"}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* دسکتاپ */}
      <div className="hidden lg:flex gap-2 px-1 py-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat)}
            className={`flex-auto px-1 py-2 rounded-3xl text-sm font-bold transition-all
               ${active?.id === cat.id ? "bg-sky-200 scale-105" : "bg-white"}`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
