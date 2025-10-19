import { useState } from "react";
import Sidebar from "../components/admin/Sidebar";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("orders");

  return (
   <div dir="rtl" className="flex h-screen md:mt-16 bg-gray-50 dark:bg-gray-900">
  {/* Sidebar */}
<Sidebar
  isSidebarOpen={isSidebarOpen}
  setIsSidebarOpen={setIsSidebarOpen}
  activeMenu={activeMenu}
  setActiveMenu={setActiveMenu}
/>


  {/* محتوای اصلی داشبورد */}
  <main className="flex-1 p-4 overflow-y-auto text-gray-800 dark:text-gray-100">
    {/* دکمه باز کردن منو در حالت موبایل */}
   <button
  onClick={() => setIsSidebarOpen(true)}
  className="md:hidden flex items-center gap-1 bg-blue-600 dark:bg-blue-500 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 transition-all duration-200"
>
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    ></path>
  </svg>
</button>

    {/* محتوای داشبورد */}
    <h1 className="text-2xl font-bold mb-4">داشبورد مدیریت</h1>

  </main>
</div>

  );
}
