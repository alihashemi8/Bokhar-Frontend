import { useState, useMemo } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  RotateCcw,
  Search,
} from "lucide-react";
import OrdersTable from "../OrdersTable";

export default function ManageOrders({
  orders,
  cities,
  cityFilter,
  setCityFilter,
  toggleCheck,
  onRowClick,
}) {
  const [activeStatusTab, setActiveStatusTab] = useState("new");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  // تنظیمات ۶ تب وضعیت با رنگ‌های متمایز
  const tabs = [
    {
      id: "new",
      label: "جدید",
      icon: Package,
      colors: {
        active: "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-sky-700 dark:to-sky-800 shadow-sky-300 dark:shadow-sky-500 border-sky-300 dark:border-sky-600",
        hover: "hover:bg-sky-50 dark:hover:bg-sky-900/30",
      },
    },
    {
      id: "inProgress",
      label: "در حال انجام",
      icon: Clock,
      colors: {
        active: "bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-700 dark:to-amber-800 shadow-amber-300 dark:shadow-amber-500 border-amber-300 dark:border-amber-600",
        hover: "hover:bg-amber-50 dark:hover:bg-amber-900/30",
      },
    },
    {
      id: "done",
      label: "انجام شده",
      icon: CheckCircle,
      colors: {
        active: "bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-700 dark:to-emerald-800 shadow-emerald-300 dark:shadow-emerald-500 border-emerald-300 dark:border-emerald-600",
        hover: "hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
      },
    },
    {
      id: "cancelled",
      label: "لغو شده",
      icon: XCircle,
      colors: {
        active: "bg-gradient-to-r from-rose-100 to-rose-200 dark:from-rose-700 dark:to-rose-800 shadow-rose-300 dark:shadow-rose-500 border-rose-300 dark:border-rose-600",
        hover: "hover:bg-rose-50 dark:hover:bg-rose-900/30",
      },
    },
    {
      id: "delivered",
      label: "تحویل داده شده",
      icon: Truck,
      colors: {
        active: "bg-gradient-to-r from-violet-100 to-violet-200 dark:from-violet-700 dark:to-violet-800 shadow-violet-300 dark:shadow-violet-500 border-violet-300 dark:border-violet-600",
        hover: "hover:bg-violet-50 dark:hover:bg-violet-900/30",
      },
    },
    {
      id: "returned",
      label: "برگشت زده",
      icon: RotateCcw,
      colors: {
        active: "bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 shadow-slate-300 dark:shadow-slate-500 border-slate-300 dark:border-slate-600",
        hover: "hover:bg-slate-50 dark:hover:bg-slate-900/30",
      },
    },
  ];

  // فیلتر و مرتب‌سازی
  const processedOrders = useMemo(() => {
    let result = orders.filter((order) => order.status === activeStatusTab);

    // جستجو
    if (searchQuery) {
      result = result.filter(
        (order) =>
          order.name?.includes(searchQuery) ||
          order.phone?.includes(searchQuery) ||
          order.address?.includes(searchQuery)
      );
    }

    // فیلتر شهر
    if (cityFilter) {
      result = result.filter((order) => order.city === cityFilter);
    }

    // مرتب‌سازی
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === "price") {
          return sortConfig.direction === "asc"
            ? a.price - b.price
            : b.price - a.price;
        }
        if (sortConfig.key === "deliveryDate") {
          return sortConfig.direction === "asc"
            ? new Date(a.deliveryDate) - new Date(b.deliveryDate)
            : new Date(b.deliveryDate) - new Date(a.deliveryDate);
        }
        return 0;
      });
    }

    return result;
  }, [orders, activeStatusTab, searchQuery, cityFilter, sortConfig]);

  const toggleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // شمارش هر تب
  const getCount = (status) => orders.filter((o) => o.status === status).length;

  return (
    <div className="w-full">
      {/* 🔘 ۶ تب وضعیت */}
      <div className="flex gap-2 sm:gap-3 mb-6 overflow-x-auto pb-4 justify-start sm:justify-center no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeStatusTab === tab.id;
          const Icon = tab.icon;
          const count = getCount(tab.id);
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveStatusTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base rounded-full font-semibold border transition-all duration-200 cursor-pointer whitespace-nowrap flex-shrink-0
                ${isActive
                  ? `${tab.colors.active} scale-105 text-gray-800 dark:text-white/90 shadow-md`
                  : `bg-white dark:bg-gray-800/80 ${tab.colors.hover} border-gray-200 dark:border-gray-600 shadow-sm text-gray-700 dark:text-gray-200`
                }`}
            >
              <Icon size={18} className={isActive ? "opacity-100" : "opacity-70"} />
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={`mr-1 min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center
                  ${isActive
                      ? "bg-white/30 text-current"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 🔍 جستجو */}
      <div className="mb-6 px-2">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="جستجو در نام، شماره تماس یا آدرس..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-3 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
          />
          <Search
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* عنوان بخش */}
      <div className="flex items-center justify-between mb-4 px-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            ({processedOrders.length} مورد)
          </span>
        </h3>
      </div>

      {/* جدول سفارشات */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <OrdersTable
          orders={processedOrders}
          cities={cities}
          cityFilter={cityFilter}
          setCityFilter={setCityFilter}
          toggleSort={toggleSort}
          toggleCheck={toggleCheck}
          activeTab={activeStatusTab}
          onRowClick={onRowClick}
          showCheckbox={activeStatusTab !== "done"} // چک‌باکس برای انجام شده نمایش داده نشه
        />
      </div>
    </div>
  );
}
