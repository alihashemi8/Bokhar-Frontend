import { useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import DesktopNavbar from "../components/DesktopNavbar";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("orders");

  return (
    <div dir="rtl" className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <DesktopNavbar />

      {/* بخش اصلی: Sidebar + Main */}
      <div className="flex flex-1 mt-16 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        {/* Main */}
        <main className="flex-1 p-4 overflow-y-auto text-gray-800 dark:text-gray-100">
          {/* دکمه باز کردن منو در موبایل */}


          <h1 className="text-2xl font-bold mb-4">داشبورد مدیریت</h1>
          {/* نمونه محتوای طولانی */}
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <p key={i}>محتوای نمونه {i + 1}</p>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
