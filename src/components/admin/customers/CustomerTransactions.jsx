import { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../Sidebar";

export default function CustomerTransactions() {
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("customers");

  const [customer, setCustomer] = useState({ id, name: "علی رضایی" });

  const [transactions, setTransactions] = useState([
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
    <div dir="rtl" className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
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
        {/* sticky header باکس مجموع */}
        <div className="sticky top-0 z-50 bg-gray-100 dark:bg-gray-900 pt-4 pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              تراکنش‌های مشتری: {customer.name}
            </h1>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-md font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">
              مجموع کل همه فاکتورها: {totalSum.toLocaleString()} تومان
            </div>
          </div>
        </div>

        {/* جدول تراکنش‌ها */}
        <div className="space-y-6 mt-4">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-md hover:shadow-lg transition"
            >
              <h2 className="font-bold mb-3 text-gray-700 dark:text-gray-200">
                تاریخ: {t.date} | مبلغ کل: {getTransactionTotal(t).toLocaleString()} تومان
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full text-right table-auto">
                  <thead>
                    <tr className="text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                      <th className="p-2 text-left md:text-right">نام کالا</th>
                      <th className="p-2">تعداد</th>
                      <th className="p-2">قیمت واحد</th>
                      <th className="p-2">جمع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="p-2 text-left md:text-right">{item.name}</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">{item.price.toLocaleString()}</td>
                        <td className="p-2">{(item.price * item.quantity).toLocaleString()}</td>
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
