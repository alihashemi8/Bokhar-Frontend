import { useState } from "react";
import {
  FiLogOut,
  FiHome,
  FiUsers,
  FiPackage,
  FiTag,
  FiBarChart,
  FiGrid,
  FiLayout,
  FiMenu,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const allMenuItems = [
    { label: "داشبورد", icon: <FiLayout />, key: "dashboard" },
    { label: "سفارش‌ها", icon: <FiHome />, key: "admin-dashboard/orders" },
    { label: "مشتریان", icon: <FiUsers />, key: "customers" },
    { label: "خدمات", icon: <FiPackage />, key: "services" },
    { label: "دسته‌بندی‌ها", icon: <FiGrid />, key: "categories" },
    { label: "تخفیف‌ها", icon: <FiTag />, key: "discounts" },
    { label: "گزارش‌ها", icon: <FiBarChart />, key: "reports" },
  ];

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div dir="rtl" className="relative h-screen flex">
      {/* دکمه همبرگر موبایل */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 bg-blue-900 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FiMenu size={24} />
      </button>

      {/* Overlay موبایل */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed right-0 w-64 bg-white dark:bg-gray-800 md:my-15.5 shadow-xl transform transition-transform duration-300 z-50
          ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } md:translate-x-0
        `}
        style={{ top: 0, height: "100vh" }}
      >
        <div className="flex flex-col h-full">
          <h1 className="text-2xl font-bold p-4 border-b text-blue-700 dark:text-blue-400">
            پنل مدیریت
          </h1>

          <nav className="flex-1 overflow-y-auto text-gray-800 dark:text-gray-200 px-4 py-2">
            {allMenuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveMenu(item.key);
                  setIsSidebarOpen(false);
                  navigate(`/${item.key}`);
                }}
                className={`
                  flex items-center gap-2 w-full px-3 py-3 rounded text-right transition-all duration-200
                  ${
                    activeMenu === item.key
                      ? "bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white font-semibold"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  } md:py-4 md:gap-3 md:mb-3
                `}
              >
                {item.icon} {item.label}
              </button>
            ))}

            {/* تغییر تم در موبایل */}
            <div className="px-4 py-3 flex items-center justify-between md:hidden">
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                حالت {theme === "dark" ? "تاریک" : "روشن"}
              </span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                {theme === "dark" ? (
                  <FiSun className="text-yellow-400" size={20} />
                ) : (
                  <FiMoon className="text-gray-600" size={20} />
                )}
              </button>
            </div>
          </nav>

          {/* دکمه خروج */}
          <div className="border-t p-4 md:sticky md:bottom-0 md:bg-white dark:md:bg-gray-800">
            <button
              className="flex items-center gap-2 w-full justify-start hover:bg-gray-200 dark:hover:bg-gray-700 
                                text-red-600 dark:text-red-400 font-semibold p-2 rounded transition-all duration-200"
            >
              <FiLogOut /> خروج
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
