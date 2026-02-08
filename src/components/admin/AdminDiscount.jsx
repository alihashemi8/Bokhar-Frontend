import { useState, useContext } from "react";
import Sidebar from "./Sidebar";
import { FiPercent, FiDollarSign } from "react-icons/fi";
import { ServicesContext } from "./services/ServicesContext";
import Search from "./Search"; // کامپوننت Search شخصی

export default function AdminDiscount() {
  const { categories, services, setServices } = useContext(ServicesContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("discounts");
  const [search, setSearch] = useState("");

  const visibleServices = services.filter((s) =>
    s.title?.toLowerCase().includes(search.toLowerCase())
  );

  const applyDiscount = (id, type, value) => {
    setServices((prev) =>
      prev.map((srv) =>
        srv.id === id
          ? { ...srv, discountType: type, discountValue: Number(value) }
          : srv
      )
    );
  };

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
    <div dir="rtl" className="flex min-h-screen overflow-x-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 md:mr-64">
        {/* 🔹 باکس هدر + سرچ + دسته‌بندی */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl max-w-full mb-6">
          {/* هدر */}
          <div className="mb-6 p-5 rounded-2xl text-gray-800 ">
            <h2 className="text-2xl font-extrabold">مدیریت تخفیف‌ها</h2>
            <p className="text-sm opacity-90">
              تعیین تخفیف درصدی یا تومانی برای هر سرویس
            </p>
          </div>

          {/* 🔍 سرچ */}
          <div className="mb-6">
            <Search
              value={search}
              onChange={setSearch}
              items={[]}
              placeholder="جستجو بر اساس عنوان سرویس..."
            />
          </div>

          {/* دسته‌بندی‌ها */}
          <div className="flex gap-3 overflow-x-auto pb-3 max-w-full">
            <button
              onClick={() => setSearch("")}
              className={`px-5 py-2 rounded-full border font-medium shrink-0 ${
                search === ""
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              همه
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSearch(cat)}
                className={`px-6 py-2 rounded-full transition-all border font-medium shrink-0
                ${
                  search === cat
                    ? "bg-gradient-to-r from-purple-600 to-indigo-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* کارت‌های خدمات */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-full">
          {visibleServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600 flex flex-col"
            >
              <div className="relative">
                <img
                  src={srv.image || "/images/placeholder.png"}
                  className="w-full h-28 object-cover rounded-xl mb-3"
                />
                {srv.discountType && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg">
                    تخفیف فعال
                  </span>
                )}
              </div>

              <h3 className="font-bold text-center mb-1 truncate">{srv.title}</h3>

              {/* قیمت */}
              <div className="text-center mt-1 mb-2">
                {srv.discountType ? (
                  <>
                    <p className="text-purple-600 font-extrabold text-lg">
                      {finalPrice(srv).toLocaleString()} تومان
                    </p>
                    <p className="text-sm text-gray-400 line-through">
                      {srv.basePrice.toLocaleString()}
                    </p>
                  </>
                ) : (
                  <p className="font-semibold">{srv.basePrice.toLocaleString()} تومان</p>
                )}
              </div>

              {/* فرم تخفیف */}
              <div className="mt-auto flex flex-col gap-2">
                <div className="relative">
                  <FiPercent className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    placeholder="درصد تخفیف"
                    onChange={(e) => applyDiscount(srv.id, "percent", e.target.value)}
                    className="w-full p-2 rounded-xl bg-gray-100 dark:bg-gray-800 border focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    placeholder="مبلغ تخفیف"
                    onChange={(e) => applyDiscount(srv.id, "fixed", e.target.value)}
                    className="w-full p-2 rounded-xl bg-gray-100 dark:bg-gray-800 border focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
