import { FiTrash2 } from "react-icons/fi";
import { useEffect, useMemo } from "react";
import { useCart } from "../../context/CartContext";
import { motion } from "framer-motion";

const optionLabels = {
  wash: "شستشو",
  polish: "واکس",
  deodorize: "ضدعفونی و بوگیری",
  clean: "تمیزکاری",
  stain: "لکه‌گیری",
  zipper: "تعمیر زیپ",
  waterproof: "ضدآب کردن",
  repair: "تعمیر بند",
  wheel: "بررسی چرخ‌ها",
  size: "سایز",
  material: "جنس",
  color: "رنگ",
};

export default function Factor({ onTotalChange, initialTotal = 0, goToTimeStep }) {
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useCart();

  const totalPrice = useMemo(
    () =>
      cartItems?.reduce(
        (sum, item) => sum + (item.totalPrice || 0) * (item.qty || 1),
        0
      ),
    [cartItems]
  );

  useEffect(() => {
    if (onTotalChange && totalPrice !== initialTotal) {
      onTotalChange(totalPrice);
    }
  }, [totalPrice]);

  if (!cartItems) return null;

  return (
    <motion.div
      dir="rtl"
      className="w-full max-w-5xl mx-auto mt-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className="
          rounded-3xl p-6 space-y-6 border shadow-xl
          bg-sky-50
          dark:bg-gradient-to-br dark:from-sky-800 dark:via-sky-900 dark:to-sky-950
          border-sky-200 dark:border-sky-700
          shadow-sky-200/40 dark:shadow-black/40
        "
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          فاکتور خرید
        </h2>

        {/* --- جدول دسکتاپ --- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="text-gray-700 dark:text-gray-200 border-b border-sky-200 dark:border-sky-700">
                <th className="py-3 text-right">محصول</th>
                <th className="py-3 text-center">تعداد</th>
                <th className="py-3 text-center">خدمات</th>
                <th className="py-3 text-center">ویژگی‌ها</th>
                <th className="py-3 text-right">قیمت واحد</th>
                <th className="py-3 text-right">قیمت کل</th>
                <th className="py-3 text-center">حذف</th>
              </tr>
            </thead>

            <tbody>
              {cartItems.length ? (
                cartItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-sky-100 dark:border-sky-700/60"
                  >
                    <td className="py-3 font-medium text-gray-800 dark:text-gray-100">{item.name}</td>

                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => decreaseQty(item)}
                          className="px-2 py-0.5 rounded-lg bg-sky-100 hover:bg-sky-200 dark:bg-white/80 dark:hover:bg-white/90"
                        >
                          -
                        </button>
                        {item.qty}
                        <button
                          onClick={() => increaseQty(item)}
                          className="px-2 py-0.5 rounded-lg bg-sky-100 hover:bg-sky-200 dark:bg-white/80 dark:hover:bg-white/90"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-3 text-center text-sm">
                      {Object.entries(item.options || {})
                        .filter(([_, v]) => typeof v === "boolean" && v)
                        .map(([key]) => (
                          <div
                            key={key}
                            className="text-emerald-600 dark:text-emerald-400"
                          >
                            {optionLabels[key] || key}
                          </div>
                        ))}
                    </td>

                    <td className="py-3 text-center text-sm">
                      {Object.entries(item.options || {})
                        .filter(([_, v]) => typeof v === "string")
                        .map(([key, v]) => (
                          <div
                            key={key}
                            className="text-sky-700 dark:text-sky-300"
                          >
                            {optionLabels[key] || key}: {v}
                          </div>
                        ))}
                    </td>

                    <td className="py-3 text-right">{item.totalPrice?.toLocaleString()}</td>

                    <td className="py-3 text-right font-semibold">
                      {(item.totalPrice * item.qty).toLocaleString()}
                    </td>

                    <td className="py-3 text-center">
                      <button
                        onClick={() => removeFromCart(item)}
                        className="text-red-500 hover:text-red-600 transition"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-gray-400 dark:text-gray-300"
                  >
                    سبد خرید خالی است
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- کارت موبایل با دکمه + / - --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden mt-4">
          {cartItems.map((item, idx) => (
            <div
              key={idx}
              className="
                p-4 rounded-2xl border shadow-sm
                bg-white border-sky-200
                dark:bg-sky-900/60 dark:border-sky-700
              "
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-800 dark:text-gray-100">{item.name}</h3>
                <button
                  onClick={() => removeFromCart(item)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FiTrash2 />
                </button>
              </div>

              {/* تعداد با دکمه‌های کم و زیاد */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  onClick={() => decreaseQty(item)}
                  className="px-3 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 dark:bg-white/80 dark:hover:bg-white/90"
                >
                  -
                </button>
                <span className="text-gray-700 dark:text-gray-200 font-semibold">{item.qty}</span>
                <button
                  onClick={() => increaseQty(item)}
                  className="px-3 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 dark:bg-white/80 dark:hover:bg-white/90"
                >
                  +
                </button>
              </div>

              {/* قیمت کل */}
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-2">
                <span>قیمت کل:</span>
                <span>{(item.totalPrice * item.qty).toLocaleString()} تومان</span>
              </div>

              {/* ویژگی‌ها */}
              <div className="mt-2 text-sm flex flex-col gap-1">
                {Object.entries(item.options || {})
                  .filter(([_, v]) => v)
                  .map(([key, v]) => (
                    <span
                      key={key}
                      className="text-sky-700 dark:text-sky-300"
                    >
                      {optionLabels[key] || key}
                      {typeof v === "string" ? `: ${v}` : ""}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* جمع کل */}
        {cartItems.length > 0 && (
          <div className="flex justify-between items-center pt-4 border-t border-sky-200 dark:border-sky-700">
            <span className="text-gray-600 dark:text-gray-100">مبلغ نهایی</span>
            <span className="text-2xl font-bold text-sky-700 dark:text-gray-100">
              {totalPrice.toLocaleString()} تومان
            </span>
          </div>
        )}

        {/* دکمه ادامه */}
{cartItems.length > 0 && goToTimeStep && (
  <button
    onClick={goToTimeStep}
    className="
      hidden md:block
      w-full h-12 rounded-2xl font-bold transition
      bg-sky-600 hover:bg-sky-700 text-white
      dark:bg-gradient-to-r dark:from-purple-700 dark:to-purple-800
      dark:hover:from-purple-600 dark:hover:to-purple-700
    "
  >
    انتخاب زمان
  </button>
)}

      </div>
    </motion.div>
  );
}
