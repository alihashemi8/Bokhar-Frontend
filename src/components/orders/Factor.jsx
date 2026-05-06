import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiTag } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useModal } from "../../context/ModalContext";
import { useEffect, useMemo } from "react";

export default function Factor({ onTotalChange, goToTimeStep }) {
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useCart();
  const { addToast } = useToast();
  const { showConfirm } = useModal();

  // محاسبه مجموع کل با تخفیف
  const totalPrice = useMemo(() => {
    return cartItems?.reduce(
      (sum, item) => sum + (item.totalPrice || 0) * (item.qty || 1),
      0,
    );
  }, [cartItems]);

  // محاسبه مجموع کل بدون تخفیف (قیمت اصلی)
  const originalTotalPrice = useMemo(() => {
    return cartItems?.reduce((sum, item) => {
      const originalPrice = item.options?.originalPrice || item.totalPrice || 0;
      return sum + originalPrice * (item.qty || 1);
    }, 0);
  }, [cartItems]);

  // آیا سبد تخفیف دارد؟
  const hasAnyDiscount = originalTotalPrice > totalPrice;
  const savingsAmount = originalTotalPrice - totalPrice;

  useEffect(() => {
    if (onTotalChange) onTotalChange(totalPrice);
  }, [totalPrice]);

  // حذف با Modal
  const handleRemove = (item) => {
    const name = item.name || "محصول";
    const service = item.options?.service || "";

    showConfirm({
      title: "حذف آیتم",
      message: `می‌خوای «${name}» ${service ? `(${service})` : ""} را حذف کنی؟`,
      confirmText: "بله، حذف کن",
      cancelText: "انصراف",
      onConfirm: () => {
        removeFromCart(item);
        addToast(`«${name}» حذف شد.`, "success");
      },
    });
  };

  return (
    <motion.div
      dir="rtl"
      className="w-full max-w-5xl mx-auto mb-20 md:mb-0"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className="
          p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-2xl border 
          bg-white/90 dark:bg-slate-900/60 backdrop-blur-xl 
          border-slate-200 dark:border-slate-700
        "
      >
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-slate-800 dark:text-white">
          فاکتور خرید
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="min-w-full text-sm rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-300">
                <th className="py-3 px-4 text-right">محصول</th>
                <th className="py-3 px-4 text-center">تعداد</th>
                <th className="py-3 px-4 text-center">خدمت</th>
                <th className="py-3 px-4 text-center">جنس</th>
                <th className="py-3 px-4 text-right">قیمت واحد</th>
                <th className="py-3 px-4 text-right">قیمت کل</th>
                <th className="py-3 px-4 text-center"></th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {cartItems.length ? (
                  cartItems.map((item) => {
                    const hasDiscount = item.options?.isDiscounted;
                    const originalUnitPrice = item.options?.originalPrice || 0;
                    const finalUnitPrice = item.totalPrice || 0;
                    const originalTotal = originalUnitPrice * (item.qty || 1);
                    const finalTotal = finalUnitPrice * (item.qty || 1);

                    return (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="border-b border-slate-200/60 dark:border-slate-700/50"
                      >
                        {/* نام محصول */}
                        <td className="py-4 px-4 text-slate-900 dark:text-slate-200 font-semibold">
                          <div className="flex items-center gap-2">
                            {item.name}
                            {hasDiscount && (
                              <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                <FiTag size={10} />
                                تخفیف
                              </span>
                            )}
                          </div>
                        </td>

                        {/* تعداد */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => decreaseQty(item)}
                              disabled={item.qty <= 1}
                              className={`
                                w-8 h-8 flex items-center justify-center rounded-lg text-lg
                                transition 
                                ${
                                  item.qty <= 1
                                    ? "bg-slate-200 dark:bg-slate-700 cursor-not-allowed opacity-45"
                                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                                }
                              `}
                            >
                              −
                            </button>

                            <span className="text-base font-bold text-slate-700 dark:text-slate-200">
                              {item.qty}
                            </span>

                            <button
                              onClick={() => increaseQty(item)}
                              className="
                                w-8 h-8 flex items-center justify-center rounded-lg text-lg
                                bg-slate-100 hover:bg-slate-200 
                                dark:bg-slate-800 dark:hover:bg-slate-700
                              "
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* خدمات */}
                        <td className="py-4 px-4 text-center text-slate-700 dark:text-slate-300">
                          {item.options?.service || "-"}
                        </td>

                        {/* جنس */}
                        <td className="py-4 px-4 text-center text-slate-700 dark:text-slate-300">
                          {item.options?.material || "-"}
                        </td>

                        {/* قیمت */}
                        <td className="py-4 px-4 text-right text-slate-800 dark:text-slate-200">
                          {hasDiscount ? (
                            <div className="flex flex-col">
                              <span className="text-xs line-through text-slate-400 dark:text-slate-500">
                                {originalUnitPrice.toLocaleString()}
                              </span>
                              <span className="text-green-600 dark:text-green-400 font-semibold">
                                {finalUnitPrice.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            finalUnitPrice.toLocaleString()
                          )}
                        </td>

                        {/* جمع */}
                        <td className="py-4 px-4 text-right text-slate-900 dark:text-white font-bold">
                          {hasDiscount ? (
                            <div className="flex flex-col items-end">
                              <span className="text-xs line-through text-slate-400 dark:text-slate-500 font-normal">
                                {originalTotal.toLocaleString()}
                              </span>
                              <span className="text-green-600 dark:text-green-400">
                                {finalTotal.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            finalTotal.toLocaleString()
                          )}
                        </td>

                        {/* حذف */}
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleRemove(item)}
                            className="text-red-500 hover:text-red-600 transition"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-slate-400 dark:text-slate-300"
                    >
                      سبد خرید خالی است
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          <AnimatePresence>
            {cartItems.map((item) => {
              const hasDiscount = item.options?.isDiscounted;
              const originalUnitPrice = item.options?.originalPrice || 0;
              const finalUnitPrice = item.totalPrice || 0;
              const originalTotal = originalUnitPrice * (item.qty || 1);
              const finalTotal = finalUnitPrice * (item.qty || 1);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="
                    p-3 rounded-xl border bg-white dark:bg-slate-900 
                    border-slate-200 dark:border-slate-700 shadow-sm
                  "
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {item.name}
                      </span>
                      {hasDiscount && (
                        <span className="text-[10px] text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full mt-1 w-fit">
                          تخفیف دار
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end">
                      {hasDiscount && (
                        <span className="text-xs line-through text-slate-400 dark:text-slate-500">
                          {originalTotal.toLocaleString()} تومان
                        </span>
                      )}
                      <span className={`font-bold text-sm ${hasDiscount ? "text-green-600 dark:text-green-400" : "text-slate-900 dark:text-white"}`}>
                        {finalTotal.toLocaleString()} تومان
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed mb-3 space-y-1">
                    <div className="flex justify-between">
                      <span>خدمت:</span>
                      <span>{item.options?.service || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>جنس:</span>
                      <span>{item.options?.material || "-"}</span>
                    </div>
                    {hasDiscount && (
                      <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 mt-1">
                        <span>قیمت واحد:</span>
                        <div>
                          <span className="line-through ml-1">{originalUnitPrice.toLocaleString()}</span>
                          <span className="text-green-600 dark:text-green-400">{finalUnitPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQty(item)}
                        disabled={item.qty <= 1}
                        className={`
                          w-8 h-8 rounded-lg flex items-center justify-center text-base
                          ${
                            item.qty <= 1
                              ? "bg-slate-300 dark:bg-slate-700 opacity-40"
                              : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                          }
                        `}
                      >
                        −
                      </button>

                      <span className="text-slate-900 dark:text-white text-base font-bold w-6 text-center">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => increaseQty(item)}
                        className="
                          w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 
                          hover:bg-slate-200 flex items-center justify-center text-base
                        "
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item)}
                      className="text-red-500 hover:text-red-600 p-2"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Footer: Total with Discount Info - Responsive */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4 md:pt-5 mt-6 md:mt-8">
            {/* محتوای مبلغ نهایی - ریسپانسیو */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              {/* بخش چپ: عنوان و سود */}
              <div className="flex flex-col">
                <span className="text-slate-700 dark:text-slate-300 font-bold text-lg md:text-xl">
                  مبلغ نهایی
                </span>
                {hasAnyDiscount && (
                  <span className="text-xs md:text-sm text-green-600 dark:text-green-400 mt-1">
                    سود شما از این خرید: {savingsAmount.toLocaleString()} تومان
                  </span>
                )}
              </div>

              {/* بخش راست: قیمت‌ها - استایل مخصوص موبایل */}
              <div className={`
                flex flex-col items-start md:items-end
                bg-slate-50 dark:bg-slate-800/50 
                p-3 md:p-0 rounded-xl md:bg-transparent md:rounded-none
                w-full md:w-auto
              `}>
                {hasAnyDiscount && (
                  <span className="text-base md:text-xl line-through text-slate-400 dark:text-slate-500 mb-1">
                    {originalTotalPrice.toLocaleString()} تومان
                  </span>
                )}
                <span className={`text-2xl md:text-3xl font-extrabold ${hasAnyDiscount ? "text-green-600 dark:text-green-400" : "text-slate-900 dark:text-white"}`}>
                  {totalPrice.toLocaleString()} <span className="text-sm md:text-base font-normal">تومان</span>
                </span>
              </div>
            </div>

            {/* دکمه انتخاب مکان - در موبایل و دسکتاپ نمایش داده می‌شود */}
            {goToTimeStep && (
              <button
                onClick={goToTimeStep}
                className="
                  w-full h-12 md:h-14 mt-4 md:mt-6 rounded-xl md:rounded-2xl
                  bg-sky-600 hover:bg-sky-700 active:scale-[0.98]
                  dark:bg-sky-700 dark:hover:bg-sky-600
                  text-white font-bold text-base md:text-lg
                  shadow-lg shadow-sky-600/30 
                  transition-all
                "
              >
                انتخاب مکان
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
