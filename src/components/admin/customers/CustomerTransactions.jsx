import { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../Sidebar";
import { FiCalendar, FiShoppingBag } from "react-icons/fi";

export default function CustomerTransactions() {
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("customers");

  const [customer] = useState({ id, name: "علی رضایی" });

  const [transactions] = useState([
    {
      id: 1,
      date: "2025-11-10",
      items: [
        { name: "کالا A", quantity: 2, price: 30000 },
        { name: "کالا B", quantity: 1, price: 60000 },
      ],
    },
    {
      id: 2,
      date: "2025-11-12",
      items: [{ name: "کالا C", quantity: 5, price: 50000 }],
    },
    {
      id: 3,
      date: "2025-11-14",
      items: [{ name: "کالا D", quantity: 3, price: 30000 }],
    },
  ]);

  const getTransactionTotal = (t) =>
    t.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const totalSum = transactions.reduce(
    (sum, t) => sum + getTransactionTotal(t),
    0
  );

  return (
    <div dir="rtl" className="flex min-h-screen overflow-x-hidden">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <main
        className={`flex-1 p-4 sm:p-6 transition-all duration-300 overflow-y-auto ${
          !isSidebarOpen ? "md:mr-64" : ""
        }`}
      >
        {/* ===== Sticky Header ===== */}
        <div
          className={`
            sticky top-0 z-40 pt-3 transition-all
            ${
              isSidebarOpen
                ? "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto md:mr-64"
                : "opacity-100"
            }
          `}
        >
          <div
            className="
              rounded-2xl sm:rounded-3xl p-5
              bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200
              dark:from-sky-800 dark:via-sky-900 dark:to-sky-950
              border border-sky-200 dark:border-sky-700
              shadow-lg backdrop-blur-xl
              flex flex-col md:flex-row justify-between gap-4
            "
          >
            <h1 className="text-xl sm:text-2xl font-extrabold text-sky-900 dark:text-sky-100 flex items-center gap-2">
              <FiShoppingBag size={22} />
              تراکنش‌های مشتری: {customer.name}
            </h1>

            <div
              className="
                rounded-xl px-5 py-3 font-extrabold whitespace-nowrap
                bg-white/80 dark:bg-gray-900/60
                text-sky-700 dark:text-sky-200
                border border-sky-300 dark:border-sky-700
                shadow-sm
              "
            >
              مجموع کل: {totalSum.toLocaleString()} تومان
            </div>
          </div>
        </div>

        {/* ===== Transactions ===== */}
        <div className="space-y-6 mt-6">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="
                rounded-2xl sm:rounded-3xl p-5
                bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200
                dark:from-sky-800 dark:via-sky-900 dark:to-sky-950
                border border-sky-200 dark:border-sky-700
                shadow-lg backdrop-blur-xl dark:text-gray-300
                transition-all
              "
            >
              <div className="flex items-center gap-2 mb-3 text-sky-700 dark:text-sky-100 font-bold">
                <FiCalendar size={18} />
                تاریخ: {t.date}
              </div>

              <div className="font-semibold mb-4 text-sky-700 dark:text-sky-100">
                مبلغ کل این تراکنش: {getTransactionTotal(t).toLocaleString()} تومان
              </div>

              <div className="overflow-x-auto rounded-xl border border-sky-200 dark:border-sky-700">
                <table className="min-w-full text-right text-sm">
                  <thead>
                    <tr className="bg-sky-50 dark:bg-sky-900 text-gray-600 dark:text-gray-200">
                      <th className="p-3 font-bold">نام کالا</th>
                      <th className="p-3 font-bold">تعداد</th>
                      <th className="p-3 font-bold">قیمت واحد</th>
                      <th className="p-3 font-bold">جمع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.items.map((item, idx) => (
                      <tr
                        key={idx}
                        className="
                          border-t border-sky-100 dark:border-sky-700
                          hover:bg-sky-100 dark:hover:bg-sky-800
                          transition
                        "
                      >
                        <td className="p-3 font-medium">{item.name}</td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3">{item.price.toLocaleString()}</td>
                        <td className="p-3 font-semibold">
                          {(item.price * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
