import { Wallet, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const quickAmounts = [50000, 100000, 200000];

// تابع کمکی برای تبدیل اعداد فارسی به انگلیسی
function toEnglishNumber(str) {
  return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
}

export default function WalletPage() {
  const [amount, setAmount] = useState("");
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const navigate = useNavigate();

  return (
    <div dir="rtl" className="min-h-screen p-4 md:p-8">
      <div
        className="
          rounded-2xl shadow p-4 md:max-w-3xl md:mx-auto mt-5 md:mt-15 mb-20 md:mb-0
          bg-sky-50 dark:bg-gradient-to-br dark:from-sky-800 dark:via-sky-900 dark:to-sky-950
          border border-sky-200 dark:border-sky-700
          transition
        "
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
            <Wallet className="text-green-600 dark:text-green-300" size={22} />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">کیف پول</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              افزایش موجودی کیف پول
            </p>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate("/customer-dashboard")}
            className="ms-auto w-10 h-10 rounded-full shadow-sm hover:shadow-md border
              bg-white/80 hover:bg-gray-200 border-sky-300 shadow-sky-200
               dark:bg-purple-800 dark:hover:bg-purple-900 dark:border-indigo-500 dark:shadow-indigo-500  flex items-center justify-center transition"
          >
            <ArrowLeft size={20} className="text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Balance */}
        <div className="bg-sky-50 dark:bg-sky-900/60 border border-sky-200 dark:border-sky-700 rounded-2xl p-4 mb-6 transition">
          <p className="text-sm text-gray-500 dark:text-gray-300">موجودی فعلی</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">125,000 تومان</p>
        </div>

        {/* Quick amounts */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">انتخاب سریع مبلغ</p>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(a)}
                className={`rounded-xl p-3 text-sm border transition
                  ${
                    Number(amount) === a
                      ? "border-green-600 bg-green-50 dark:bg-green-800 dark:text-green-300 text-green-700"
                      : "bg-sky-50 dark:bg-sky-900/60 text-gray-900 dark:text-gray-100 hover:bg-sky-100 dark:hover:bg-sky-800"
                  }`}
              >
                {a.toLocaleString()} تومان
              </button>
            ))}
          </div>
        </div>

        {/* Manual input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
            مبلغ دلخواه
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(e) => {
              const englishValue = toEnglishNumber(e.target.value);
              if (/^\d*$/.test(englishValue)) {
                setAmount(englishValue);
              }
            }}
            placeholder="مثلاً 75000"
            className="
              w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition
              bg-white dark:bg-sky-900/60 border-sky-300 dark:border-sky-700 text-gray-900 dark:text-white
              placeholder:text-gray-400 dark:placeholder:text-gray-300
            "
          />
        </div>

        {/* Pay */}
        <button
          disabled={!amount}
          className={`w-full rounded-xl p-3 transition font-medium
            ${
              amount
                ? "bg-green-600 hover:bg-green-700 text-white dark:bg-purple-700 dark:hover:bg-purple-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          پرداخت و افزایش موجودی
        </button>
      </div>
    </div>
  );
}
