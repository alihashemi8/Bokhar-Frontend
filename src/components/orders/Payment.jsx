import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  ShieldCheck,
  CreditCard,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

export default function Payment({
  subtotal,
  total,
  discountAmount,
  discountCode,
  setDiscountCode,
  applyDiscount,
  handlePayment,
}) {
  const [loading, setLoading] = useState(false);
  const [discountStatus, setDiscountStatus] = useState(null); // success | error | null

  const onApplyDiscount = async () => {
    const ok = await applyDiscount();
    setDiscountStatus(ok ? "success" : "error");
    setTimeout(() => setDiscountStatus(null), 2500);
  };

  const onPay = async () => {
    setLoading(true);
    await handlePayment();
    setLoading(false);
  };

  return (
    <motion.div
    dir="rtl"
      className="w-full max-w-2xl mx-auto mt-10 space-y-8 px-4 sm:px-6 lg:px-0"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* خلاصه پرداخت */}
      <motion.div
        className="relative bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
          <CreditCard className="size-6 text-purple-500" />
          خلاصه پرداخت
        </h2>

        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <div className="flex justify-between text-sm sm:text-base">
            <span>جمع خرید:</span>
            <span>{subtotal.toLocaleString()} تومان</span>
          </div>

          {discountAmount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-between text-green-600 dark:text-green-400 text-sm sm:text-base"
            >
              <span>تخفیف:</span>
              <span>-{discountAmount.toLocaleString()} تومان</span>
            </motion.div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>

          <div className="flex justify-between text-lg sm:text-xl font-semibold text-purple-700 dark:text-purple-300">
            <span>مبلغ نهایی:</span>
            <span>{total.toLocaleString()} تومان</span>
          </div>
        </div>

        {/* پیام تخفیف */}
        <AnimatePresence>
          {discountStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute -top-6 left-0 right-0 text-center text-sm sm:text-base font-medium flex items-center justify-center gap-1 ${
                discountStatus === "success"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {discountStatus === "success" ? (
                <>
                  <CheckCircle className="size-4" />
                  کد تخفیف اعمال شد
                </>
              ) : (
                <>
                  <XCircle className="size-4" />
                  کد تخفیف معتبر نیست
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* فرم تخفیف */}
      <motion.div
        className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-2xl p-5 sm:p-6 shadow-md transition-all duration-300"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative w-full sm:flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
          <input
            type="text"
            placeholder="کد تخفیف را وارد کنید"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base transition"
          />
        </div>

        <button
          onClick={onApplyDiscount}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-sm sm:text-base transition-all shadow-md"
        >
          اعمال کد
        </button>
      </motion.div>

      {/* دکمه پرداخت */}
      <motion.div
        className="flex justify-center sm:justify-end"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >

      </motion.div>
    </motion.div>
  );
}
