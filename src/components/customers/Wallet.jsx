import { Wallet } from "lucide-react";
import { useState } from "react";

const quickAmounts = [50000, 100000, 200000];

export default function WalletPage() {
  const [amount, setAmount] = useState("");

  return (
    <div dir="rtl" className="min-h-screen p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow p-4 md:max-w-3xl md:mx-auto md:mt-15 mb-20 md:mb-0">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Wallet className="text-green-600" size={22} />
          </div>
          <div>
            <p className="text-lg font-semibold">کیف پول</p>
            <p className="text-sm text-gray-500">
              افزایش موجودی کیف پول
            </p>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-gray-50 border rounded-2xl p-4 mb-6">
          <p className="text-sm text-gray-500">موجودی فعلی</p>
          <p className="text-2xl font-bold mt-2">125,000 تومان</p>
        </div>

        {/* Quick amounts */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">انتخاب سریع مبلغ</p>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(a)}
                className={`rounded-xl p-3 text-sm border transition
                  ${
                    Number(amount) === a
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
              >
                {a.toLocaleString()} تومان
              </button>
            ))}
          </div>
        </div>

        {/* Manual input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
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
  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
/>

        </div>

        {/* Pay */}
        <button
          disabled={!amount}
          className={`w-full rounded-xl p-3 transition 
            ${
              amount
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          پرداخت و افزایش موجودی
        </button>
      </div>
    </div>
  );
}
