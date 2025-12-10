import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Wallet, Package } from "lucide-react";
import { FiSun, FiMoon } from "react-icons/fi";

function QuickCard({ title, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-gray-800 flex flex-col items-center gap-2 p-4 rounded-2xl shadow hover:shadow-lg transition w-full"
    >
      <div className="text-gray-700 dark:text-gray-200">{icon}</div>
      <span className="font-medium text-gray-800 dark:text-gray-100">{title}</span>
    </button>
  );
}

function SettingItem({ title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
    >
      <span className="text-gray-800 dark:text-gray-100">{title}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

export default function CustomersDashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div dir="rtl" className="min-h-screen  p-4 md:p-8">
      
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 flex items-center gap-4 shadow-md md:max-w-3xl md:mx-auto">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl">
          👤
        </div>
        <div className="flex-1">
          <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">علی هاشمی</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">09*********</p>
        </div>
        <button
          onClick={() => navigate("/customer-dashboard/edit")}
          className="text-blue-600 dark:text-blue-400 font-medium"
        >
          ویرایش
        </button>
      </div>

      {/* Wallet */}
      <div className="bg-white dark:bg-gray-800 mt-5 p-5 rounded-2xl shadow-md md:max-w-3xl md:mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <Wallet size={20} />
            کیف پول
          </div>
          <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">125,000 تومان</span>
        </div>
        <button
          onClick={() => navigate("/customer-dashboard/wallet")}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition font-medium"
        >
          افزایش موجودی
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-3 mt-5 md:max-w-3xl md:mx-auto">
        <QuickCard
          title="پیگیری سفارش‌ها"
          onClick={() => navigate("/customer-dashboard/orders-tracking")}
          icon={<Package size={24} className="text-blue-600" />}
        />
        {/* کارت‌های بیشتر را اینجا اضافه کن */}
      </div>

      {/* Settings */}
      <div className="bg-white dark:bg-gray-800 mt-5 rounded-2xl p-5 shadow-md space-y-3 md:max-w-3xl md:mx-auto">
        <SettingItem title="امنیت و حریم خصوصی" onClick={() => navigate("/customer-dashboard/privacy")} />
        <SettingItem title="پشتیبانی" onClick={() => navigate("/customer-dashboard/support")} />
        <SettingItem title="درباره ما" onClick={() => navigate("/about")} />
      </div>

      {/* Logout Desktop */}
      <button
        onClick={() => navigate("/login")}
        className="mt-8 mb-20 md:mb-0 hidden md:flex w-full items-center justify-center gap-2 text-red-600 md:max-w-3xl md:mx-auto font-medium"
      >
        <LogOut size={20} />
        خروج از حساب
      </button>

      {/* Mobile Footer */}
      <div className="mb-20 mt-5 rounded-2xl bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-md md:hidden">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-red-600 font-medium"
        >
          <LogOut size={20} />
          خروج
        </button>
        <button
          onClick={toggleTheme}
          className={`relative w-14 h-8 rounded-full p-1 transition-all duration-300 ${theme === "dark" ? "bg-blue-600" : "bg-gray-300"}`}
        >
          <span
            className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white flex items-center justify-center transform transition-transform duration-300 ${theme === "dark" ? "translate-x-6" : ""}`}
          >
            {theme === "dark" ? <FiMoon size={16} className="text-blue-700" /> : <FiSun size={16} className="text-yellow-500" />}
          </span>
        </button>
      </div>
    </div>
  );
}
