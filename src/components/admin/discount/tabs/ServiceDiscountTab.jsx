import { useEffect, useMemo, useRef, useState } from "react";
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
  // Fix: Trigger glow AFTER initial render
  // ---------------------------
  const [animateGlow, setAnimateGlow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimateGlow(true), 0);
    return () => clearTimeout(t);
  }, []);

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
  // Load Products
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
  // Detect discount
  // ---------------------------
  const hasDiscount = (product) => {
    if (!product?.pricing) return false;

    return Object.values(product.pricing).some((tab) =>
      tab.materialPrices?.some((m) => Number(m.discount_amount) > 0)
    );
  };

  // ---------------------------
  // Memo: Glow IDs
  // ---------------------------
  const glowIds = useMemo(() => {
    return products
      .filter((p) => hasDiscount(p))
      .map((p) => p.id);
  }, [products]);

  // ---------------------------
  // Memo: Filter Products
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

    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, pricing: fullData.pricing } : p
      )
    );

    setProductModal(fullData);
  };

  const closeProductModal = () => setProductModal(null);
  const openCategoryModal = (c) => setCategoryModal(c);
  const closeCategoryModal = () => setCategoryModal(null);

  // ---------------------------
  // IntersectionObserver برای فعال کردن انیمیشن
  // ---------------------------
  const cardsRef = useRef({});
  const [visibleCards, setVisibleCards] = useState({});

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.dataset.id;

          // کمی صبر کن تا DOM کامل settle بشه
          setTimeout(() => {
            setVisibleCards((prev) => ({
              ...prev,
              [id]: true,
            }));
          }, 15); // 15ms کافی و تست شده

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  Object.values(cardsRef.current).forEach((el) => {
    if (el) observer.observe(el);
  });

  return () => observer.disconnect();
}, [filteredProducts]);


  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8 px-3 md:px-4 overflow-x-hidden">

      {/* دسته‌ها */}
      <div className="
        w-full p-4 md:p-5 rounded-2xl
        bg-white/70 dark:bg-neutral-800/60 backdrop-blur-md
        border border-sky-200 dark:border-indigo-600 shadow-lg
      ">
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
      <div className="
        w-full p-4 md:p-5 rounded-2xl
        bg-white/70 dark:bg-neutral-800/60 backdrop-blur-md
        border border-sky-200 dark:border-indigo-600 shadow-lg
      ">
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

        {/* لیست محصولات */}
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
            محصولی یافت نشد.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

            {filteredProducts.map((p) => (
              <div
                key={p.id}
                data-id={p.id}
                ref={(el) => (cardsRef.current[p.id] = el)}
                className={`
                  relative p-3 rounded-xl bg-white/90 dark:bg-neutral-800/80
                  backdrop-blur border border-sky-200 dark:border-indigo-600
                  shadow-md flex flex-col hover:scale-[1.02] transition
                  ${visibleCards[p.id] && glowIds.includes(p.id) ? "discount-glow" : ""}
                `}
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
