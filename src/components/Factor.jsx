import { FiTrash2 } from "react-icons/fi";

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

export default function Factor({ cartItems, increaseQty, decreaseQty, removeFromCart }) {
  return (
    <>
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
              cartItems.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="py-3 px-4 font-medium flex items-center gap-2">{item.name}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => decreaseQty(item)}
                        className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
                      >-</button>
                      {item.qty}
                      <button
                        onClick={() => increaseQty(item)}
                        className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
                      >+</button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col gap-1">
                      {Object.entries(item.options)
                        .filter(([_, value]) => typeof value === "boolean" && value)
                        .map(([key]) => (
                          <span key={key} className="text-sm text-purple-600 dark:text-purple-300">
                            {optionLabels[key] || key}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col gap-1">
                      {Object.entries(item.options)
                        .filter(([_, value]) => typeof value === "string")
                        .map(([key, value]) => (
                          <span key={key} className="text-sm text-blue-600 dark:text-blue-300">
                            {optionLabels[key] || key}: {value}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">{item.totalPrice.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">{(item.totalPrice * item.qty).toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => removeFromCart(item)} className="text-red-500 hover:text-red-700">
                      <FiTrash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400 dark:text-gray-300">
                  سبد خرید خالی است
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* موبایل → کارت‌ها */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {cartItems.length ? (
          cartItems.map((item, idx) => (
            <div key={idx} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl shadow flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="font-bold text-lg">{item.name}</p>
                </div>
                <button onClick={() => removeFromCart(item)} className="text-red-500 hover:text-red-700">
                  <FiTrash2 size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 text-xs mt-1">
                {item.options &&
                  Object.entries(item.options).map(([key, value]) => {
                    if (typeof value === "boolean" && value) {
                      return (
                        <span key={key} className="bg-purple-200 dark:bg-purple-600 px-2 py-0.5 rounded-full">
                          {optionLabels[key] || key} انجام شد
                        </span>
                      );
                    } else if (typeof value === "string") {
                      return (
                        <span key={key} className="bg-blue-200 dark:bg-blue-600 px-2 py-0.5 rounded-full">
                          {optionLabels[key] || key}: {value}
                        </span>
                      );
                    }
                    return null;
                  })}
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span>تعداد:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQty(item)}
                    className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
                  >-</button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => increaseQty(item)}
                    className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
                  >+</button>
                </div>
              </div>
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
          <p className="text-center text-gray-400 dark:text-gray-300 py-6">سبد خرید خالی است</p>
        )}
      </div>
    </>
  );
}
