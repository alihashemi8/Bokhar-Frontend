import { useState, useMemo, useEffect } from "react";
import CategoryTabs from "../components/CategoryTabs";
import Card from "../components/Card";
import Search from "../components/Search";

// کامپوننت‌ها و داده‌ها
import ShirtsPants, {
  shirtsPantsData,
} from "../components/categories/ShirtsPants";
import Men, { menData } from "../components/categories/Men";
import Women, { womenData } from "../components/categories/Women";
import HomeAndBed, {
  homeAndBedData,
} from "../components/categories/HomeAndBed";
import Bags, { bagsData } from "../components/categories/Bags";
import Shoes, { shoesData } from "../components/categories/Shoes";
import WarmClothes, {
  warmClothesData,
} from "../components/categories/WarmClothes";
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

  const { data: activeData } = categoryComponents[activeCategory];

  // جمع کردن همه داده‌ها برای سرچ
  const allItems = useMemo(() => {
    return [
      ...shirtsPantsData.map((c) => ({ ...c, category: "پیراهن" })),
      ...menData.map((c) => ({ ...c, category: "مردانه" })),
      ...womenData.map((c) => ({ ...c, category: "زنانه" })),
      ...homeAndBedData.map((c) => ({ ...c, category: "خانه و خواب" })),
      ...bagsData.map((c) => ({ ...c, category: "کیف" })),
      ...shoesData.map((c) => ({ ...c, category: "کفش" })),
      ...warmClothesData.map((c) => ({ ...c, category: "لباس گرم" })),
      ...sportsData.map((c) => ({ ...c, category: "ورزشی" })),
      ...othersData.map((c) => ({ ...c, category: "سایر" })),
      ...kidsData.map((c) => ({ ...c, category: "بچگانه" })),
    ];
  }, []);

  // فیلتر فارسی
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
      return normalize(item.title).includes(query);
    });
  }, [searchQuery, allItems]);

  const handleSelectSuggestion = (card) => {
    setSearchQuery(card.title);
    setSelectedCard(card);
    setActiveCategory(card.category);
  };

  // اگر سرچ خالی شد، کارت انتخاب‌شده ریست شود
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSelectedCard(null);
    }
  }, [searchQuery]);

  return (
    <div
      dir="rtl"
      className="min-h-dvh w-full text-gray-900 dark:text-gray-100"
    >
      {/* هدر */}
      <section className="p-8 text-center">
        <h1 className="text-3xl font-bold md:mt-10">خشکشویی</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          خدمات خشکشویی، سفیدشویی، اتو و تعمیر رنگ
        </p>
      </section>

      {/* سرچ */}
      <div className="px-4 mt-4 flex justify-center ">
        <div className="w-full md:w-2/3 lg:w-1/2 ">
          <span className="flex mr-2 my-1 dark:text-gray-100">چی میخوای پیدا کنی؟</span>

          <Search
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              if (!val.trim()) setSelectedCard(null);
            }}
            items={searchQuery.trim() ? filteredItems.slice(0, 6) : []}
            onSelect={handleSelectSuggestion}
            placeholder="پتو، مانتو، شلوار ..."
            renderItem={(item) => (
              <div className="flex justify-between text-sm ">
                <span>{item.title}</span>
                <span className="text-xs text-gray-400 dark:text-gray-100">{item.category}</span>
              </div>
            )}
          />
        </div>
      </div>

      {/* تب‌ها */}
      <div className="mt-4 px-4 py-3 overflow-x-auto">
        <CategoryTabs
          onCategoryChange={(cat) => {
            setActiveCategory(cat);
            setSelectedCard(null);
            setSearchQuery("");
          }}
        />
      </div>

      {/* کارت‌ها */}
      <section className="p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 mb-16">
          {selectedCard ? (
            <Card {...selectedCard} />
          ) : (
            activeData.map((card) => (
              <Card key={`${activeCategory}-${card.id}`} {...card} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
