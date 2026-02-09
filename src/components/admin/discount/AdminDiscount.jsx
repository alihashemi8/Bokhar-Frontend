import { useState, useContext } from "react";
import Sidebar from "../Sidebar";
import { FiPercent } from "react-icons/fi";
import { ServicesContext } from "../services/ServicesContext";
import Search from "../Search";
import DiscountModal from "./DiscountModal";

export default function AdminDiscount() {
  const { categories, services, setServices } = useContext(ServicesContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("discounts");

  // 🔍 سرچ متنی
  const [searchText, setSearchText] = useState("");

  // 🏷️ دسته‌بندی فعال
  const [activeCategory, setActiveCategory] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // 🔍 فیلتر نهایی سرویس‌ها
  const visibleServices = services.filter((s) => {
    const matchSearch = s.title
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    const matchCategory = !activeCategory || s.category === activeCategory;

    return matchSearch && matchCategory;
  });

  const getDiscountLabel = (srv) => {
    if (!srv.discountType) return "بدون تخفیف";
    return srv.discountType === "percent"
      ? `تخفیف ${srv.discountValue}%`
      : `تخفیف ${srv.discountValue?.toLocaleString()} تومان`;
  };

  return (
    <div
      dir="rtl"
      className="flex min-h-screen overflow-x-hidden"
    >
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 md:mr-64">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white text-center md:text-start mb-6 md:mb-8">
          مدیریت تخفیف‌ها
        </h2>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow mb-6">
          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-300">
              تعیین تخفیف درصدی یا مبلغی برای سرویس‌ها
            </p>
          </div>

          {/* دسته‌بندی‌ها */}
          <div className="flex gap-3 overflow-x-auto pb-4">
            <button
              onClick={() => setActiveCategory("")}
              className={`px-5 py-2 rounded-full mr-2 shrink-0 font-medium
                ${
                  activeCategory === ""
                    ? "bg-gradient-to-r from-sky-50 via-sky-100 to-sky-200 shadow-indigo-300 text-gray-800 shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 shadow-md hover:shadow-xl"
                }`}
            >
              همه
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full shrink-0 font-medium transition-all
                  ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-sky-50 via-sky-100 to-sky-200 shadow-indigo-300 text-gray-800 shadow-md"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 shadow-md hover:shadow-xl"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* باکس کارت‌ها + سرچ */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow mb-6">
          <div className="mb-6">
            <Search
              value={searchText}
              onChange={setSearchText}
              items={[]}
              placeholder="جستجو بر اساس عنوان..."
            />
          </div>

          {/* کارت‌های سرویس */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 shadow flex flex-col justify-between aspect-[3/4]"
              >
                <div>
                  <img
                    src={srv.image || "/images/placeholder.png"}
                    className="w-full h-32 object-cover mb-3 rounded-xl"
                  />

                  <h3 className="font-bold text-center truncate text-gray-900 dark:text-white">
                    {srv.title || "بدون عنوان"}
                  </h3>

                  <p className="text-center text-sm mt-1 text-gray-600 dark:text-gray-300 truncate">
                    {getDiscountLabel(srv)}
                  </p>
                </div>

                <div className="flex justify-center mt-3">
                  <button
                    onClick={() => {
                      setEditItem(srv);
                      setModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2"
                  >
                    <FiPercent />
                    تنظیم تخفیف
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* حالت خالی */}
          {visibleServices.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
              سرویسی یافت نشد
            </p>
          )}
        </div>

        {/* مودال تخفیف */}
        {modalOpen && editItem && (
          <DiscountModal
            isOpen={modalOpen}
            categories={categories}
            editItem={{
              title: editItem.title,
              category: editItem.category,
              discounts: {
                عمومی: {
                  discountType: editItem.discountType || "",
                  value: editItem.discountValue || "",
                },
              },
            }}
            onClose={() => {
              setModalOpen(false);
              setEditItem(null);
            }}
            onSave={(data) => {
              const discountData =
                data.discounts?.[Object.keys(data.discounts)[0]];

              setServices((prev) =>
                prev.map((srv) =>
                  srv.id === editItem.id
                    ? {
                        ...srv,
                        discountType: discountData?.discountType,
                        discountValue: Number(discountData?.value || 0),
                      }
                    : srv,
                ),
              );

              setModalOpen(false);
              setEditItem(null);
            }}
          />
        )}
      </main>
    </div>
  );
}
