import { useState } from "react";

const categories = [
  { label: "پیراهن", emoji: "👕" },
  { label: "شلوار", emoji: "👖" },
  { label: "مردانه", emoji: "🧔" },
  { label: "زنانه", emoji: "👩" },
  { label: "بچگانه", emoji: "🧒" },
  { label: "خانه و خواب", emoji: "🏠" },
  { label: "کیف", emoji: "👜" },
  { label: "کفش", emoji: "👟" },
  { label: "لباس گرم", emoji: "🧥" },
  { label: "ورزشی", emoji: "🏃" },
  { label: "سایر", emoji: "📦" },
];

export default function CategoryTabs({ onCategoryChange }) {
  const [active, setActive] = useState(categories[0].label);

  const handleClick = (cat) => {
    setActive(cat);
    onCategoryChange(cat);
  };

  return (
    <div className="w-full">
      {/* موبایل */}
      <div className="flex gap-2 px-2 py-2 overflow-x-auto scrollbar-hide lg:hidden">
        {categories.map(({ label, emoji }) => (
          <button
            key={label}
            onClick={() => handleClick(label)}
            className={`min-w-[115px] px-1 py-2 my-2 rounded-3xl text-sm font-bold transition-all duration-300 text-center
              ${
                active === label
                  ? "bg-gradient-to-r from-sky-100 to-sky-200 border border-gray-300 shadow-md shadow-indigo-300 text-gray-800 scale-105"
                  : "bg-white dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-300 border border-gray-200 shadow-lg text-gray-800 dark:text-gray-300"
              }`}
          >
            <span className="mr-1">{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      {/* دسکتاپ */}
      <div className="hidden lg:flex gap-2 px-1 py-3 justify-start w-full">
        {categories.map(({ label, emoji }) => (
          <button
            key={label}
            onClick={() => handleClick(label)}
            className={` flex-auto px-1 py-2 rounded-3xl text-sm font-bold transition-all duration-300 text-center
              ${
                active === label
                  ? "bg-gradient-to-r from-sky-100 to-sky-200 border border-gray-300 shadow-lg shadow-indigo-300 text-gray-800 scale-105"
                  : "bg-white dark:bg-gray-800 hover:bg-sky-100 dark:hover:bg-gray-700 border border-gray-200 shadow-lg text-gray-800 dark:text-gray-300"
              }`}
          >
            <span className="mr-1">{emoji}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
