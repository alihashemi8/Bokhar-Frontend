import { useEffect, useState } from "react";
import api from "../../../../api/clientApi"; // ← این همانی است که products و categories دارد
import DiscountModal from "../modals/DiscountModal";

export default function ServiceDiscountTab() {

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, query]);

  const loadCategories = async () => {
    const data = await api.getCategories();
    setCategories(data);
  };

  const loadProducts = async () => {
    let data;

    if (query.trim()) {
      data = await api.searchProducts(query);
    } else {
      data = await api.getProducts();
    }

    // فیلتر بر اساس دسته‌بندی
    if (selectedCategory !== "all") {
      data = data.filter((p) => p.category === selectedCategory);
    }

    setProducts(data);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="space-y-8">

      {/* دسته‌بندی‌ها */}
      <div className="p-6 rounded-3xl bg-white/30 dark:bg-white/10 backdrop-blur-xl border shadow-xl">
        <h3 className="font-bold text-lg mb-5">تخفیف روی دسته‌بندی‌ها</h3>

        <div className="flex overflow-x-auto gap-3 pb-3">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2 rounded-full border transition whitespace-nowrap
              ${selectedCategory === "all"
                ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800"
                : "bg-white/50 dark:bg-white/20"}`}
          >
            همه
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)} // ← محصول category = id
              className={`px-5 py-2 rounded-full border transition whitespace-nowrap
                ${selectedCategory === c.id
                  ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800"
                  : "bg-white/50 dark:bg-white/20"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* محصولات */}
      <div className="p-6 rounded-3xl bg-white/30 dark:bg-white/10 backdrop-blur-xl border shadow-xl">
        <h3 className="font-bold text-lg mb-5">تخفیف روی محصولات</h3>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو بر اساس عنوان محصول..."
          className="w-full mb-6 p-3 rounded-2xl bg-white/50 dark:bg-white/20 border"
        />

        {products.length === 0 ? (
          <p className="text-center text-gray-500">محصولی یافت نشد.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-3xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border shadow-lg hover:scale-[1.03] transition"
              >
                <div className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <h3 className="mt-3 font-semibold text-center truncate">
                  {p.title}
                </h3>

                <button
                  onClick={() => openModal(p)}
                  className="mt-4 w-full py-2 rounded-xl bg-purple-700 text-white hover:scale-105 transition"
                >
                  تنظیم تخفیف
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <DiscountModal
          product={selectedProduct}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
