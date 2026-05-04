import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useModal } from "../../context/ModalContext";
import { useEffect, useMemo } from "react";

export default function Factor({ onTotalChange, goToTimeStep }) {
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useCart();
  const { addToast } = useToast();
  const { showConfirm } = useModal();

  // محاسبه مجموع کل
  const totalPrice = useMemo(() => {
    return cartItems?.reduce(
      (sum, item) => sum + (item.totalPrice || 0) * (item.qty || 1),
      0,
    );
  }, [cartItems]);

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
      className="w-full max-w-5xl mx-auto mt-10"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className="
          p-6 rounded-3xl shadow-2xl border 
          bg-white/90 dark:bg-slate-900/60 backdrop-blur-xl 
          border-slate-200 dark:border-slate-700
        "
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
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
                  cartItems.map((item) => (
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
                        {item.name}
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
                        {(item.totalPrice || 0).toLocaleString()}
                      </td>

                      {/* جمع */}
                      <td className="py-4 px-4 text-right text-slate-900 dark:text-white font-bold">
                        {(
                          (item.totalPrice || 0) * (item.qty || 1)
                        ).toLocaleString()}
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
                  ))
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
        <div className="md:hidden space-y-4">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="
                  p-4 rounded-2xl border bg-white dark:bg-slate-900 
                  border-slate-200 dark:border-slate-700 shadow-sm
                "
              >
                <div className="flex justify-between items-center">
                  <span>
                    {(
                      (item.totalPrice || 0) * (item.qty || 1)
                    ).toLocaleString()}{" "}
                    تومان
                  </span>

                  <button
                    onClick={() => handleRemove(item)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-slate-700 dark:text-slate-300 text-sm">
                    تعداد:
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item)}
                      disabled={item.qty <= 1}
                      className={`
                        w-9 h-9 rounded-xl flex items-center justify-center text-lg
                        ${
                          item.qty <= 1
                            ? "bg-slate-300 dark:bg-slate-700 opacity-40"
                            : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                        }
                      `}
                    >
                      −
                    </button>

                    <span className="text-slate-900 dark:text-white text-lg font-bold">
                      {item.qty}
                    </span>

                    <button
                      onClick={() => increaseQty(item)}
                      className="
                        w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 
                        hover:bg-slate-200 flex items-center justify-center text-lg
                      "
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-sm text-slate-500 dark:text-slate-300 leading-relaxed">
                  <p>خدمت: {item.options?.service || "-"}</p>
                  <p>جنس: {item.options?.material || "-"}</p>
                </div>

                <div className="flex justify-between mt-4 text-sm font-bold text-slate-900 dark:text-slate-100">
                  <span>قیمت کل:</span>
                  <span>
                    {(item.totalPrice * item.qty).toLocaleString()} تومان
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer: Total */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-700 pt-5 mt-8">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">
                مبلغ نهایی
              </span>

              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {totalPrice.toLocaleString()} تومان
              </span>
            </div>

            {goToTimeStep && (
              <button
                onClick={goToTimeStep}
                className="
    hidden md:block
    w-full h-14 mt-6 rounded-2xl
    bg-sky-600 hover:bg-sky-700 
    dark:bg-sky-700 dark:hover:bg-sky-600
    text-white font-bold text-lg
    shadow-xl shadow-sky-600/30 
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
