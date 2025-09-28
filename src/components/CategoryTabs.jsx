import { useState } from "react";

const categories = [
  "پیراهن",
  "شلوار",
  "مردانه",
  "زنانه",
  "بچگانه",
  "خانه و خواب",
  "کیف",
  "کفش",
  "لباس گرم",
  "ورزشی",
  "سایر", // آخرش
];

export default function CategoryTabs({ onCategoryChange }) {
  const [active, setActive] = useState(categories[0]); // اولین دسته فعال پیش‌فرض

  const handleClick = (cat) => {
    setActive(cat);
    onCategoryChange(cat);
  };

  return (
    <div className="w-full">
      {/* موبایل و تبلت - افقی و اسکرول‌پذیر */}
      <div className="flex gap-3 px-4 py-2 overflow-x-auto scrollbar-hide lg:hidden">
        {categories.map((label) => (
          <button
            key={label}
            onClick={() => handleClick(label)}
            className={`flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 
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
      <div className="hidden lg:flex gap-4 px-6 py-3 justify-start w-full">
        {categories.map((label) => (
          <button
            key={label}
            onClick={() => handleClick(label)}
            className={`flex-1 text-center px-3 py-2 rounded-3xl font-semibold transition-all duration-300
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

