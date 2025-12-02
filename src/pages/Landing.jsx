import { useState, useMemo, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import CategoryTabs from "../components/CategoryTabs";
import Card from "../components/Card";

// کامپوننت‌ها و داده‌ها
import ShirtsPants, { shirtsPantsData } from "../components/categories/ShirtsPants";
import Men, { menData } from "../components/categories/Men";
import Women, { womenData } from "../components/categories/Women";
import HomeAndBed, { homeAndBedData } from "../components/categories/HomeAndBed";
import Bags, { bagsData } from "../components/categories/Bags";
import Shoes, { shoesData } from "../components/categories/Shoes";
import WarmClothes, { warmClothesData } from "../components/categories/WarmClothes";
import Sports, { sportsData } from "../components/categories/Sports";
import Others, { othersData } from "../components/categories/Others";
import Kids, { kidsData } from "../components/categories/Kids";

// اتصال دسته به کامپوننت و داده
const categoryComponents = {
  پیراهن: { component: ShirtsPants, data: shirtsPantsData },
  شلوار: { component: ShirtsPants, data: shirtsPantsData },
  مردانه: { component: Men, data: menData },
  زنانه: { component: Women, data: womenData },
  بچگانه: { component: Kids, data: kidsData },
  "خانه و خواب": { component: HomeAndBed, data: homeAndBedData },
  کیف: { component: Bags, data: bagsData },
  کفش: { component: Shoes, data: shoesData },
  "لباس گرم": { component: WarmClothes, data: warmClothesData },
  ورزشی: { component: Sports, data: sportsData },
  سایر: { component: Others, data: othersData },
};

export default function Landing() {
  const [activeCategory, setActiveCategory] = useState("پیراهن");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const { data: activeData } = categoryComponents[activeCategory];

  // ✅ جمع کردن همه داده‌ها برای سرچ
  const allItems = useMemo(() => {
    return [
      ...shirtsPantsData.map(c => ({ ...c, category: "پیراهن" })),
      ...menData.map(c => ({ ...c, category: "مردانه" })),
      ...womenData.map(c => ({ ...c, category: "زنانه" })),
      ...homeAndBedData.map(c => ({ ...c, category: "خانه و خواب" })),
      ...bagsData.map(c => ({ ...c, category: "کیف" })),
      ...shoesData.map(c => ({ ...c, category: "کفش" })),
      ...warmClothesData.map(c => ({ ...c, category: "لباس گرم" })),
      ...sportsData.map(c => ({ ...c, category: "ورزشی" })),
      ...othersData.map(c => ({ ...c, category: "سایر" })),
      ...kidsData.map(c => ({ ...c, category: "بچگانه" })),
    ];
  }, []);

  // ✅ فیلتر ساده و دقیق فارسی (تضمینی)
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const normalize = (text) =>
      text
        .toLowerCase()
        .replace(/[اآ]/g, "ا")
        .replace(/[يی]/g, "ی")
        .replace(/\s+/g, " ")
        .trim();

    const query = normalize(searchQuery);

    return allItems.filter((item) => {
      if (!item.title) return false;
      const title = normalize(item.title);
      return title.includes(query);
    });
  }, [searchQuery, allItems]);

  // ✅ انتخاب آیتم از ساجست‌ها
  const handleSelectSuggestion = (card) => {
    setSearchQuery(card.title);
    setSelectedCard(card);
    setActiveCategory(card.category);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (filteredItems.length === 1) {
      handleSelectSuggestion(filteredItems[0]);
    }
    setShowSuggestions(false);
  };

  // بستن ساجست‌ها با کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSelectedCard(null);
    }
  }, [searchQuery]);

  return (
    <div dir="rtl" className="min-h-screen  text-gray-900 dark:text-gray-100">
      {/* هدر */}
      <section className="p-8 text-center">
        <h1 className="text-3xl font-bold md:mt-10">خشکشویی</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          خدمات خشکشویی ، سفیدشویی ، اتو و تعمیر رنگ
        </p>
      </section>

{/* سرچ */}
<div className="px-4 mt-4 flex justify-center relative">
  <div
    ref={searchRef}
    className="relative flex w-full md:w-2/3 lg:w-1/2 flex-col"
  >
    <div className="flex rounded-full text-black font-semibold border-1 border-sky-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800 shadow-md overflow-hidden">
      <input
        type="text"
        placeholder="چی می‌خوای پیدا کنی؟"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => {
          if (searchQuery.trim()) setShowSuggestions(true);
        }}
        className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-sm md:text-base"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-sky-300/90 hover:bg-sky-600/60 text-white flex items-center justify-center transition"
        
      >
        <Search size={18} />
      </button>
    </div>

{/* ✅ لیست پیشنهاد ساده زیر اینپوت */}
{showSuggestions && searchQuery.trim() && (
  <ul className="absolute top-full left-0 mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md z-50">
    {filteredItems.length > 0 ? (
      filteredItems.slice(0, 6).map((s) => (
        <li
          key={`${s.category}-${s.id}`}
          onClick={() => handleSelectSuggestion(s)}
          className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          {s.title}
        </li>
      ))
    ) : (
      <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 cursor-default">
        گزینه‌ای یافت نشد
      </li>
    )}
  </ul>
)}
  </div>
</div>


      {/* تب دسته‌بندی */}
      <div className="mt-4 px-4 overflow-x-auto">
        <CategoryTabs
          onCategoryChange={(cat) => {
            setActiveCategory(cat);
            setSelectedCard(null);
            setSearchQuery("");
          }}
        />
      </div>

      {/* نمایش کارت انتخاب شده یا همه کارت‌های دسته */}
      <section dir="rtl" className="p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-6">
          {selectedCard ? (
            <Card key={`${selectedCard.category}-${selectedCard.id}`} {...selectedCard} />
          ) : (
            activeData.map((card) => (
              <Card key={`${card.category}-${card.id}`} {...card} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
