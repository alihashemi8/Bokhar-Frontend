import { useState, useContext } from "react";
import Sidebar from "./Sidebar";
import { FiSearch } from "react-icons/fi";
import { ServicesContext } from "./services/ServicesContext";

export default function AdminDiscount() {
  const { categories, services, setServices } = useContext(ServicesContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("discounts");
  const [search, setSearch] = useState("");

  // فیلتر سرویس‌ها
  const visibleServices = services.filter(
    (s) =>
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      search === "" ||
      s.category === search
  );

  // اعمال تخفیف
  const applyDiscount = (id, type, value) => {
    setServices((prev) =>
      prev.map((srv) =>
        srv.id === id
          ? { ...srv, discountType: type, discountValue: Number(value) }
          : srv
      )
    );
  };

  // محاسبه قیمت
  const finalPrice = (srv) => {
    const base = srv.basePrice ?? 0;
    if (!srv.discountType || srv.discountValue == null) return base;

    if (srv.discountType === "percent") {
      return Math.max(base - (base * srv.discountValue) / 100, 0);
    }
    if (srv.discountType === "fixed") {
      return Math.max(base - srv.discountValue, 0);
    }

    return base;
  };

  return (
    <div dir="rtl" className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <main
        className={`flex-1 p-4 sm:p-6 transition-all duration-300 ${
          !isSidebarOpen ? "md:mr-64" : ""
        }`}
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-200">
            مدیریت تخفیف‌ها
          </h2>

          {/* Search */}
          <div className="relative mb-6">
            <FiSearch className="absolute left-3 top-3 text-gray-500 dark:text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="جستجوی سرویس…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 pr-4 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border dark:border-gray-600"
            />
          </div>

          {/* دسته‌بندی‌ها */}
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSearch(cat)}
                className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-all border 
                  ${
                    search === cat
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={() => setSearch("")}
              className={`px-4 py-2 rounded-full border font-medium
                ${
                  search === ""
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-gray-100 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
            >
              همه
            </button>
          </div>

          {/* کارت‌ها */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {visibleServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-2xl shadow p-4 flex flex-col h-80 hover:shadow-xl transition"
              >
                {/* تصویر */}
                <img
                  src={srv.image || "/images/placeholder.png"}
                  alt={srv.title}
                  className="w-full h-28 object-contain rounded-lg mb-3"
                />

                {/* عنوان */}
                <h3 className="text-center font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
                  {srv.title}
                </h3>

                {/* قیمت‌ها */}
                <div className="text-center mt-2">
                  {srv.discountType ? (
                    <>
                      <p className="text-purple-600 dark:text-purple-400 font-bold text-lg">
                        {finalPrice(srv).toLocaleString()} تومان
                      </p>

                      <p className="text-sm text-gray-500 dark:text-gray-300 line-through">
                        {srv.basePrice.toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg">
                      {srv.basePrice.toLocaleString()} تومان
                    </p>
                  )}
                </div>

{/* فرم تخفیف */}
<div className="mt-auto flex flex-col gap-3 pt-3">

  {/* درصدی */}
  <div className="relative">
<input
  type="number"
  placeholder="درصد تخفیف"
  onChange={(e) => applyDiscount(srv.id, "percent", e.target.value)}
  className="w-full p-2 pr-3 pl-10 rounded-xl bg-white dark:bg-gray-800 border dark:border-gray-600 text-gray-900 dark:text-gray-100 
  appearance-none [-moz-appearance:textfield]"
/>
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300 text-sm">
      %
    </span>
  </div>

  {/* تومانی */}
  <div className="relative">
<input
  type="number"
  placeholder="مبلغ تخفیف"
  onChange={(e) => applyDiscount(srv.id, "fixed", e.target.value)}
  className="w-full p-2 pr-3 pl-14 rounded-xl bg-white dark:bg-gray-800 border dark:border-gray-600 text-gray-900 dark:text-gray-100 
  appearance-none [-moz-appearance:textfield]"
/>
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap">
      تومان
    </span>
  </div>

</div>

              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
