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
  FiChevronRight
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const allMenuItems = [
    { label: "داشبورد", icon: <FiLayout />, key: "dashboard" },
    { label: "سفارش‌ها", icon: <FiHome />, key: "orders" },
    { label: "مشتریان", icon: <FiUsers />, key: "customers" },
    { label: "خدمات", icon: <FiPackage />, key: "services" },
    { label: "دسته‌بندی‌ها", icon: <FiGrid />, key: "categories" },
    { label: "تخفیف‌ها", icon: <FiTag />, key: "discounts" },
    { label: "گزارش‌ها", icon: <FiBarChart />, key: "reports" },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

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
          fixed right-0 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 z-50
          ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
          md:translate-x-0
        `}
        style={{
          top: 0,
          height: "100vh",
        }}
      >
        <div className="flex flex-col h-full">
          {/* عنوان + دکمه بستن موبایل */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              پنل مدیریت
            </h1>

{/* دکمه بستن فقط موبایل با انیمیشن fade + slide */}
<button
  onClick={() => setIsSidebarOpen(false)}
  className={`
    md:hidden p-1 rounded transition-all duration-300
    ${isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}
    hover:bg-gray-200 dark:hover:bg-gray-700
    absolute top-4 left-4
  `}
>
  <FiChevronRight size={24} className="text-gray-800 dark:text-gray-200" />
</button>


          </div>

          {/* آیتم‌های منو */}
          <nav className="flex-1 overflow-y-auto text-gray-800 dark:text-gray-200 px-4 py-2">
            {allMenuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveMenu(item.key);
                  setIsSidebarOpen(false);
                }}
                className={`
                  flex items-center gap-2 w-full px-3 py-3 rounded text-right transition-all duration-200
                  ${
                    activeMenu === item.key
                      ? "bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white font-semibold"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  }
                  md:py-2.5 md:gap-3 md:mb-3
                `}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>

          {/* پایین سایدبار */}
          <div className="border-t px-4 pt-2 flex flex-col gap-3">
            {/* سوئیچ تم دسکتاپ (iOS style) */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                حالت {theme === "dark" ? "تاریک" : "روشن"}
              </span>

              <button
                onClick={toggleTheme}
                className={`
                  relative w-14 h-8 rounded-full p-1 transition-all duration-300
                  ${theme === "dark" ? "bg-blue-600" : "bg-gray-300"}
                `}
              >
                <span
                  className={`
                    absolute top-1 left-1 w-6 h-6 rounded-full bg-white flex items-center justify-center
                    transform transition-transform duration-300
                    ${theme === "dark" ? "translate-x-6" : ""}
                  `}
                >
                  {theme === "dark" ? (
                    <FiMoon className="text-blue-700" size={16} />
                  ) : (
                    <FiSun className="text-yellow-500" size={16} />
                  )}
                </span>
              </button>
            </div>

            {/* دکمه خروج */}
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
