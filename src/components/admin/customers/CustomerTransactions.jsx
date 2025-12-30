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

  const getTransactionTotal = (transaction) =>
    transaction.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const totalSum = transactions.reduce(
    (sum, t) => sum + getTransactionTotal(t),
    0
  );

  return (
    <div dir="rtl" className="flex min-h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <main
        className={`flex-1 p-6 transition-all duration-300 overflow-y-auto ${
          !isSidebarOpen ? "md:mr-64" : ""
        }`}
      >
        {/* هدر چسبنده و مدرن */}
        <div
          className={`
            sticky top-0 z-40 transition-all duration-300 pt-3

            ${
              isSidebarOpen
                ? "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto md:mr-64"
                : "opacity-100"
            }
          `}
        >
          <div
            className="
            bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700
            rounded-2xl p-5 shadow-md
            flex flex-col md:flex-row justify-between items-start md:items-center
            backdrop-blur-xl bg-opacity-70 dark:bg-opacity-70
            gap-4"
          >
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FiShoppingBag className="text-blue-500" size={22} />
              تراکنش‌های مشتری: {customer.name}
            </h1>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 
                            border border-blue-200 dark:border-blue-700
                            rounded-xl py-3 px-5 shadow-sm 
                            text-blue-900 dark:text-blue-100 font-extrabold whitespace-nowrap">
              مجموع کل: {totalSum.toLocaleString()} تومان
            </div>
          </div>
        </div>

        {/* لیست تراکنش‌ها */}
        <div className="space-y-6 mt-6">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="
                bg-white dark:bg-gray-800 
                border border-gray-200 dark:border-gray-700
                rounded-2xl p-5 shadow-md 
                hover:shadow-xl transition-all duration-300
              "
            >
              <div className="flex items-center gap-3 mb-3">
                <FiCalendar className="text-gray-500 dark:text-gray-300" size={20} />
                <h2 className="font-bold text-lg text-gray-700 dark:text-gray-200">
                  تاریخ: {t.date}
                </h2>
              </div>

              <div className="text-blue-700 dark:text-blue-300 font-semibold mb-4">
                مبلغ کل این تراکنش: {getTransactionTotal(t).toLocaleString()} تومان
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="min-w-full text-right table-auto">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-b">
                      <th className="p-3 font-bold text-right">نام کالا</th>
                      <th className="p-3 font-bold">تعداد</th>
                      <th className="p-3 font-bold">قیمت واحد</th>
                      <th className="p-3 font-bold">جمع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.items.map((item, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <td className="p-3 font-medium">{item.name}</td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3">{item.price.toLocaleString()}</td>
                        <td className="p-3">
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
