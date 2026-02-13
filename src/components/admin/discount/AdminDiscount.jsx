import { useState, useContext } from "react";
import Sidebar from "../Sidebar";
import { FiPercent } from "react-icons/fi";
import { ServicesContext } from "../services/ServicesContext";
import Search from "../../Search";
import DiscountModal from "./DiscountModal";

export default function AdminDiscount() {
  const { categories, services, setServices } = useContext(ServicesContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("discounts");

  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

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
    <div dir="rtl" className="flex min-h-screen overflow-x-hidden">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 md:mr-64">
        <h2 className="text-2xl font-bold text-center md:text-start text-gray-800 dark:text-gray-100 mb-8">
          مدیریت تخفیف‌ها
        </h2>

        {/* دسته‌بندی‌ها */}
        <div
          className="
            p-6 rounded-3xl
            bg-white/30 dark:bg-white/50
            backdrop-blur-lg
            border border-sky-200/50
            shadow-xl
            mb-6
          "
        >
          <p className="text-sm text-gray-600 dark:text-gray-700 mb-5">
            تعیین تخفیف درصدی یا مبلغی برای سرویس‌ها
          </p>

          <div className="flex gap-3 overflow-x-auto pb-3 px-1">
            <button
              onClick={() => setActiveCategory("")}
              className={`px-5 py-2 rounded-full shrink-0 font-medium transition border
                ${
                  activeCategory === ""
                    ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800 border-sky-200 dark:border-indigo-500 shadow-md shadow-indigo-300 dark:shadow-indigo-500 text-gray-800 dark:text-white"
                    : "bg-white/70 dark:bg-white/50 hover:dark:bg-white/70 border-sky-200 shadow-md hover:shadow-lg"
                }`}
            >
              همه
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full shrink-0 font-medium transition border
                  ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800 border-sky-200 dark:border-indigo-500 shadow-md shadow-indigo-300 dark:shadow-indigo-500 text-gray-800 dark:text-white"
                      : "bg-white/70 dark:bg-white/50 hover:dark:bg-white/70 border-sky-200 shadow-md hover:shadow-lg"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* سرچ + کارت‌ها */}
        <div
          className="
            p-6 rounded-3xl
            bg-white/30 dark:bg-white/50
            backdrop-blur-lg
            border border-sky-200/50
            shadow-xl
          "
        >
          <div className="mb-6">
            <Search
              value={searchText}
              onChange={setSearchText}
              items={[]}
              placeholder="جستجو بر اساس عنوان..."
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleServices.map((srv) => (
              <div
                key={srv.id}
                className="
                  p-4 rounded-2xl
                  bg-white/60
                  backdrop-blur-lg
                  border border-sky-200/50
                  shadow-xl
                  flex flex-col justify-between
                  aspect-[3/4]
                  hover:scale-[1.03] transition
                "
              >
                <div>
                  <img
                    src={srv.image || "/images/placeholder.png"}
                    className="w-full h-32 object-cover mb-3 rounded-xl"
                  />

                  <h3 className="font-bold text-center truncate text-slate-800">
                    {srv.title || "بدون عنوان"}
                  </h3>

                  <p className="text-center text-sm mt-1 text-slate-600 truncate">
                    {getDiscountLabel(srv)}
                  </p>
                </div>

                <div className="flex justify-center mt-3">
                  <button
                    onClick={() => {
                      setEditItem(srv);
                      setModalOpen(true);
                    }}
                    className="
                      px-4 py-2 rounded-xl
                      bg-gradient-to-r from-sky-100 to-sky-200
                      dark:from-purple-700 dark:to-purple-800
                      border border-sky-200
                      shadow-lg
                      text-gray-800 dark:text-white
                      flex items-center gap-2
                      hover:scale-105 transition
                    "
                  >
                    <FiPercent />
                    تنظیم تخفیف
                  </button>
                </div>
              </div>
            ))}
          </div>

          {visibleServices.length === 0 && (
            <p className="text-center text-gray-500 mt-6">
              سرویسی یافت نشد
            </p>
          )}
        </div>

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
