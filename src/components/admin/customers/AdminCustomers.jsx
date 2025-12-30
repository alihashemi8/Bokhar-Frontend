import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { FiSearch, FiUser, FiUsers, FiStar } from "react-icons/fi";

// ----------- Hook برای داده‌ها ----------
function useCustomers() {
  const [customers] = useState([
    { id: 1, name: "علی رضایی", phone: "09121234567", type: "vip", orders: 12 },
    { id: 2, name: "سارا محمدی", phone: "09351239811", type: "active", orders: 3 },
    { id: 3, name: "محمد کریمی", phone: "09132223344", type: "inactive", orders: 0 },
    { id: 4, name: "مهسا سلطانی", phone: "09012225566", type: "active", orders: 5 },
  ]);
  return customers;
}

// ----------- کامپوننت کارت مشتری ----------
function CustomerCard({ customer, onClick }) {
  const { name, phone, type, orders } = customer;
  const typeColor =
    type === "vip" ? "bg-yellow-100 text-yellow-700" :
    type === "active" ? "bg-green-100 text-green-700" :
    "bg-red-100 text-red-700";

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-2xl transition transform duration-300 hover:-translate-y-1 hover:scale-[1.01]"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">{name}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColor}`}>
          {type === "vip" ? "VIP" : type === "active" ? "فعال" : "غیرفعال"}
        </span>
      </div>
      <div className="flex justify-between text-gray-600 dark:text-gray-300">
        <span>شماره: {phone}</span>
        <span>سفارش‌ها: {orders}</span>
      </div>
    </div>
  );
}

// ----------- کامپوننت اصلی ----------
export default function AdminCustomers() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("customers");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const navigate = useNavigate();
  const customers = useCustomers();

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return customers.filter(c => {
      const matchCategory = activeTab === "all" || c.type === activeTab;
      const matchSearch = c.name.toLowerCase().includes(query) || c.phone.includes(query);
      return matchCategory && matchSearch;
    });
  }, [search, activeTab, customers]);

  return (
    <div dir="RTL" className="flex flex-col min-h-screen transition-colors duration-300">
      <div className="flex flex-1">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        <main className={`flex-1 p-6 md:p-8 overflow-y-auto transition-all duration-300 ${!isSidebarOpen ? "md:mr-64" : ""}`}>
          <h1 className="text-3xl md:text-4xl text-center md:text-start font-extrabold mb-6 md:mb-8 text-gray-900 dark:text-gray-100 tracking-wide">
            مشتریان
          </h1>

          {/* تب‌ها و سرچ */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "all", label: "همه", icon: <FiUsers /> },
                { key: "active", label: "فعال", icon: <FiUser /> },
                { key: "inactive", label: "غیرفعال", icon: <FiUser /> },
                { key: "vip", label: "VIP", icon: <FiStar /> },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    flex items-center gap-2 px-2 py-2 rounded-full transition-all duration-300 border font-semibold
                    ${activeTab === tab.key
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-indigo-300 border-1 border-gray-300 transform scale-105"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:shadow-lg hover:scale-105"
                    }`}
                  aria-pressed={activeTab === tab.key}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-1/3">
              <FiSearch className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500" size={22} />
              <input
                type="text"
                placeholder="جستجو بر اساس نام یا شماره..."
                className="w-full p-3 pl-12 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition transform duration-200 hover:scale-[1.01]"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* کارت‌های مشتریان */}
          {filtered.length === 0 ? (
            <div className="text-center p-8 text-gray-400 dark:text-gray-500 text-lg">
              مشتری‌ای یافت نشد.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(c => (
                <CustomerCard
                  key={c.id}
                  customer={c}
                  onClick={() => navigate(`/admin-dashboard/customers/${c.id}/transactions`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
