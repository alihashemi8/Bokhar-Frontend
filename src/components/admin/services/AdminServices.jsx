import { useState, useMemo, useRef, useEffect } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  RotateCcw,
  Search,
  Info,
  ArrowLeft,
} from "lucide-react";

export default function ManageOrders({
  orders,
  cities,
  cityFilter,
  setCityFilter,
  toggleCheck,
  onRowClick,
  onStatusChange,
}) {
  const [activeStatusTab, setActiveStatusTab] = useState("new");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  
  const [isOverflowing, setIsOverflowing] = useState(false);
  const tabsScrollRef = useRef(null);

  // چک کردن اورفلو تب‌ها
  useEffect(() => {
    const checkOverflow = () => {
      if (tabsScrollRef.current) {
        const { scrollWidth, clientWidth } = tabsScrollRef.current;
        setIsOverflowing(scrollWidth > clientWidth);
      }
    };
    
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    const resizeObserver = new ResizeObserver(() => {
      checkOverflow();
    });
    
    if (tabsScrollRef.current) {
      resizeObserver.observe(tabsScrollRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', checkOverflow);
      resizeObserver.disconnect();
    };
  }, []);

  // اسکرول افقی با چرخ ماوس
  useEffect(() => {
    const el = tabsScrollRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 100 : -100;
        el.scrollBy({
          left: delta,
          behavior: 'smooth'
        });
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // تنظیمات ۶ تب وضعیت با رنگ‌ها و توضیحات مخصوص
  const tabs = [
    {
      id: "new",
      label: "جدید",
      description: "سفارش‌های تازه ثبت شده که هنوز پردازش نشده‌اند و منتبر شروع هستند",
      icon: Package,
      colors: {
        active: "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-sky-700 dark:to-sky-800 shadow-sky-300 dark:shadow-sky-500 border-sky-300 dark:border-sky-600",
        hover: "hover:bg-sky-50 dark:hover:bg-sky-900/30",
        text: "text-sky-700 dark:text-sky-300"
      },
    },
    {
      id: "inProgress",
      label: "در حال انجام",
      description: "سفارش‌های در حال پردازش، آماده‌سازی بسته‌بندی یا ارسال",
      icon: Clock,
      colors: {
        active: "bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-700 dark:to-amber-800 shadow-amber-300 dark:shadow-amber-500 border-amber-300 dark:border-amber-600",
        hover: "hover:bg-amber-50 dark:hover:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-300"
      },
    },
    {
      id: "done",
      label: "انجام شده",
      description: "سفارش‌های تکمیل شده و آماده تحویل (قابلیت انتقال به تحویل داده شده)",
      icon: CheckCircle,
      colors: {
        active: "bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-700 dark:to-emerald-800 shadow-emerald-300 dark:shadow-emerald-500 border-emerald-300 dark:border-emerald-600",
        hover: "hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-300"
      },
    },
    {
      id: "delivered",
      label: "تحویل داده شده",
      description: "سفارش‌هایی که با موفقیت به مشتری تحویل داده شده‌اند",
      icon: Truck,
      colors: {
        active: "bg-gradient-to-r from-violet-100 to-violet-200 dark:from-violet-700 dark:to-violet-800 shadow-violet-300 dark:shadow-violet-500 border-violet-300 dark:border-violet-600",
        hover: "hover:bg-violet-50 dark:hover:bg-violet-900/30",
        text: "text-violet-700 dark:text-violet-300"
      },
    },
    {
      id: "cancelled",
      label: "لغو شده",
      description: "سفارش‌های لغو شده توسط مشتری یا سیستم",
      icon: XCircle,
      colors: {
        active: "bg-gradient-to-r from-rose-100 to-rose-200 dark:from-rose-700 dark:to-rose-800 shadow-rose-300 dark:shadow-rose-500 border-rose-300 dark:border-rose-600",
        hover: "hover:bg-rose-50 dark:hover:bg-rose-900/30",
        text: "text-rose-700 dark:text-rose-300"
      },
    },
    {
      id: "returned",
      label: "برگشت زده",
      description: "سفارش‌هایی که توسط مشتری برگشت داده شده‌اند",
      icon: RotateCcw,
      colors: {
        active: "bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 shadow-slate-300 dark:shadow-slate-500 border-slate-300 dark:border-slate-600",
        hover: "hover:bg-slate-50 dark:hover:bg-slate-900/30",
        text: "text-slate-700 dark:text-slate-300"
      },
    },
  ];

  // پیدا کردن تب فعال برای نمایش توضیحات
  const activeTabInfo = tabs.find(tab => tab.id === activeStatusTab);

  // فیلتر و مرتب‌سازی
  const processedOrders = useMemo(() => {
    let result = orders.filter((order) => order.status === activeStatusTab);

    if (searchQuery) {
      result = result.filter(
        (order) =>
          order.name?.includes(searchQuery) ||
          order.phone?.includes(searchQuery) ||
          order.address?.includes(searchQuery)
      );
    }

    if (cityFilter) {
      result = result.filter((order) => order.city === cityFilter);
    }

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

  const getCount = (status) => orders.filter((o) => o.status === status).length;

  return (
    <div className="w-full">
      {/* 🔘 ۶ تب وضعیت با اسکرول */}
      <div className="relative mb-2">
        <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none sm:hidden" />
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none sm:hidden" />
        
        <div 
          ref={tabsScrollRef}
          className={`flex gap-1.5 sm:gap-2 overflow-x-auto pb-4 pt-2 px-3 sm:px-2 
                     scroll-smooth flex-nowrap items-center
                     ${isOverflowing ? 'justify-start' : 'justify-center'}
                     scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 
                     scrollbar-track-transparent transition-all duration-300`}
          style={{ scrollbarWidth: 'thin' }}
        >
          {tabs.map((tab) => {
            const isActive = activeStatusTab === tab.id;
            const Icon = tab.icon;
            const count = getCount(tab.id);
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStatusTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 
                           text-xs sm:text-sm rounded-full font-medium border 
                           transition-all duration-200 cursor-pointer 
                           whitespace-nowrap flex-shrink-0 group
                           ${isActive
                             ? `${tab.colors.active} scale-105 text-gray-800 dark:text-white/90 shadow-sm ring-2 ring-offset-1 ${tab.colors.active.split(' ')[0].replace('bg-gradient-to-r', 'ring')}`
                             : `bg-white dark:bg-gray-800/80 ${tab.colors.hover} border-gray-200 dark:border-gray-600 shadow-sm text-gray-700 dark:text-gray-200 hover:border-gray-300`
                           }`}
                title={tab.description}
              >
                <Icon size={16} className={isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"} />
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`mr-0.5 min-w-[18px] h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center
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
      </div>

      {/* 📋 توضیحات تب فعال */}
      <div className="mb-6 px-4">
        <div className={`flex items-start gap-2 p-3 rounded-lg border border-dashed ${activeTabInfo?.colors?.active?.split(' ')[0].replace('from-', 'border-').split(' ')[0] || 'border-gray-300'} bg-gray-50/50 dark:bg-gray-800/30`}>
          <Info size={18} className={`mt-0.5 flex-shrink-0 ${activeTabInfo?.colors?.text || 'text-gray-500'}`} />
          <div>
            <h4 className={`font-semibold text-sm ${activeTabInfo?.colors?.text || 'text-gray-700 dark:text-gray-300'}`}>
              {activeTabInfo?.label}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
              {activeTabInfo?.description}
            </p>
          </div>
        </div>
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
          <span>لیست سفارشات</span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
            {processedOrders.length} مورد
          </span>
        </h3>
        
        {/* راهنمای تغییر وضعیت */}
        {activeStatusTab === "done" && (
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <ArrowLeft size={14} />
            <span>برای تحویل کردن از دکمه "تحویل داده شد" استفاده کنید</span>
          </div>
        )}
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
          showCheckbox={activeStatusTab !== "done"}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  );
}

function OrdersTable({
  orders,
  cities,
  cityFilter,
  setCityFilter,
  toggleSort,
  toggleCheck,
  activeTab,
  onRowClick,
  onStatusChange,
}) {
  const remainingDays = (date) => {
    const today = new Date();
    const delivery = new Date(date);
    const diff = Math.ceil((delivery - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
  };

  // تابع کمکی برای تغییر وضعیت با تأییدیه
  const handleDeliver = (e, orderId) => {
    e.stopPropagation();
    if (window.confirm('آیا مطمئن هستید که این سفارش تحویل داده شده است؟\n\nاین عملیات غیرقابل بازگشت است.')) {
      onStatusChange(orderId, "delivered");
    }
  };

  return (
    <div className="bg-white/50 dark:bg-white/5 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl mt-6 p-6 shadow-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-right">
          <thead className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <tr>
              <th className="p-3 font-semibold">شماره سفارش</th>
              <th className="p-3 font-semibold">نام مشتری</th>
              <th className="p-3 font-semibold">
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
                >
                  <option value="">محله</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </th>
              <th
                className="p-3 cursor-pointer select-none hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-semibold"
                onClick={() => toggleSort("deliveryDate")}
              >
                مهلت تحویل
              </th>
              <th
                className="p-3 cursor-pointer select-none hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-semibold"
                onClick={() => toggleSort("price")}
              >
                مبلغ کل
              </th>
              <th className="p-3 font-semibold text-center">عملیات</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <Package size={32} className="opacity-20" />
                    <span>سفارشی یافت نشد</span>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onRowClick(order)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                >
                  <td className="p-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCheck(order.id);
                      }}
                      disabled={activeTab === "done"}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all duration-200 ${
                        order.isChecked
                          ? "bg-green-100 text-green-700 border border-green-400 dark:bg-green-900/30 dark:text-green-300 dark:border-green-600"
                          : "bg-red-100 text-red-700 border border-red-400 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600"
                      } ${activeTab === "done" ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
                      title={activeTab === "done" ? "در وضعیت انجام شده امکان تیک زدن وجود ندارد" : "تغییر وضعیت بررسی"}
                    >
                      #{order.id}
                    </button>
                  </td>
                  <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                    {order.name}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">
                    {order.city}
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      remainingDays(order.deliveryDate) <= 1 
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" 
                        : remainingDays(order.deliveryDate) <= 3 
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    }`}>
                      {remainingDays(order.deliveryDate)} روز
                    </span>
                  </td>
                  <td className="p-3 font-bold text-gray-800 dark:text-gray-200">
                    {order.price.toLocaleString()} 
                    <span className="text-xs font-normal text-gray-500 mr-1">تومان</span>
                  </td>
                  <td className="p-3 text-center">
                    {/* دکمه انتقال از انجام شده به تحویل داده شده */}
                    {activeTab === "done" && onStatusChange && (
                      <button
                        onClick={(e) => handleDeliver(e, order.id)}
                        className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white shadow-md hover:shadow-lg transition-all duration-200 text-xs font-bold group/btn"
                        title="انتقال به وضعیت تحویل داده شده"
                      >
                        <Truck size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                        <span>تحویل داده شد</span>
                      </button>
                    )}
                    
                    {/* نمایش وضعیت برای تب‌های دیگر */}
                    {activeTab !== "done" && (
                      <span className="text-xs text-gray-400">
                        {activeTab === "delivered" && "✓ تحویل شده"}
                        {activeTab === "cancelled" && "✕ لغو شده"}
                        {activeTab === "returned" && "↩ برگشت داده"}
                        {activeTab === "new" && "⏳ در انتظار"}
                        {activeTab === "inProgress" && "🔄 در حال پردازش"}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
