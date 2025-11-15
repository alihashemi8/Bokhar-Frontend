import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import { FiUsers, FiShoppingCart, FiTag, FiPackage } from "react-icons/fi";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  // synchronize activeMenu with URL so refresh/direct-link keeps highlight correct
  useEffect(() => {
    // location.pathname مثل "/admin-dashboard/orders"
    const pathSegment = location.pathname.replace("/admin-dashboard", "").replace(/^\//, "");
    setActiveMenu(pathSegment || "dashboard");
  }, [location]);

  const cards = [
    {
      title: "سفارش‌ها",
      icon: <FiShoppingCart size={26} />,
      count: 128,
      color: "from-blue-500 to-cyan-400",
      link: "/admin-dashboard/orders",
    },
    {
      title: "مشتریان",
      icon: <FiUsers size={26} />,
      count: 54,
      color: "from-purple-500 to-pink-400",
      link: "/admin-dashboard/customers",
    },
    {
      title: "تخفیف‌ها",
      icon: <FiTag size={26} />,
      count: 8,
      color: "from-green-500 to-emerald-400",
      link: "/admin-dashboard/discounts",
    },
    {
      title: "خدمات",
      icon: <FiPackage size={26} />,
      count: 42,
      color: "from-orange-500 to-yellow-400",
      link: "/admin-dashboard/services",
    },
  ];

  const orders = [
    { id: 101, name: "علی رضایی", total: "250,000 تومان", status: "تحویل‌شده" },
    { id: 102, name: "سارا محمدی", total: "180,000 تومان", status: "در حال آماده‌سازی" },
    { id: 103, name: "مهدی کریمی", total: "90,000 تومان", status: "لغوشده" },
  ];

  return (
    <div
      dir="rtl"
      className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="flex flex-1">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        <main
          className={`flex-1 p-6 overflow-y-auto text-gray-800 dark:text-gray-100 transition-all duration-300
            ${!isSidebarOpen ? "md:mr-64" : ""}`}
        >
          <h1 className="text-2xl font-bold mb-8 text-right">داشبورد مدیریت</h1>

          {/* کارت‌ها */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {cards.map((card, i) => (
              <div
                key={i}
                onClick={() => card.link && navigate(card.link)}
                className={`p-5 rounded-2xl bg-white/10 dark:bg-white/10 backdrop-blur-lg 
                border border-white/20 hover:bg-white/20 transition-all cursor-pointer shadow-lg 
                hover:scale-[1.03] active:scale-[0.98]`}
              >
                <div
                  className={`w-12 h-12 mb-3 flex items-center justify-center rounded-full 
                  bg-gradient-to-br ${card.color} text-white`}
                >
                  {card.icon}
                </div>
                <h2 className="text-lg font-semibold">{card.title}</h2>
                <p className="text-2xl font-bold mt-2">{card.count}</p>
              </div>
            ))}
          </div>

          {/* جدول سفارش‌ها */}
          <div className="bg-white/10 dark:bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">
              آخرین سفارش‌ها
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-right">
                <thead className="text-gray-300 border-b border-white/10">
                  <tr>
                    <th className="p-3">شماره سفارش</th>
                    <th className="p-3">نام مشتری</th>
                    <th className="p-3">مبلغ کل</th>
                    <th className="p-3">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-white/10 transition border-b border-white/5"
                    >
                      <td className="p-3">{order.id}</td>
                      <td className="p-3">{order.name}</td>
                      <td className="p-3">{order.total}</td>
                      <td
                        className={`p-3 ${
                          order.status === "تحویل‌شده"
                            ? "text-green-400"
                            : order.status === "لغوشده"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {order.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
