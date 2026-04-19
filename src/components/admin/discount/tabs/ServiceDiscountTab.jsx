import { useEffect, useMemo, useState } from "react";
import api from "../../../../api/clientApi";
import DiscountModal from "../modals/DiscountModal";

export default function ServiceDiscountTab() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [query, setQuery] = useState("");

  const [products, setProducts] = useState([]);

  const [categoryModal, setCategoryModal] = useState(null);
  const [productModal, setProductModal] = useState(null);

  // ---------------------------
  // Load Categories
  // ---------------------------
  useEffect(() => {
    (async () => {
      const data = await api.getCategories();
      setCategories(data);
    })();
  }, []);

  // ---------------------------
  // Load Products (Search + All)
  // ---------------------------
  useEffect(() => {
    (async () => {
      const data = query.trim()
        ? await api.searchProducts(query)
        : await api.getProducts();

      setProducts(data);
    })();
  }, [query]);

  // ---------------------------
  // Memoized Filtering
  // ---------------------------
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;

    return products.filter((p) => p.category?.id === selectedCategory);
  }, [products, selectedCategory]);

  // ---------------------------
  // Handlers
  // ---------------------------
  const openProductModal = async (product) => {
    const fullData = await api.getProduct(product.id);
    setProductModal(fullData);
  };
  const closeProductModal = () => setProductModal(null);

  const openCategoryModal = (c) => setCategoryModal(c);
  const closeCategoryModal = () => setCategoryModal(null);

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8 px-3 md:px-4 overflow-x-hidden">
      {/* دسته‌ها */}
      <div
        className="
        w-full p-4 md:p-5 rounded-2xl
        bg-white/70 dark:bg-neutral-800/60 backdrop-blur-md
        border border-sky-200 dark:border-indigo-600 shadow-lg
      "
      >
        <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">
          تخفیف روی دسته‌بندی‌ها
        </h3>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => openCategoryModal(c)}
              className="
                px-3 py-2 rounded-xl transition text-sm
                bg-white dark:bg-neutral-700 
                text-gray-700 dark:text-gray-200
                border border-sky-200 dark:border-gray-600
                hover:bg-sky-100 dark:hover:bg-purple-700 hover:text-gray-900
              "
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* محصولات */}
      <div
        className="
        w-full p-4 md:p-5 rounded-2xl
        bg-white/70 dark:bg-neutral-800/60 backdrop-blur-md
        border border-sky-200 dark:border-indigo-600 shadow-lg
      "
      >
        <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">
          تخفیف روی محصولات
        </h3>

        {/* سرچ */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو بر اساس عنوان محصول..."
          className="
            w-full mb-6 p-2.5 rounded-xl
            border border-sky-200 dark:border-indigo-600
            bg-white dark:bg-neutral-800
            shadow-sm text-gray-800 dark:text-gray-100 text-sm
          "
        />

        {/* دسته‌بندی محصولات */}
        <div className="w-full overflow-x-auto pb-2 mb-4 no-scrollbar">
          <div className="flex gap-2 w-max">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`
                px-3 py-2 rounded-xl text-sm whitespace-nowrap
                ${
                  selectedCategory === "all"
                    ? "bg-sky-100 dark:bg-purple-700 border border-sky-400 dark:border-indigo-500 text-gray-900 dark:text-white"
                    : "bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-200 border border-sky-200 dark:border-gray-600"
                }
              `}
            >
              همه
            </button>

            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`
                  px-3 py-2 rounded-xl text-sm whitespace-nowrap
                  ${
                    selectedCategory === c.id
                      ? "bg-sky-100 dark:bg-purple-700 border border-sky-400 dark:border-indigo-500 text-gray-900 dark:text-white"
                      : "bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-200 border border-sky-200 dark:border-gray-600"
                  }
                `}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* محصولات */}
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
            محصولی یافت نشد.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="
                  p-3 rounded-xl bg-white/90 dark:bg-neutral-800/80
                  backdrop-blur border border-sky-200 dark:border-indigo-600
                  shadow-md flex flex-col hover:scale-[1.02] transition
                "
              >
                <div>
                  <div className="w-full aspect-square mb-2.5">
                    <img
                      src={p.image || "/images/placeholder.png"}
                      alt={p.title}
                      className="w-full h-full object-cover rounded-lg border border-sky-200 dark:border-indigo-600"
                    />
                  </div>

                  <h3 className="font-bold text-center text-sm truncate text-gray-800 dark:text-gray-100">
                    {p.title}
                  </h3>

                  <p className="text-center text-xs mt-1 text-gray-600 dark:text-gray-300 truncate">
                    دسته: {p.category?.name || "-"}
                  </p>
                </div>

                <button
                  onClick={() => openProductModal(p)}
                  className="
                    mt-3 w-full py-1.5 rounded-xl 
                    bg-gradient-to-r from-sky-100 to-sky-200 
                    dark:from-purple-700 dark:to-purple-800 
                    border border-sky-200 dark:border-indigo-600 
                    shadow text-gray-800 dark:text-white 
                    hover:scale-[1.03] transition text-sm
                  "
                >
                  تنظیم تخفیف
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* مودال دسته‌بندی */}
      {categoryModal && (
        <DiscountModal
          category={categoryModal}
          isOpen={true}
          onClose={closeCategoryModal}
        />
      )}

      {/* مودال محصول */}
      {productModal && (
        <DiscountModal
  product={productModal}
  isOpen={true}
  onClose={closeProductModal}
/>

      )}
    </div>
  );
}
