import { useState, useMemo } from "react";
import Sidebar from "./Sidebar";
import OrderModal from "./OrderModal";
import KPICard from "./reports/KPICard";
import Search from "./Search";

export default function AdminOrders() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("orders");

  const [orders, setOrders] = useState([
    {
      id: 1,
      city: "تهران",
      date: "2025-11-01",
      price: 450000,
      status: "انجام شده",
      phone: "09381234567",
      address: "خیابان ولیعصر",
      name: "علی",
      deliveryDate: "2025-11-03",
    },
    {
      id: 2,
      city: "مشهد",
      date: "2025-10-28",
      price: 200000,
      status: "انجام نشده",
      phone: "09129876543",
      address: "خیابان امام رضا",
      name: "سارا",
      deliveryDate: "2025-11-02",
    },
    {
      id: 3,
      city: "اصفهان",
      date: "2025-10-30",
      price: 300000,
      status: "انجام نشده",
      phone: "09122334455",
      address: "چهارباغ",
      name: "مهدی",
      deliveryDate: "2025-11-04",
    },
    {
      id: 4,
      city: "تهران",
      date: "2025-10-31",
      price: 150000,
      status: "انجام شده",
      phone: "09123456789",
      address: "تهرانپارس",
      name: "نرگس",
      deliveryDate: "2025-11-05",
    },
  ]);

  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [cityFilter, setCityFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const cities = Array.from(new Set(orders.map((o) => o.city)));

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const toggleStatus = (id) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status:
                o.status === "انجام شده" ? "انجام نشده" : "انجام شده",
            }
          : o
      )
    );
  };

  const sortedOrders = useMemo(() => {
    let copy = [...orders];

    if (cityFilter) {
      copy = copy.filter((o) => o.city === cityFilter);
    }

    if (searchQuery) {
      const q = searchQuery.trim();

      copy = copy.filter(
        (o) =>
          o.name.includes(q) ||
          o.address.includes(q) ||
          o.phone.includes(q)
      );
    }

    copy.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (sortKey === "date" || sortKey === "deliveryDate") {
        valA = new Date(valA);
        valB = new Date(valB);
      }

      if (sortKey === "price" || sortKey === "id") {
        valA = Number(valA);
        valB = Number(valB);
      }

      return sortOrder === "asc" ? valA - valB : valB - valA;
    });

    return copy;
  }, [orders, sortKey, sortOrder, cityFilter, searchQuery]);

  const remainingDays = (date) => {
    const today = new Date();
    const delivery = new Date(date);
    const diff = Math.ceil(
      (delivery - today) / (1000 * 60 * 60 * 24)
    );
    return diff >= 0 ? diff : 0;
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  // KPI
  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.date === today).length;
  const todayUndelivered = orders.filter(
    (o) => o.deliveryDate === today && o.status !== "انجام شده"
  ).length;
  const totalOrders = orders.length;

  return (
    <div dir="rtl" className="flex flex-row-reverse min-h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <main className="flex-1 p-4 lg:mr-64 md:mr-56 mr-0 max-w-full">
        <h1 className="text-2xl font-bold text-center md:text-start text-gray-800 dark:text-gray-200">
          مدیریت سفارش‌ها
        </h1>

        {/* KPI */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <KPICard title="سفارش‌های امروز" value={todayOrders} />
          <KPICard title="تحویل‌نشده‌های امروز" value={todayUndelivered} />
          <KPICard title="کل سفارش‌ها" value={totalOrders} />
        </div>

        {/* Search */}
        <div className="mt-4 max-w-md mx-auto">
          <Search
            value={searchQuery}
            onChange={setSearchQuery}
            items={searchQuery ? sortedOrders : []}
            placeholder="نام، آدرس یا شماره همراه"
            onSelect={(order) => openModal(order)}
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

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-right">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-3">شماره سفارش</th>
                  <th className="p-3">نام مشتری</th>
                  <th className="p-3">
                    <select
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="p-1 rounded border dark:bg-gray-700"
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
                    className="p-3 cursor-pointer"
                    onClick={() => toggleSort("deliveryDate")}
                  >
                    مهلت
                  </th>
                  <th
                    className="p-3 cursor-pointer"
                    onClick={() => toggleSort("price")}
                  >
                    مبلغ
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => openModal(order)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="p-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(order.id);
                        }}
                        className={`px-4 py-2 rounded-xl font-bold transition
                          ${
                            order.status === "انجام شده"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {order.id}
                      </button>
                    </td>
                    <td className="p-3">{order.name}</td>
                    <td className="p-3">{order.city}</td>
                    <td className="p-3">
                      {remainingDays(order.deliveryDate)} روز
                    </td>
                    <td className="p-3">
                      {order.price.toLocaleString()} تومان
                    </td>
                  </tr>
                ))}

                {sortedOrders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-400">
                      هیچ سفارشی یافت نشد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <OrderModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </main>
    </div>
  );
}
