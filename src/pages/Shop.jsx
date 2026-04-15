import { useState, useEffect, useMemo } from "react";
import CategoryTabs from "../components/CategoryTabs";
import Card from "../components/Card";
import Search from "../components/Search";
import api from "../api/clientApi";

export default function Landing() {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);

  // دریافت دسته‌ها
  useEffect(() => {
    async function loadCategories() {
      const data = await api.getCategories();
      setCategories(data);
      if (data.length > 0) setActiveCategory(data[0]);
    }
    loadCategories();
  }, []);

  // دریافت محصولات
  useEffect(() => {
    async function loadProducts() {
      const data = await api.getProducts();
      setAllProducts(data);
    }
    loadProducts();
  }, []);

  // محصولات دسته فعال
  const filteredByCategory = useMemo(() => {
    if (!activeCategory) return [];
    return allProducts.filter((p) => p.category.id === activeCategory.id);
  }, [activeCategory, allProducts]);

  // سرچ محصولات
  const filteredBySearch = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const normalize = (text) =>
      text
        .toLowerCase()
        .replace(/[اآ]/g, "ا")
        .replace(/[يی]/g, "ی")
        .trim();

    const q = normalize(searchQuery);

    return allProducts.filter((item) =>
      normalize(item.title).includes(q)
    );
  }, [searchQuery, allProducts]);

  const handleSelectSuggestion = (product) => {
    setSearchQuery(product.title);
    setSelectedCard(product);
    setActiveCategory(product.category);
  };

  return (
    <div dir="rtl" className="min-h-dvh w-full text-gray-900 md:pt-15.5">
      {/* هدر */}
      <section className="p-8 text-center">
        <h1 className="text-3xl font-bold">خشکشویی</h1>
        <p className="mt-4 text-lg text-gray-600">
          خدمات خشکشویی، شستشو، اتو و لکه‌بری
        </p>
      </section>

      {/* سرچ */}
      <div className="px-4 mt-4 flex justify-center">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <span className="flex mr-2 my-1">چی میخوای پیدا کنی؟</span>

          <Search
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              if (!val.trim()) setSelectedCard(null);
            }}
            items={searchQuery.trim() ? filteredBySearch.slice(0, 6) : []}
            onSelect={handleSelectSuggestion}
            placeholder="پتو، کت، مانتو ..."
            renderItem={(item) => (
              <div className="flex justify-between text-sm">
                <span>{item.title}</span>
                <span className="text-xs text-gray-400">
                  {item.category.name}
                </span>
              </div>
            )}
          />
        </div>
      </div>

      {/* تب دسته‌ها */}
      <div className="mt-4 px-4 py-3 overflow-x-auto">
        <CategoryTabs
          categories={categories}
          active={activeCategory}
          onCategoryChange={(c) => {
            setActiveCategory(c);
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
            filteredByCategory.map((p) => (
              <Card key={p.id} {...p} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
