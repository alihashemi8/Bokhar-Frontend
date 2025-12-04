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

export default function Factor({ onTotalChange }) {
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useCart();

  // 🧮 محاسبه مجموع قیمت
  const totalPrice = useMemo(() => {
    return cartItems?.reduce(
      (sum, item) => sum + (item.totalPrice || 0) * (item.qty || 1),
      0
    );
  }, [cartItems]);

  // 🔁 اطلاع دادن به والد
  useEffect(() => {
    if (onTotalChange) onTotalChange(totalPrice);
  }, [totalPrice, onTotalChange]);

  if (!cartItems) return null;

  return (
    <motion.div
      className="w-full bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 dark:bg-gray-800/80 backdrop-blur-xl border border-pink-200 dark:border-gray-700 rounded-3xl p-6 shadow-md shadow-pink-300 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 🧾 عنوان */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-5">
        فاکتور خرید
      </h2>

      {/* --- جدول دسکتاپ --- */}
      <div className="hidden md:block">
        <table className="min-w-full text-sm sm:text-base border-collapse  ">
          <thead
            className="
    bg-gradient-to-l from-sky-50 to-white
    dark:bg-gray-700 
    text-gray-800 
    dark:text-gray-200 
    uppercase tracking-wide
    rounded-xl overflow-hidden
  "
          >
            <tr>
              <th className="py-3 px-4 text-left">محصول</th>
              <th className="py-3 px-4 text-center">تعداد</th>
              <th className="py-3 px-4 text-center">خدمات</th>
              <th className="py-3 px-4 text-center">ویژگی‌ها</th>
              <th className="py-3 px-4 text-right">قیمت واحد</th>
              <th className="py-3 px-4 text-right">قیمت کل</th>
              <th className="py-3 px-4 text-center">حذف</th>
            </tr>
          </thead>

          <tbody>
            {cartItems.length ? (
              cartItems.map((item, idx) => (
                <tr key={idx} className="group">
                  <td colSpan={7} className="p-0">
                    <div
                      className="
        grid grid-cols-7 
        items-center
        py-3 px-4 
        border-t border-gray-200 dark:border-gray-700 
        rounded-xl
        hover:bg-gray-50 dark:hover:bg-gray-700
        transition
      "
                    >
                      {/* ستون‌ها */}
                      <div className="font-medium flex items-center gap-2">
                        {item.name}
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => decreaseQty(item)}
                            className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 transition"
                          >
                            -
                          </button>
                          {item.qty}
                          <button
                            onClick={() => increaseQty(item)}
                            className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-center flex flex-col gap-1">
                        {Object.entries(item.options || {})
                          .filter(([_, v]) => typeof v === "boolean" && v)
                          .map(([key]) => (
                            <span key={key} className="text-sm text-p-600">
                              {optionLabels[key] || key}
                            </span>
                          ))}
                      </div>

                      <div className="text-center flex flex-col gap-1">
                        {Object.entries(item.options || {})
                          .filter(([_, v]) => typeof v === "string")
                          .map(([key, v]) => (
                            <span key={key} className="text-sm text-blue-600">
                              {optionLabels[key] || key}: {v}
                            </span>
                          ))}
                      </div>

                      <div className="text-right">
                        {item.totalPrice?.toLocaleString()}
                      </div>

                      <div className="text-right font-semibold">
                        {(item.totalPrice * item.qty).toLocaleString()}
                      </div>

                      <div className="text-center">
                        <button
                          onClick={() => removeFromCart(item)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-gray-400 dark:text-gray-300"
                >
                  سبد خرید خالی است
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {cartItems.length > 0 && (
          <div className="mt-4 text-right text-lg font-bold text-gray-800 dark:text-purple-300">
            جمع کل: {totalPrice.toLocaleString()} تومان
          </div>
        )}
      </div>

      {/* --- کارت موبایل --- */}
      <div className="grid grid-cols-1 gap-4 md:hidden mt-4">
        {cartItems.length ? (
          <>
            {cartItems.map((item, idx) => (
              <motion.div
                key={idx}
                layout
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-2xl shadow-md flex flex-col gap-3 border border-gray-200 dark:border-gray-600"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-lg">{item.name}</p>
                  <button
                    onClick={() => removeFromCart(item)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>تعداد:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item)}
                      className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
                    >
                      -
                    </button>
                    {item.qty}
                    <button
                      onClick={() => increaseQty(item)}
                      className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {Object.entries(item.options || {})
                    .filter(([_, v]) => typeof v === "boolean" && v)
                    .map(([key]) => (
                      <div key={key}>• {optionLabels[key] || key}</div>
                    ))}
                </div>

                <div className="flex justify-between text-sm font-semibold">
                  <span>قیمت کل:</span>
                  <span>
                    {(item.totalPrice * item.qty).toLocaleString()} تومان
                  </span>
                </div>
              </motion.div>
            ))}

            {/* ---- جمع کل موبایل ---- */}
            <div className="bg-purple-100 dark:bg-purple-900/40 p-4 rounded-2xl text-center font-bold mt-2 text-gray-800 dark:text-purple-300">
              جمع کل: {totalPrice.toLocaleString()} تومان
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400 py-6">سبد خرید خالی است</p>
        )}
      </div>
    </motion.div>
  );
}
