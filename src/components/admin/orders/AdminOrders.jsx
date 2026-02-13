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
      {/* سایدبار دسکتاپ */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      {/* منوی موبایل */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded bg-gray-200 dark:bg-gray-700"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* overlay موبایل */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 bg-opacity-40 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* محتوای اصلی */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 md:mr-64 lg:mr-64">
        <h1 className="text-2xl font-bold text-center md:text-start">
          مدیریت سفارش‌ها
        </h1>

        {/* 🔹 Search */}
        <div className="mt-4 max-w-md mx-auto md:mx-0">
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

        {/* 🔹 KPI ها */}
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

        {/* 🔹 تب‌ها */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {[
            { key: "new", label: "جدید" },
            { key: "inProgress", label: "در حال انجام" },
            { key: "done", label: "انجام شده" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-2xl font-medium transition ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-sky-50 via-sky-100 to-sky-200 shadow-indigo-300 text-gray-800 shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 shadow-md hover:shadow-xl"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* جدول سفارش‌ها */}
        <div className=" overflow-x-auto">
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

        {/* Confirm Button */}
        {changedCount > 0 && !showSuccess && (
          <button
            dir="ltr"
            onClick={confirmChanges}
            disabled={isSaving}
            className="fixed bottom-5 left-5 z-50 animate-fab-in"
          >
            <div className="flex flex-row-reverse items-center gap-3 px-4 py-2 rounded-full bg-emerald-500 text-white shadow-lg transition-transform duration-300 ease-out hover:scale-105">
              <span className="pulse-dot"></span>
              {isSaving ? "در حال ثبت..." : "ثبت تغییرات"}
              <span className="bg-white text-emerald-600 text-xs px-2 rounded-full">
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
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
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
    if (cityFilter) copy = copy.filter((o) => o.city === cityFilter);
    return copy;
  }, [orders, activeTab, cityFilter]);

  useMemo(() => {
    setChangedCount(
      orders.filter((o) => o.stage === activeTab && o.isChecked).length,
    );
  }, [orders, activeTab]);

  const toggleSort = (key) => {
    setSortKey(key);
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return {
    filteredOrders,
    cities,
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
    searchQuery: "",
    setSearchQuery: () => {},
  };
}
