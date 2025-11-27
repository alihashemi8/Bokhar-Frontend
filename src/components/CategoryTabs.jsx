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
  {/* موبایل */}
  <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide lg:hidden">
    {categories.map((label) => (
      <button
        key={label}
        onClick={() => handleClick(label)}
        className={`min-w-[120px] px-5 py-3 my-1 rounded-3xl text-sm font-bold transition-all duration-300 text-center
          ${
            active === label
              ? "bg-sky-800 border border-sky-800 shadow-md shadow-sky-800 text-white scale-105"
              : "bg-sky-300/80 dark:bg-gray-800 hover:bg-sky-500 dark:hover:bg-gray-700 border border-sky-400/80 shadow-xl shadow-sky-200 text-gray-100 dark:text-gray-300"
          }`}
      >
        {label}
      </button>
    ))}
  </div>

  {/* دسکتاپ → با همان رنگ، همان بوردر، همان شدو */}
  <div className="hidden lg:flex gap-4 px-6 py-3 justify-start w-full">
    {categories.map((label) => (
      <button
        key={label}
        onClick={() => handleClick(label)}
        className={`flex-1 px-5 py-3 rounded-3xl text-sm font-bold transition-all duration-300 text-center
          ${
            active === label
              ? "bg-sky-800 border border-sky-800 shadow-md shadow-sky-800 text-white scale-105"
              : "bg-sky-300/80 dark:bg-gray-800 hover:bg-sky-500 dark:hover:bg-gray-700 border border-sky-400/80 shadow-xl shadow-sky-200 text-gray-100 dark:text-gray-300"
          }`}
      >
        {label}
      </button>
    ))}
  </div>
</div>


  );
}

