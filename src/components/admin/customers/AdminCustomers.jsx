import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { FiSearch, FiUser, FiUsers, FiStar } from "react-icons/fi";

export default function AdminCustomers() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("customers");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const navigate = useNavigate();

  // داده‌های نمونه مشتریان
  const customers = [
    { id: 1, name: "علی رضایی", phone: "09121234567", type: "vip", orders: 12 },
    { id: 2, name: "سارا محمدی", phone: "09351239811", type: "active", orders: 3 },
    { id: 3, name: "محمد کریمی", phone: "09132223344", type: "inactive", orders: 0 },
    { id: 4, name: "مهسا سلطانی", phone: "09012225566", type: "active", orders: 5 },
  ];

  // فیلتر دسته‌بندی + سرچ
  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchCategory = activeTab === "all" || c.type === activeTab;
      const matchSearch = c.name.includes(search) || c.phone.includes(search);
      return matchCategory && matchSearch;
    });
  }, [search, activeTab]);

  return (
    <div
      dir="RTL"
      className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="flex flex-1">
        {/* سایدبار */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        {/* محتوای اصلی */}
        <main
          className={`flex-1 p-6 overflow-y-auto text-gray-800 dark:text-gray-100 transition-all duration-300
            ${!isSidebarOpen ? "md:mr-64" : ""}`}
        >
          <h1 className="text-2xl font-bold mb-6">مشتریان</h1>

          {/* سرچ */}
          <div className="relative mb-6 w-full max-w-md">
            <FiSearch className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="جستجو بر اساس نام یا شماره..."
              className="w-full p-3 pr-4 pl-10 rounded-xl bg-white dark:bg-gray-800 border 
              border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 
              focus:ring-blue-500 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* دسته‌بندی‌ها */}
          <div className="flex gap-3 mb-6 overflow-x-auto">
            {[
              { key: "all", label: "همه", icon: <FiUsers /> },
              { key: "active", label: "فعال", icon: <FiUser /> },
              { key: "inactive", label: "غیرفعال", icon: <FiUser /> },
              { key: "vip", label: "VIP", icon: <FiStar /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl transition-all border
                  ${
                    activeTab === tab.key
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* جدول مشتریان */}
          <div
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
          rounded-2xl p-5 shadow-lg overflow-x-auto"
          >
            <table className="min-w-full text-right">
              <thead>
                <tr className="text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-3">نام</th>
                  <th className="p-3">شماره تماس</th>
                  <th className="p-3">نوع مشتری</th>
                  <th className="p-3">سفارش‌ها</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-400">
                      مشتری‌ای یافت نشد.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100/40 dark:hover:bg-gray-700/40 cursor-pointer transition"
                      onClick={() => navigate(`/admin-dashboard/customers/${c.id}/transactions`)}
                    >
                      <td className="p-3 font-medium">{c.name}</td>
                      <td className="p-3">{c.phone}</td>
                      <td className="p-3">
                        {c.type === "vip" ? (
                          <span className="text-yellow-500 font-bold">VIP</span>
                        ) : c.type === "active" ? (
                          <span className="text-green-500">فعال</span>
                        ) : (
                          <span className="text-red-400">غیرفعال</span>
                        )}
                      </td>
                      <td className="p-3">{c.orders}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
