import { useState, useMemo } from "react";
import { Check, Menu } from "lucide-react";
import Sidebar from "../Sidebar";
import OrderModal from "./OrderModal";
import KPICard from "../reports/KPICard";
import Search from "../../Search";
import OrdersTable from "./OrdersTable";

export default function AdminOrders() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("orders");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const initialOrdersData = [
    {
      id: 1,
      city: "تهران",
      date: "2026-02-13",
      price: 450000,
      phone: "09381234567",
      address: "خیابان ولیعصر",
      name: "علی",
      deliveryDate: "2026-02-20",
    },
    {
      id: 2,
      city: "مشهد",
      date: "2026-02-13",
      price: 200000,
      phone: "09129876543",
      address: "خیابان امام رضا",
      name: "سارا",
      deliveryDate: "2026-02-19",
    },
    {
      id: 3,
      city: "اصفهان",
      date: "2026-02-12",
      price: 300000,
      phone: "09122334455",
      address: "چهارباغ",
      name: "مهدی",
      deliveryDate: "2026-02-22",
    },
    {
      id: 4,
      city: "تهران",
      date: "2026-02-10",
      price: 150000,
      phone: "09123456789",
      address: "تهرانپارس",
      name: "نرگس",
      deliveryDate: "2026-02-15",
    },
  ];

  const {
    filteredOrders,
    cities,
    searchQuery,
    setSearchQuery,
    cityFilter,
    setCityFilter,
    toggleSort,
    toggleCheck,
    confirmChanges,
    changedCount,
    isSaving,
    showSuccess,
    activeTab,
    setActiveTab,
  } = useOrders(initialOrdersData);

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div dir="rtl" className="flex min-h-screen overflow-x-hidden">
      {/* سایدبار */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      {/* محتوای اصلی */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 md:mr-64">
        <h1 className="text-2xl font-bold text-center md:text-start">
          مدیریت سفارش‌ها
        </h1>

        {/* KPI */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <KPICard
            title="سفارش‌های امروز"
            value={filteredOrders.filter((o) => o.date === today).length}
          />
          <KPICard
            title="تحویل‌نشده‌های امروز"
            value={
              filteredOrders.filter(
                (o) => o.deliveryDate === today && o.stage !== "done",
              ).length
            }
          />
          <KPICard title="کل سفارش‌ها" value={filteredOrders.length} />
        </div>

        {/* 🔍 Search (وسط‌چین کامل) */}
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-md">
            <Search
              value={searchQuery}
              onChange={setSearchQuery}
              items={searchQuery ? filteredOrders : []}
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

        {/* تب‌ها */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {[
            { key: "new", label: "جدید" },
            { key: "inProgress", label: "در حال انجام" },
            { key: "done", label: "انجام شده" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-2xl font-medium transition border shadow-md ${
                activeTab === tab.key
                 ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800 border border-gray-300 dark:border-indigo-600 dark:text-white/90 shadow-lg shadow-indigo-300 text-gray-800 scale-105"
                  : "bg-white dark:bg-white/80 hover:bg-sky-100 dark:hover:bg-white/95 border border-gray-200 shadow-lg text-gray-800 "
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* جدول */}
        <div className="overflow-x-auto">
          <OrdersTable
            orders={filteredOrders}
            cities={cities}
            cityFilter={cityFilter}
            setCityFilter={setCityFilter}
            toggleSort={toggleSort}
            toggleCheck={toggleCheck}
            activeTab={activeTab}
            onRowClick={openModal}
          />
        </div>

        {changedCount > 0 && !showSuccess && (
          <button
            onClick={confirmChanges}
            disabled={isSaving}
            className="fixed bottom-5 left-5 z-50 animate-fab-in"
          >
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500 text-white shadow-lg transition-transform hover:scale-105">
              {/* نقطه پالس‌دار */}
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full animate-ping bg-white/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>

              {isSaving ? "در حال ثبت..." : "ثبت تغییرات"}

              {/* شمارنده */}
              <span className="min-w-[20px] h-5 px-1 rounded-full bg-white text-emerald-600 text-xs font-bold flex items-center justify-center">
                {changedCount}
              </span>
            </div>
          </button>
        )}

        {showSuccess && (
          <div className="fixed bottom-5 left-5 w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center">
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

function useOrders(initialData) {
  const [orders, setOrders] = useState(
    initialData.map((o) => ({
      ...o,
      stage: "new",
      isChecked: false,
    })),
  );

  const [activeTab, setActiveTab] = useState("new");
  const [cityFilter, setCityFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [changedCount, setChangedCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const cities = Array.from(new Set(orders.map((o) => o.city)));

  const toggleCheck = (id) => {
    if (activeTab === "done") return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id && o.stage === activeTab
          ? { ...o, isChecked: !o.isChecked }
          : o,
      ),
    );
  };

  const confirmChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.stage === "new" && o.isChecked)
            return { ...o, stage: "inProgress", isChecked: false };
          if (o.stage === "inProgress" && o.isChecked)
            return { ...o, stage: "done", isChecked: false };
          return o;
        }),
      );
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1200);
    }, 800);
  };

  const filteredOrders = useMemo(() => {
    let copy = orders.filter((o) => o.stage === activeTab);

    if (cityFilter) {
      copy = copy.filter((o) => o.city === cityFilter);
    }

    if (searchQuery) {
      copy = copy.filter((o) =>
        [o.name, o.phone, o.address].some((v) => v.includes(searchQuery)),
      );
    }

    return copy;
  }, [orders, activeTab, cityFilter, searchQuery]);

  useMemo(() => {
    setChangedCount(
      orders.filter((o) => o.stage === activeTab && o.isChecked).length,
    );
  }, [orders, activeTab]);

  return {
    filteredOrders,
    cities,
    cityFilter,
    setCityFilter,
    searchQuery,
    setSearchQuery,
    toggleSort: () => {},
    toggleCheck,
    confirmChanges,
    changedCount,
    isSaving,
    showSuccess,
    activeTab,
    setActiveTab,
  };
}
