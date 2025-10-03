import { useState } from "react";
import { useCart } from "../context/CartContext";
import { FiTrash2 } from "react-icons/fi";

export default function Order() {
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useCart();
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.totalPrice * item.qty,
    0
  );
  const total = subtotal - discountAmount;

  const applyDiscount = () => {
    if (discountCode === "BAKHAR10") setDiscountAmount(subtotal * 0.1);
    else {
      setDiscountAmount(0);
      alert("کد تخفیف معتبر نیست");
    }
  };

  const handlePayment = () =>
    alert(`پرداخت ${total.toLocaleString()} تومان آغاز شد`);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center">
          فاکتور خرید شما
        </h1>

        {/* دسکتاپ → جدول */}
        <div className="hidden md:block">
          <table className="min-w-full text-sm sm:text-base border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 uppercase tracking-wide">
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
                cartItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="py-3 px-4 font-medium flex items-center gap-2">

                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
                        >
                          -
                        </button>
                        {item.qty}
                        <button
                          onClick={() => increaseQty(item.id)}
                          className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col gap-1">
                        {Object.entries(item.options)
                          .filter(([key, value]) => typeof value === "boolean" && value)
                          .map(([key]) => (
                            <span
                              key={key}
                              className="text-sm text-purple-600 dark:text-purple-300"
                            >
                              {optionLabels[key] || key}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col gap-1">
                        {Object.entries(item.options)
                          .filter(([key, value]) => typeof value === "string")
                          .map(([key, value]) => (
                            <span
                              key={key}
                              className="text-sm text-blue-600 dark:text-blue-300"
                            >
                              {optionLabels[key] || key}: {value}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.totalPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {(item.totalPrice * item.qty).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={20} />
                      </button>
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

          {/* دسکتاپ → کد تخفیف و پرداخت */}
          <div className="flex justify-end gap-4 mt-6">
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
        </div>

        {/* موبایل → کارت‌ها کامل */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {cartItems.length ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl shadow flex flex-col gap-3"
              >
                {/*  نام */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-bold text-lg">{item.name}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>

                {/* خدمات و ویژگی‌ها */}
                <div className="flex flex-wrap gap-2 text-xs mt-1">
                  {item.options &&
                    Object.entries(item.options).map(([key, value]) => {
                      if (typeof value === "boolean" && value) {
                        return (
                          <span
                            key={key}
                            className="bg-purple-200 dark:bg-purple-600 px-2 py-0.5 rounded-full"
                          >
                            {optionLabels[key] || key} انجام شد
                          </span>
                        );
                      } else if (typeof value === "string") {
                        return (
                          <span
                            key={key}
                            className="bg-blue-200 dark:bg-blue-600 px-2 py-0.5 rounded-full"
                          >
                            {optionLabels[key] || key}: {value}
                          </span>
                        );
                      }
                      return null;
                    })}
                </div>

                {/* تعداد با دکمه + و - */}
                <div className="flex items-center justify-between text-sm mt-1">
                  <span>تعداد:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* قیمت‌ها */}
                <div className="flex justify-between items-center text-sm mt-1">
                  <span>قیمت واحد:</span>
                  <span>{item.totalPrice.toLocaleString()} تومان</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold">
                  <span>قیمت کل:</span>
                  <span>{(item.totalPrice * item.qty).toLocaleString()} تومان</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 dark:text-gray-300 py-6">
              سبد خرید خالی است
            </p>
          )}
        </div>

        {/* جمع کل */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-purple-100 to-blue-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl shadow-inner">
          <div className="text-lg sm:text-xl font-medium">
            جمع کل: {subtotal.toLocaleString()} تومان
          </div>
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
      </div>
    </div>
  );
}
