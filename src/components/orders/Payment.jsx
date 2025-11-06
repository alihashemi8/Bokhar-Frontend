import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, ShieldCheck, CreditCard, CheckCircle, XCircle, Loader2 } from "lucide-react";

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
      className="w-full mt-10 space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* کارت مالی */}
      <motion.div
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg shadow-xl rounded-2xl p-6 flex flex-col gap-4 border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
          <CreditCard className="size-5 text-purple-500" />
          خلاصه پرداخت
        </h2>

        <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
          <div className="flex justify-between py-2 text-gray-600 dark:text-gray-300">
            <span>جمع خرید:</span>
            <span>{subtotal.toLocaleString()} تومان</span>
          </div>

          {discountAmount > 0 && (
            <motion.div
              className="flex justify-between py-2 text-green-600 dark:text-green-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span>تخفیف اعمال‌شده:</span>
              <span>-{discountAmount.toLocaleString()} تومان</span>
            </motion.div>
          )}

          <div className="flex justify-between items-center py-3 text-lg font-bold text-purple-700 dark:text-purple-300">
            <span>مبلغ قابل پرداخت:</span>
            <span>{total.toLocaleString()} تومان</span>
          </div>
        </div>
      </motion.div>

      {/* فرم تخفیف */}
      <motion.div
        className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-5 shadow flex flex-col sm:flex-row items-center gap-3 border border-gray-200 dark:border-gray-700 relative overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="relative w-full sm:w-2/3">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
          <input
            type="text"
            placeholder="کد تخفیف دارید؟"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>

        <button
          onClick={onApplyDiscount}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold transition shadow"
        >
          اعمال تخفیف
        </button>

        {/* پیام موفقیت/خطا */}
        <AnimatePresence>
          {discountStatus === "success" && (
            <motion.div
              className="absolute -bottom-8 left-0 right-0 text-green-600 text-sm flex items-center justify-center gap-1"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
            >
              <CheckCircle className="size-4" />
              کد تخفیف با موفقیت اعمال شد
            </motion.div>
          )}
          {discountStatus === "error" && (
            <motion.div
              className="absolute -bottom-8 left-0 right-0 text-red-500 text-sm flex items-center justify-center gap-1"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
            >
              <XCircle className="size-4" />
              کد تخفیف معتبر نیست
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* دکمه پرداخت */}
      <motion.div
        className="flex justify-center sm:justify-end"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={onPay}
          disabled={loading}
          className={`px-10 py-4 flex items-center gap-3 rounded-2xl text-lg font-bold transition-all shadow-lg ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              در حال انتقال به درگاه...
            </>
          ) : (
            <>
              <ShieldCheck className="size-5" />
              پرداخت امن و نهایی
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}
