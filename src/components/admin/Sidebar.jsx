import {
  FiLogOut,
  FiHome,
  FiUsers,
  FiPackage,
  FiTag,
  FiBarChart,
} from "react-icons/fi";

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  activeMenu,
  setActiveMenu,
}) {
  const menuItems = [
    { label: "سفارش‌ها", icon: <FiHome />, key: "orders" },
    { label: "مشتریان", icon: <FiUsers />, key: "customers" },
    { label: "خدمات", icon: <FiPackage />, key: "services" },
    { label: "تخفیف‌ها", icon: <FiTag />, key: "discounts" },
    { label: "گزارش‌ها", icon: <FiBarChart />, key: "reports" },
  ];

  return (
    <div
      dir="rtl"
      className="flex h-screen bg-gray-100 relative overflow-hidden"
    >
      {/* پس‌زمینه تار هنگام باز بودن منو */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-all duration-500 ease-in-out z-50
          ${
            isSidebarOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }
          md:top-16 md:translate-x-0 md:opacity-100 md:static md:block`}
        aria-label="Main sidebar"
      >
        <h1 className="text-2xl font-bold p-4 border-b text-blue-700 dark:text-blue-400">
          پنل مدیریت
        </h1>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto text-gray-800 dark:text-gray-200">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveMenu(item.key);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-2 w-full p-2 rounded text-right ${
                activeMenu === item.key
                  ? "bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white font-semibold"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        {/* دکمه خروج */}
        <div className="border-t p-4 md:sticky md:bottom-0 md:bg-white dark:md:bg-gray-800">
          <button
            className="flex items-center gap-2 w-full justify-start hover:bg-gray-200 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 font-semibold p-2 rounded"
            aria-label="Logout"
          >
            <FiLogOut /> خروج
          </button>
        </div>
      </aside>
    </div>
  );
}
