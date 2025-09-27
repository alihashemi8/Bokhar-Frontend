import { useState } from "react";

const categories = [
  "پیراهن و شلوار",
  "لباس مردانه",
  "لباس زنانه",
  "لباس بچگانه",
  "عروسک",
  "خانه و خواب",
  "کیف و کفش",
  "کفش",
  "لباس گرم",
  "لباس ورزشی",
];

export default function CategoryTabs({ onCategoryChange }) {
  const [active, setActive] = useState("همه");

  const handleClick = (cat) => {
    setActive(cat);
    onCategoryChange(cat);
  };

  return (
    <div className="w-full">
      {/* موبایل و تبلت - افقی و اسکرول‌پذیر */}
      <div className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-hide lg:hidden">
        <button
          onClick={() => handleClick("همه")}
          className={`flex items-center justify-center px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-300 
            ${active === "همه"
              ? "bg-purple-600 text-white shadow-lg scale-105"
              : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
        >
          همه
        </button>

        {categories.map((label) => (
          <button
            key={label}
            onClick={() => handleClick(label)}
            className={`flex items-center justify-center px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-300 
              ${active === label
                ? "bg-purple-600 text-white shadow-lg scale-105"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* لپ‌تاپ و دسکتاپ - همه تب‌ها کنار هم */}
      <div className="hidden lg:flex gap-4 px-8 py-4 justify-center">
        <button
          onClick={() => handleClick("همه")}
          className={`px-6 py-3 rounded-3xl font-semibold transition-all duration-300
            ${active === "همه"
              ? "bg-purple-600 text-white shadow-lg scale-105"
              : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
        >
          همه
        </button>

        {categories.map((label) => (
          <button
            key={label}
            onClick={() => handleClick(label)}
            className={`px-6 py-3 rounded-3xl font-semibold transition-all duration-300
              ${active === label
                ? "bg-purple-600 text-white shadow-lg scale-105"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
