import { useState } from "react";
import Card from "../components/Card";
import CategoryTabs from "../components/CategoryTabs";

// کارت‌ها با پارامترهای مشترک و خاص
const cards = [
  {
    id: 1,
    image: "/images/curtain.png",
    title: "پرده",
    basePrice: 20000,
    category: "خانه و خواب",
    options: [
      { key: "iron", label: "اتو", price: 5000, type: "checkbox" },
      { key: "stain", label: "لکه‌گیری", price: 10000, type: "checkbox" },
      {
        key: "length",
        label: "متراژ",
        type: "select",
        choices: [
          { value: "1m", label: "1 متر", price: 10000 },
          { value: "2m", label: "2 متر", price: 15000 },
          { value: "3m", label: "3 متر", price: 30000 },
        ],
      },
    ],
  },
  {
    id: 2,
    image: "/images/pants.png",
    title: "شلوار",
    basePrice: 30000,
    category: "پیراهن و شلوار",
    options: [
      { key: "iron", label: "اتو", price: 5000, type: "checkbox" },
      {
        key: "size",
        label: "سایز",
        type: "select",
        choices: [
          { value: "S", label: "S", price: 0 },
          { value: "M", label: "M", price: 5000 },
          { value: "L", label: "L", price: 10000 },
        ],
      },
      {
        key: "material",
        label: "جنس",
        type: "select",
        choices: [
          { value: "cotton", label: "کتان", price: 0 },
          { value: "wool", label: "پشمی", price: 8000 },
        ],
      },
    ],
  },
];

export default function Landing() {
  const [activeCategory, setActiveCategory] = useState("همه");

  // فیلتر کارت‌ها بر اساس دسته‌بندی
  const filteredCards =
    activeCategory === "همه"
      ? cards
      : cards.filter((card) => card.category === activeCategory);

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

      {/* کارت‌ها */}
      <section
        dir="rtl"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-24 p-6"
      >
        {filteredCards.map((card) => (
          <Card key={card.id} {...card} />
        ))}
      </section>
    </div>
  );
}
