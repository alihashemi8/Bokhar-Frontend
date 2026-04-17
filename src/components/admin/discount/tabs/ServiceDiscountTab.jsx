import { useEffect, useState } from "react";
import {
  fetchCategories,
  fetchServices
} from "../../../../api/discountsApi";

import DiscountModal from "../modals/DiscountModal";

export default function ServiceDiscountTab() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [services, setServices] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadServices();
  }, [selectedCategory, query]);

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  const loadServices = async () => {
    let data = await fetchServices(query);

    if (selectedCategory !== "all") {
      data = data.filter((s) => s.category === selectedCategory);
    }

    setServices(data);
  };

  const openModal = (service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  return (
    <div className="p-6 rounded-3xl bg-white/30 dark:bg-white/10 backdrop-blur-xl border shadow-xl">

      {/* فیلتر دسته‌بندی */}
      <div className="flex overflow-x-auto gap-3 pb-3 mb-6">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-5 py-2 rounded-full border transition
          ${
            selectedCategory === "all"
              ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800"
              : "bg-white/50 dark:bg-white/20"
          }`}
        >
          همه
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.slug)}
            className={`px-5 py-2 rounded-full border transition
            ${selectedCategory === c.slug
              ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800"
              : "bg-white/50 dark:bg-white/20"
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* سرچ */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="جستجو بر اساس عنوان سرویس..."
        className="w-full mb-6 p-3 rounded-2xl bg-white/50 dark:bg-white/20 border"
      />

      {/* لیست سرویس‌ها */}
      {services.length === 0 ? (
        <p className="text-center text-gray-500">سرویسی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-3xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border shadow-lg"
            >
              <div className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-700"></div>

              <h3 className="mt-3 font-semibold">{s.title}</h3>

              <button
                onClick={() => openModal(s)}
                className="mt-4 w-full py-2 rounded-xl bg-purple-700 text-white hover:scale-105"
              >
                تنظیم تخفیف
              </button>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <DiscountModal
          service={selectedService}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
