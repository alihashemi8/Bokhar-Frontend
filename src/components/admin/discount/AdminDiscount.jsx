import { useState } from "react";
import Sidebar from "../Sidebar";
import ServiceDiscountTab from "./tabs/ServiceDiscountTab";
import GlobalDiscountTab from "./tabs/GlobalDiscountTab";
import CouponTab from "./tabs/CouponTab";

export default function AdminDiscounts() {
  const [activeTab, setActiveTab] = useState("services"); // services | global | coupon

  return (
    <div dir="rtl" className="flex min-h-screen">

      <Sidebar />

      <main className="flex-1 p-6 md:mr-64">
        <h2 className="text-2xl font-bold text-center md:text-start text-gray-800 dark:text-gray-100 mb-8">
          مدیریت تخفیف‌ها
        </h2>

        {/* تب‌ها */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("services")}
            className={`px-5 py-2 rounded-full font-semibold border transition
              ${
                activeTab === "services"
                  ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800 text-gray-900 dark:text-white shadow-md"
                  : "bg-white/50 dark:bg-white/20 text-gray-600 dark:text-gray-300 border-sky-200"
              }`}
          >
            تخفیف سرویس‌ها
          </button>

          <button
            onClick={() => setActiveTab("global")}
            className={`px-5 py-2 rounded-full font-semibold border transition
              ${
                activeTab === "global"
                  ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800 text-gray-900 dark:text-white shadow-md"
                  : "bg-white/50 dark:bg-white/20 text-gray-600 dark:text-gray-300 border-sky-200"
              }`}
          >
            تخفیف عمومی
          </button>

          <button
            onClick={() => setActiveTab("coupon")}
            className={`px-5 py-2 rounded-full font-semibold border transition
              ${
                activeTab === "coupon"
                  ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800 text-gray-900 dark:text-white shadow-md"
                  : "bg-white/50 dark:bg-white/20 text-gray-600 dark:text-gray-300 border-sky-200"
              }`}
          >
            کدهای تخفیف
          </button>
        </div>

        {/* محتوای تب‌ها */}
        {activeTab === "services" && <ServiceDiscountTab />}
        {activeTab === "global" && <GlobalDiscountTab />}
        {activeTab === "coupon" && <CouponTab />}
      </main>
    </div>
  );
}
