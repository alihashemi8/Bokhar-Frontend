import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiHome,
  FiUsers,
  FiPackage,
  FiTag,
  FiBarChart,
  FiLayout,
  FiMenu,
  FiSun,
  FiMoon,
  FiChevronRight,
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

export default function Sidebar({
  activeMenu,
  setActiveMenu,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  /* =======================
     Lock body scroll (Mobile Safe)
  ======================== */
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    };
  }, [isSidebarOpen]);

  const allMenuItems = [
    { label: "داشبورد", icon: <FiLayout />, key: "dashboard", path: "/admin-dashboard" },
    { label: "سفارش‌ها", icon: <FiHome />, key: "orders", path: "/admin-dashboard/orders" },
    { label: "مشتریان", icon: <FiUsers />, key: "customers", path: "/admin-dashboard/customers" },
    { label: "خدمات", icon: <FiPackage />, key: "services", path: "/admin-dashboard/services" },
    { label: "تخفیف‌ها", icon: <FiTag />, key: "discounts", path: "/admin-dashboard/discounts" },
    { label: "گزارش‌ها", icon: <FiBarChart />, key: "reports", path: "/admin-dashboard/reports" },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50  bg-white/30 dark:bg-white/10 backdrop-blur-lg 
                border border-sky-200/50 hover:bg-white/70 p-2  rounded-lg "
        onClick={() => setIsSidebarOpen(true)}
      >
        <FiMenu size={24} />
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 right-0
          h-[100dvh] w-64
          bg-white dark:bg-gray-800 shadow-xl
          transform transition-transform duration-300 ease-out
          z-50
          ${isSidebarOpen ? "translate-x-0" : "translate-x-full pointer-events-none"}
          md:translate-x-0 md:pointer-events-auto
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-800 text-transparent bg-clip-text">
              خشکشویی افشار
            </h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <FiChevronRight size={24} />
            </button>
          </div>

          {/* Menu (Scrollable) */}
          <nav
            className="
              flex-1 overflow-y-auto
              px-4 py-2
              text-gray-800 dark:text-gray-200
              overscroll-contain
            "
          >
            {allMenuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveMenu(item.key);
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`
                  flex items-center gap-2 w-full px-3 py-3 my-2 rounded text-right
                  transition-all duration-200
                  ${
                    activeMenu === item.key
                      ? "bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white font-semibold"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer (Always Visible) */}
          <div className="border-t px-4 pt-3 pb-safe flex flex-col gap-3 shrink-0">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <span className="font-medium">
                حالت {theme === "dark" ? "تاریک" : "روشن"}
              </span>
              <button
                onClick={toggleTheme}
                className={`relative w-14 h-8 rounded-full p-1 transition-all
                  ${theme === "dark" ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white
                    flex items-center justify-center transition-transform
                    ${theme === "dark" ? "translate-x-6" : ""}`}
                >
                  {theme === "dark" ? <FiMoon size={16} /> : <FiSun size={16} />}
                </span>
              </button>
            </div>

            {/* Logout */}
            <button className="flex items-center gap-2 text-red-600 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded transition">
              <FiLogOut />
              خروج
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
