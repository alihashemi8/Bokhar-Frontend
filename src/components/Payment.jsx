export default function Pay({
  subtotal,
  total,
  discountAmount,
  discountCode,
  setDiscountCode,
  applyDiscount,
  handlePayment,
}) {
  return (
    <>
      {/* دسکتاپ → کد تخفیف و پرداخت */}
      <div className="hidden md:flex justify-end gap-4 mt-6">
        <input
          type="text"
          placeholder="کد تخفیف خود را وارد کنید"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition w-1/3"
        />
        <button
          onClick={applyDiscount}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-full transition shadow"
        >
          اعمال کد تخفیف
        </button>
        <button
          onClick={handlePayment}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-bold rounded-full transition shadow"
        >
          پرداخت
        </button>
      </div>

      {/* جمع کل */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-purple-100 to-blue-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl shadow-inner">
        <div className="text-lg sm:text-xl font-medium">جمع کل: {subtotal.toLocaleString()} تومان</div>
        {discountAmount > 0 && (
          <div className="text-green-600 dark:text-green-400 text-lg sm:text-xl font-medium">
            تخفیف: -{discountAmount.toLocaleString()} تومان
          </div>
        )}
        <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 dark:text-purple-300">
          قابل پرداخت: {total.toLocaleString()} تومان
        </div>
      </div>

      {/* موبایل → کد تخفیف */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 md:hidden">
        <input
          type="text"
          placeholder="کد تخفیف خود را وارد کنید"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          className="w-full px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition"
        />
        <button
          onClick={applyDiscount}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-full transition shadow"
        >
          اعمال کد تخفیف
        </button>
      </div>

      {/* دکمه پرداخت موبایل */}
      <div className="mt-8 flex justify-center sm:justify-end md:hidden">
        <button
          onClick={handlePayment}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-bold rounded-3xl text-lg sm:text-xl transition shadow-lg"
        >
          پرداخت و رفتن به شاپرک
        </button>
      </div>
    </>
  );
}
