import { useState } from "react";
import { Search } from "lucide-react"; // آیکون سرچ
import CategoryTabs from "../components/CategoryTabs";

// کامپوننت‌های هر دسته
import ShirtsPants from "../components/categories/ShirtsPants";
import Men from "../components/categories/Men";
import Women from "../components/categories/Women";
import HomeAndBed from "../components/categories/HomeAndBed";
import Bags from "../components/categories/Bags";
import Shoes from "../components/categories/Shoes";
import WarmClothes from "../components/categories/WarmClothes";
import Sports from "../components/categories/Sports";
import Others from "../components/categories/Others";
import Kids from "../components/categories/Kids";

// اتصال نام دسته به کامپوننت
const categoryComponents = {
  پیراهن: ShirtsPants,
  شلوار: ShirtsPants,
  مردانه: Men,
  زنانه: Women,
  بچگانه: Kids,
  "خانه و خواب": HomeAndBed,
  کیف: Bags,
  کفش: Shoes,
  "لباس گرم": WarmClothes,
  ورزشی: Sports,
  سایر: Others,
};

export default function Landing() {
  const [activeCategory, setActiveCategory] = useState("پیراهن"); // دسته پیش‌فرض
  const [searchQuery, setSearchQuery] = useState(""); // state برای سرچ

  // گرفتن کامپوننت فعلی
  const ActiveComponent = categoryComponents[activeCategory] || null;

  // تابع هندل سرچ
  const handleSearch = () => {
    console.log("جستجو برای:", searchQuery);
    // اینجا بعدا می‌تونی لاجیک فیلتر کردن دیتا رو بذاری
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <section className="p-8 text-center">
        <h1 className="text-3xl font-bold md:mt-10">به سایت ما خوش آمدید ✨</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          اینجا می‌تونی سرویس خشکشویی آنلاین رو تست کنی 🚀
        </p>
      </section>

      {/* سرچ باکس گرد با دکمه */}
      <div className="px-4 mt-4 flex justify-center">
        <div className="flex w-full md:w-2/3 lg:w-1/2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
          <input
            type="text"
            placeholder="چی می‌خوای پیدا کنی؟"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-sm md:text-base"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* تب دسته‌بندی */}
      <div className="mt-4 px-4 overflow-x-auto">
        <CategoryTabs onCategoryChange={setActiveCategory} />
      </div>

      {/* رندر کامپوننت دسته فعال */}
      <section dir="rtl" className="p-6">
        {ActiveComponent ? (
          <ActiveComponent searchQuery={searchQuery} />
        ) : (
          <p>دسته‌ای انتخاب نشده</p>
        )}
      </section>
    </div>
  );
}
