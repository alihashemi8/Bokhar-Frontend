import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../../../api/clientApi";
import DiscountModal from "../modals/DiscountModal";

/* --------------------------------------------------
   Helpers
-------------------------------------------------- */

function getDiscountStatus(product) {
  if (!product?.pricing) return null;

  const now = new Date();

  for (const tab of Object.values(product.pricing)) {
    for (const m of tab.materialPrices || []) {
      if (!m.has_discount) continue;

      const start = m.discount_start_at
        ? new Date(m.discount_start_at)
        : null;
      const end = m.discount_end_at
        ? new Date(m.discount_end_at)
        : null;

      if (!start && !end) {
        return { type: "no_time" };
      }

      if (start && now < start) {
        return { type: "before", start };
      }

      if ((!start || now >= start) && (!end || now <= end)) {
        return { type: "running", end };
      }
    }
  }

  return null;
}

function formatRemaining(ms) {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);

  if (day > 0) return `${day} روز`;
  if (hour > 0) return `${hour} ساعت`;
  if (min > 0) return `${min} دقیقه`;
  return "چند لحظه";
}

/* --------------------------------------------------
   Badge Component
-------------------------------------------------- */

function DiscountBadge({ product }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  const status = useMemo(
    () => getDiscountStatus(product),
    [product, now]
  );

  if (!status) return null;

  let text = "";
  let color = "";

  if (status.type === "before") {
    text = `شروع تا ${formatRemaining(status.start - now)}`;
    color = "bg-yellow-100 text-yellow-700 border-yellow-300";
  }

  if (status.type === "running") {
    text = status.end
      ? `پایان تا ${formatRemaining(status.end - now)}`
      : "تخفیف فعال";
    color = "bg-green-100 text-green-700 border-green-300";
  }

  if (status.type === "no_time") {
    text = "تخفیف بدون محدودیت";
    color = "bg-sky-100 text-sky-700 border-sky-300";
  }

  return (
    <div
      className={`
        absolute -top-2 right-2 px-2 py-0.5
        rounded-lg text-[10px] font-semibold
        border backdrop-blur z-10
        ${color}
      `}
    >
      {text}
    </div>
  );
}

/* --------------------------------------------------
   Main Component
-------------------------------------------------- */

export default function ServiceDiscountTab() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  const [categoryModal, setCategoryModal] = useState(null);
  const [productModal, setProductModal] = useState(null);

  /* ---------------- Load Categories ---------------- */

  useEffect(() => {
    (async () => {
      const data = await api.getCategories();
      setCategories(data);
    })();
  }, []);

  /* ---------------- Load Products ---------------- */

  useEffect(() => {
    (async () => {
      const data = query.trim()
        ? await api.searchProducts(query)
        : await api.getProducts();
      setProducts(data);
    })();
  }, [query]);

  useEffect(() => {
  if (!products.length) return;

  products.forEach((p) => {
    if (p.pricing) return;

    api.getProduct(p.id).then((full) => {
      setProducts((prev) =>
        prev.map((x) =>
          x.id === p.id ? { ...x, pricing: full.pricing } : x
        )
      );
    });
  });
}, [products]);

  /* ---------------- Detect Discount ---------------- */

  const hasDiscount = (product) => {
    if (!product?.pricing) return false;

    return Object.values(product.pricing).some((tab) =>
      tab.materialPrices?.some((m) => Number(m.discount_amount) > 0)
    );
  };

  /* ---------------- Glow IDs ---------------- */

  const glowIds = useMemo(
    () => products.filter(hasDiscount).map((p) => p.id),
    [products]
  );

  /* ---------------- Filter Products ---------------- */

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => p.category?.id === selectedCategory);
  }, [products, selectedCategory]);

  /* ---------------- Modals ---------------- */

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

  /* ---------------- IntersectionObserver ---------------- */

  const cardsRef = useRef({});
  const [visibleCards, setVisibleCards] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.dataset.id;

          setTimeout(() => {
            setVisibleCards((prev) => ({ ...prev, [id]: true }));
          }, 15);

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    Object.values(cardsRef.current).forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, [filteredProducts]);

  /* ---------------- UI ---------------- */

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8 px-3 md:px-4">

      {/* محصولات */}
      <div className="
        w-full p-4 md:p-5 rounded-2xl
        bg-white/70 dark:bg-neutral-800/60 backdrop-blur
        border border-sky-200 dark:border-indigo-600 shadow-lg
      ">
        <h3 className="font-bold text-lg mb-4">
          تخفیف روی محصولات
        </h3>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو..."
          className="
            w-full mb-6 p-2.5 rounded-xl border
            border-sky-200 dark:border-indigo-600
          "
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              data-id={p.id}
              ref={(el) => (cardsRef.current[p.id] = el)}
              className={`
                relative p-3 rounded-xl bg-white/90 dark:bg-neutral-800/80
                backdrop-blur border border-sky-200 dark:border-indigo-600
                shadow-md flex flex-col transition
                hover:scale-[1.02]
                ${
                  visibleCards[p.id] && glowIds.includes(p.id)
                    ? "discount-glow"
                    : ""
                }
              `}
            >
              <DiscountBadge product={p} />

              <img
                src={p.image || "/images/placeholder.png"}
                alt={p.title}
                className="aspect-square object-cover rounded-lg mb-2"
              />

              <h3 className="text-sm font-bold text-center truncate">
                {p.title}
              </h3>

              <button
                onClick={() => openProductModal(p)}
                className="
                  mt-3 w-full py-1.5 rounded-xl text-sm
                  bg-gradient-to-r from-sky-100 to-sky-200
                  dark:from-purple-700 dark:to-purple-800
                  border border-sky-200 dark:border-indigo-600
                "
              >
                تنظیم تخفیف
              </button>
            </div>
          ))}
        </div>
      </div>

      {productModal && (
        <DiscountModal
          product={productModal}
          isOpen
          onClose={closeProductModal}
        />
      )}

      {categoryModal && (
        <DiscountModal
          category={categoryModal}
          isOpen
          onClose={closeCategoryModal}
        />
      )}
    </div>
  );
}
