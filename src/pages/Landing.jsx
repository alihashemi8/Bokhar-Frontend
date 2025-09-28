import { useState } from "react";
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
  "پیراهن": ShirtsPants,
  "شلوار": ShirtsPants,
  "مردانه": Men,
  "زنانه": Women,
  "بچگانه": Kids,
  "خانه و خواب": HomeAndBed,
  "کیف": Bags,
  "کفش": Shoes,
  "لباس گرم": WarmClothes,
  "ورزشی": Sports,
  "سایر": Others,
};

export default function Landing() {
  const [activeCategory, setActiveCategory] = useState("پیراهن"); // دسته پیش‌فرض

  // گرفتن کامپوننت فعلی
  const ActiveComponent = categoryComponents[activeCategory] || null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <section className="p-8 text-center">
        <h1 className="text-3xl font-bold md:mt-10">به سایت ما خوش آمدید ✨</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          اینجا می‌تونی سرویس خشکشویی آنلاین رو تست کنی 🚀
        </p>
      </section>

      {/* تب دسته‌بندی */}
      <CategoryTabs onCategoryChange={setActiveCategory} />

      {/* رندر کامپوننت دسته فعال */}
      <section dir="rtl" className="p-6">
        {ActiveComponent ? <ActiveComponent /> : <p>دسته‌ای انتخاب نشده</p>}
      </section>
    </div>
  );
}
