import { useState, useMemo } from "react";
import { Check, ClipboardList, Clock, Calendar } from "lucide-react";
import Sidebar from "../Sidebar";
import OrderModal from "./OrderModal";
import Search from "../../Search";
import OrdersTable from "./OrdersTable";
import ManageOrders from "./tabs/ManageOrders"; 

export default function AdminOrders() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("orders");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // دو تب اصلی: orders (مدیریت سفارش‌ها), time (مدیریت زمان)
  const [activeTab, setActiveTab] = useState("orders");
  const [timeView, setTimeView] = useState("today");

  // داده‌های اولیه با ۶ وضعیت مختلف
  const initialOrdersData = [
    {
      id: 1,
      city: "تهران",
      date: "2026-05-07",
      price: 450000,
      phone: "09381234567",
      address: "خیابان ولیعصر",
      name: "علی احمدی",
      deliveryDate: "2026-05-10",
      status: "new",
      isChecked: false,
    },
    {
      id: 2,
      city: "مشهد",
      date: "2026-05-07",
      price: 200000,
      phone: "09129876543",
      address: "خیابان امام رضا",
      name: "سارا رضایی",
      deliveryDate: "2026-05-09",
      status: "inProgress",
      isChecked: false,
    },
    {
      id: 3,
      city: "اصفهان",
      date: "2026-05-06",
      price: 300000,
      phone: "09122334455",
      address: "چهارباغ",
      name: "مهدی کریمی",
      deliveryDate: "2026-05-08",
      status: "done",
      isChecked: false,
    },
    {
      id: 4,
      city: "تهران",
      date: "2026-05-05",
      price: 150000,
      phone: "09123456789",
      address: "تهرانپارس",
      name: "نرگس محمدی",
      deliveryDate: "2026-05-07",
      status: "cancelled",
      isChecked: false,
    },
    {
      id: 5,
      city: "شیراز",
      date: "2026-05-04",
      price: 550000,
      phone: "09151111111",
      address: "حافظیه",
      deliveryDate: "2026-05-06",
      status: "delivered",
      isChecked: false,
    },
    {
      id: 6,
      city: "تبریز",
      date: "2026-05-03",
      price: 120000,
      phone: "09141111111",
      address: "خیابان امام",
      deliveryDate: "2026-05-05",
      status: "returned",
      isChecked: false,
    },
  ];

  const {
    orders,
    filteredTimeOrders,
    cities,
    searchQuery,
    setSearchQuery,
    cityFilter,
    setCityFilter,
    toggleCheck,
    confirmChanges,
    changedCount,
    isSaving,
    showSuccess,
  } = useOrders(initialOrdersData, activeTab, timeView);

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  return (
    <div dir="rtl" className="flex min-h-screen overflow-x-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <main className="flex-1 p-4 sm:p-6 md:pr-64 overflow-x-hidden">
        <h2 className="text-2xl font-bold text-center md:text-right text-gray-800 dark:text-gray-100 mr-4 mb-8">
          مدیریت سفارش‌ها
        </h2>

        {/* 🔘 تب‌های اصلی */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-4 justify-center no-scrollbar">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3 py-1.5 text-sm sm:px-5 sm:py-2 sm:text-base rounded-full font-semibold border transition cursor-pointer flex items-center gap-2
              ${activeTab === "orders"
                ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800 border-gray-300 dark:border-indigo-600 shadow-md shadow-indigo-300 dark:shadow-indigo-500 scale-105 text-gray-800 dark:text-white/90"
                : "bg-white dark:bg-white/80 hover:bg-sky-100 dark:hover:bg-white/95 border-gray-200 shadow-lg text-gray-800"
              }`}
          >
            <ClipboardList size={18} />
            مدیریت سفارش‌ها
            {activeTab === "orders" && changedCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-1 animate-pulse">
                {changedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("time")}
            className={`px-3 py-1.5 text-sm sm:px-5 sm:py-2 sm:text-base rounded-full font-semibold border transition cursor-pointer flex items-center gap-2
              ${activeTab === "time"
                ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800 border-gray-300 dark:border-indigo-600 shadow-md shadow-indigo-300 dark:shadow-indigo-500 scale-105 text-gray-800 dark:text-white/90"
                : "bg-white dark:bg-white/80 hover:bg-sky-100 dark:hover:bg-white/95 border-gray-200 shadow-lg text-gray-800"
              }`}
          >
            <Clock size={18} />
            مدیریت زمان
          </button>
        </div>

        {/* محتوای تب‌ها */}
        {activeTab === "orders" ? (
          // 🎯 نمایش ManageOrders با ۶ تب داخلی
          <ManageOrders
            orders={orders}
            cities={cities}
            cityFilter={cityFilter}
            setCityFilter={setCityFilter}
            toggleCheck={toggleCheck}
            onRowClick={openModal}
          />
        ) : (
          // 🎯 نمایش مدیریت زمان (همانند قبل)
          <div>
            {/* زیرتب‌های امروز/ماه */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-4 justify-center no-scrollbar">
              <button
                onClick={() => setTimeView("today")}
                className={`px-3 py-1.5 text-sm sm:px-5 sm:py-2 sm:text-base rounded-full font-semibold border transition cursor-pointer flex items-center gap-2
                  ${timeView === "today"
                    ? "bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-700 dark:to-emerald-800 border-gray-300 dark:border-emerald-600 shadow-md shadow-emerald-300 dark:shadow-emerald-500 scale-105 text-gray-800 dark:text-white/90"
                    : "bg-white dark:bg-white/80 hover:bg-emerald-100 dark:hover:bg-white/95 border-gray-200 shadow-lg text-gray-800"
                  }`}
              >
                <Clock size={16} />
                امروز
              </button>
              <button
                onClick={() => setTimeView("monthly")}
                className={`px-3 py-1.5 text-sm sm:px-5 sm:py-2 sm:text-base rounded-full font-semibold border transition cursor-pointer flex items-center gap-2
                  ${timeView === "monthly"
                    ? "bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-700 dark:to-blue-800 border-gray-300 dark:border-blue-600 shadow-md shadow-blue-300 dark:shadow-blue-500 scale-105 text-gray-800 dark:text-white/90"
                    : "bg-white dark:bg-white/80 hover:bg-blue-100 dark:hover:bg-white/95 border-gray-200 shadow-lg text-gray-800"
                  }`}
              >
                <Calendar size={16} />
                ماه جاری
              </button>
            </div>

            {/* عنوان */}
            <div className="flex items-center justify-between mb-4 px-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                {timeView === "today" ? "سفارش‌های امروز" : "سفارش‌های ماه جاری"}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mr-2">
                  ({filteredTimeOrders.length} مورد)
                </span>
              </h3>
            </div>

            {/* 🔍 جستجو */}
            <div className="mb-6 flex justify-center px-4">
              <div className="w-full max-w-md">
                <Search
                  value={searchQuery}
                  onChange={setSearchQuery}
                  items={searchQuery ? filteredTimeOrders : []}
                  placeholder="نام، آدرس یا شماره همراه"
                  onSelect={openModal}
                  renderItem={(order) => (
                    <div className="flex flex-col text-sm">
                      <span className="font-medium">{order.name}</span>
                      <span className="text-xs text-gray-500">
                        {order.phone} — {order.address}
                      </span>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* جدول */}
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mx-4">
              <OrdersTable
                orders={filteredTimeOrders}
                cities={cities}
                cityFilter={cityFilter}
                setCityFilter={setCityFilter}
                toggleCheck={toggleCheck}
                activeSection={timeView}
                onRowClick={openModal}
                showCheckbox={false}
              />
            </div>
          </div>
        )}

        {/* دکمه ثبت تغییرات فقط در تب مدیریت سفارش‌ها وقتی سفارش انتخاب شده */}
        {activeTab === "orders" && changedCount > 0 && !showSuccess && (
          <button
            onClick={confirmChanges}
            disabled={isSaving}
            className="fixed bottom-5 left-5 z-50"
          >
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500 text-white shadow-lg transition-transform hover:scale-105">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full animate-ping bg-white/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              {isSaving ? "در حال ثبت..." : "ثبت تغییرات"}
              <span className="min-w-[20px] h-5 px-1 rounded-full bg-white text-emerald-600 text-xs font-bold flex items-center justify-center">
                {changedCount}
              </span>
            </div>
          </button>
        )}

        {showSuccess && (
          <div className="fixed bottom-5 left-5 w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg animate-bounce">
            <Check size={20} />
          </div>
        )}

        <OrderModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </main>
    </div>
  );
}

/* ================= HOOK ================= */

function useOrders(initialData, activeTab, timeView) {
  const [orders, setOrders] = useState(initialData);
  const [cityFilter, setCityFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);
  
  const cities = Array.from(new Set(orders.map((o) => o.city)));

  // فیلتر برای تب زمان (امروز/ماه)
  const filteredTimeOrders = useMemo(() => {
    if (activeTab !== "time") return [];
    
    let result = orders;
    if (timeView === "today") {
      result = result.filter((o) => o.date === today);
    } else {
      result = result.filter((o) => o.date.startsWith(currentMonth));
    }
    
    if (cityFilter) {
      result = result.filter((o) => o.city === cityFilter);
    }
    
    if (searchQuery) {
      result = result.filter((o) => 
        [o.name, o.phone, o.address].some((v) => v && v.includes(searchQuery))
      );
    }
    
    return result;
  }, [orders, activeTab, timeView, cityFilter, searchQuery, today, currentMonth]);

  // شمارش تغییرات (فقط برای تب مدیریت سفارش‌ها)
  const changedCount = useMemo(() => {
    return orders.filter((o) => o.isChecked).length;
  }, [orders]);

  const toggleCheck = (id) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, isChecked: !o.isChecked } : o
      )
    );
  };

  const confirmChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      // تغییر وضعیت سفارشات انتخاب شده
      setOrders((prev) =>
        prev.map((o) => {
          if (o.isChecked) {
            // منطق تغییر وضعیت: new -> inProgress -> done
            if (o.status === "new") return { ...o, status: "inProgress", isChecked: false };
            if (o.status === "inProgress") return { ...o, status: "done", isChecked: false };
            if (o.status === "done") return { ...o, status: "delivered", isChecked: false };
          }
          return o;
        })
      );
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1200);
    }, 800);
  };

  return {
    orders,
    filteredTimeOrders,
    cities,
    cityFilter,
    setCityFilter,
    searchQuery,
    setSearchQuery,
    toggleCheck,
    confirmChanges,
    changedCount,
    isSaving,
    showSuccess,
  };
}
