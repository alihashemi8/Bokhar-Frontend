import { useState, useMemo, useRef, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Sidebar from "./Sidebar";
import OrderModal from "./OrderModal";
import KPICard from "./reports/KPICard"; 
import jalaali from "jalaali-js";

export default function AdminOrders() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("orders");

  const [orders, setOrders] = useState([
    { id: 1, city: "تهران", date: "2025-11-01", price: 450000, status: "انجام شده", phone: "09121234567", address: "خیابان ولیعصر", name: "علی", deliveryDate: "2025-11-03" },
    { id: 2, city: "مشهد", date: "2025-10-28", price: 200000, status: "انجام نشده", phone: "09129876543", address: "خیابان امام رضا", name: "سارا", deliveryDate: "2025-11-02" },
    { id: 3, city: "اصفهان", date: "2025-10-30", price: 300000, status: "انجام نشده", phone: "09122334455", address: "چهارباغ", name: "مهدی", deliveryDate: "2025-11-04" },
    { id: 4, city: "تهران", date: "2025-10-31", price: 150000, status: "انجام شده", phone: "09123456789", address: "تهرانپارس", name: "نرگس", deliveryDate: "2025-11-05" },
  ]);

  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [cityFilter, setCityFilter] = useState("");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const cities = Array.from(new Set(orders.map((o) => o.city)));

  const dropdownRef = useRef();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSort = (key) => {
    if (sortKey === key) setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const toggleStatus = (id) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: o.status === "انجام شده" ? "انجام نشده" : "انجام شده" } : o
      )
    );
  };

  const sortedOrders = useMemo(() => {
    let copy = [...orders];
    if (cityFilter) copy = copy.filter((o) => o.city === cityFilter);

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
  }, [orders, sortKey, sortOrder, cityFilter]);

  const remainingDays = (date) => {
    const today = new Date();
    const delivery = new Date(date);
    const diff = Math.ceil((delivery - today) / (1000 * 60 * 60 * 24));
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

  // ------------------------
  //      KPI CALCULATIONS
  // ------------------------
  const today = new Date().toISOString().slice(0, 10);

  const todayOrders = orders.filter(o => o.date === today).length;

  const todayUndelivered = orders.filter(
    o => o.deliveryDate === today && o.status !== "انجام شده"
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

      <main
        className={`flex-1 p-4 transition-all duration-300 
        ${isSidebarOpen ? "lg:mr-64 md:mr-56" : "lg:mr-64 md:mr-56 mr-0"}`}
      >

        <div className="flex justify-between items-center mt-10">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">مدیریت سفارش‌ها</h1>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <KPICard title="سفارش‌های امروز" value={todayOrders} />
          <KPICard title="تحویل‌نشده‌های امروز" value={todayUndelivered} />
          <KPICard title="کل سفارش‌ها" value={totalOrders} />
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden mt-6">
          <div className="p-4 flex flex-wrap items-center gap-3">
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1 px-3 py-2 border rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              >
                {cityFilter || "همه شهرها"}
                {cityDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              {cityDropdownOpen && (
                <ul className="absolute mt-1 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md w-44 max-h-60 overflow-y-auto border dark:border-gray-700">
                  <li
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => { setCityFilter(""); setCityDropdownOpen(false); }}
                  >
                    همه شهرها
                  </li>
                  {cities.map((city) => (
                    <li
                      key={city}
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => { setCityFilter(city); setCityDropdownOpen(false); }}
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <table className="min-w-full text-sm text-right dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3 cursor-pointer select-none" onClick={() => toggleSort("id")}>
                  شماره سفارش {sortKey === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th className="p-3">نام مشتری</th>
                <th className="p-3 cursor-pointer select-none" onClick={() => toggleSort("city")}>شهر</th>
                <th className="p-3 cursor-pointer select-none" onClick={() => toggleSort("deliveryDate")}>مهلت باقی‌مانده</th>
                <th className="p-3 cursor-pointer select-none" onClick={() => toggleSort("price")}>مبلغ</th>
                <th className="p-3">وضعیت</th>
              </tr>
            </thead>

            <tbody>
              {sortedOrders.map((order) => (
                <tr
                  key={order.id}
                  className={`transition-colors duration-200 cursor-pointer hover:shadow-md ${
                    order.status === "انجام شده"
                      ? "bg-green-50 dark:bg-green-900"
                      : "bg-red-50 dark:bg-red-900"
                  }`}
                  onClick={() => openModal(order)}
                >
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.name}</td>
                  <td className="p-3">{order.city}</td>
                  <td className="p-3">{remainingDays(order.deliveryDate)} روز</td>
                  <td className="p-3">{order.price.toLocaleString()} تومان</td>

                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={order.status === "انجام شده"}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleStatus(order.id);
                      }}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    />
                  </td>
                </tr>
              ))}

              {sortedOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500 dark:text-gray-400">
                    هیچ سفارشی یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <OrderModal order={selectedOrder} isOpen={isModalOpen} onClose={closeModal} />
      </main>
    </div>
  );
}
