import { useState, useMemo, useRef, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Sidebar from "./Sidebar";
import OrderModal from "./OrderModal";
import jalaali from "jalaali-js";

export default function AdminOrders() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // پیش‌فرض باز باشه در لپ‌تاپ
  const [activeMenu, setActiveMenu] = useState("orders");

  const [orders, setOrders] = useState([
    {
      id: 1,
      city: "تهران",
      date: "2025-11-01",
      price: 450000,
      status: "انجام شده",
      phone: "09121234567",
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
    if (sortKey === key)
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
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
              status: o.status === "انجام شده" ? "انجام نشده" : "انجام شده",
            }
          : o
      )
    );
  };

  const sortedOrders = useMemo(() => {
    let copy = [...orders];
    if (cityFilter) copy = copy.filter((o) => o.city === cityFilter);

    copy.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (sortKey === "date") {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      if (sortKey === "price" || sortKey === "id") {
        valA = Number(valA);
        valB = Number(valB);
      }
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return copy;
  }, [orders, sortKey, sortOrder, cityFilter]);

  const formatJalaali = (date) => {
    const d = new Date(date);
    const { jm, jd } = jalaali.toJalaali(d);
    return `${jm}/${jd}`;
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-row-reverse min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* سایدبار */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      {/* محتوای اصلی */}
      <main
        dir="rtl"
        className={`flex-1 p-4 transition-all duration-300 ${
          isSidebarOpen
            ? "lg:mr-64 md:mr-56 sm:mr-0" // فاصله مناسب برای اندازه‌های مختلف
            : "mr-0"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            مدیریت سفارش‌ها
          </h1>

          {/* دکمه باز و بسته کردن سایدبار در حالت موبایل */}
          <button
            onClick={() => setIsSidebarOpen((p) => !p)}
            className="block lg:hidden text-gray-700 dark:text-gray-200 border p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ☰
          </button>
        </div>

        {/* جدول */}
        <div className="rounded-2xl shadow-lg dark:shadow-gray-700 overflow-hidden bg-white dark:bg-gray-900 relative">
          <table className="min-w-full text-sm text-right dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th
                  className="p-3 cursor-pointer select-none"
                  onClick={() => toggleSort("id")}
                >
                  شماره سفارش{" "}
                  {sortKey === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>

                <th className="p-3 relative">
                  <div ref={dropdownRef} className="flex justify-start relative">
                    <button
                      onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                      className="flex items-center gap-1 px-3 py-1 text-sm border rounded-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                    >
                      {cityFilter || "همه شهرها"}
                      {cityDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    {cityDropdownOpen && (
                      <ul className="absolute mt-1 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md w-40 max-h-60 overflow-y-auto border dark:border-gray-700 transition-all duration-200">
                        <li
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => {
                            setCityFilter("");
                            setCityDropdownOpen(false);
                          }}
                        >
                          همه شهرها
                        </li>
                        {cities.map((city) => (
                          <li
                            key={city}
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => {
                              setCityFilter(city);
                              setCityDropdownOpen(false);
                            }}
                          >
                            {city}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </th>

                <th
                  className="p-3 cursor-pointer select-none"
                  onClick={() => toggleSort("date")}
                >
                  تاریخ{" "}
                  {sortKey === "date" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  className="p-3 cursor-pointer select-none"
                  onClick={() => toggleSort("price")}
                >
                  مبلغ{" "}
                  {sortKey === "price" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr
                  key={order.id}
                  className={`border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 cursor-pointer ${
                    order.status === "انجام شده"
                      ? "bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800"
                      : "bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800"
                  }`}
                  onClick={() => openModal(order)}
                >
                  <td className="p-3 flex items-center justify-between break-words">
                    <span>{order.id}</span>
                    <input
                      type="checkbox"
                      checked={order.status === "انجام شده"}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleStatus(order.id);
                      }}
                      className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-600"
                    />
                  </td>
                  <td className="p-3 break-words">{order.city}</td>
                  <td className="p-3 break-words">
                    {formatJalaali(order.date)}
                  </td>
                  <td className="p-3 break-words">
                    {order.price.toLocaleString()} تومان
                  </td>
                </tr>
              ))}
              {sortedOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="p-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    هیچ سفارشی یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* مودال جزئیات سفارش */}
        <OrderModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </main>
    </div>
  );
}
