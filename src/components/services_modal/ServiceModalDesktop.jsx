import ReactDOM from "react-dom";
import { X } from "lucide-react";

export default function ServiceModalDesktop({
  onClose,
  defaultServices,
  cardServices,
  selectedMain,
  quantity,
  selectedOptions,
  totalPrice,
  handleMainSelect,
  handleQuantityChange,
  handleOptionToggle,
  handleAdd,
}) {
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 z-[9999] flex justify-center items-center backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-gradient-to-bl from-sky-50 via-sky-100 to-sky-200
          dark:from-sky-800 dark:via-sky-900 dark:to-sky-950
          rounded-3xl
          w-[550px]
          max-h-[88vh]
          overflow-hidden
          shadow-[0_20px_40px_rgba(0,0,0,0.2)]
          p-5 flex flex-col
        "
      >
        {/* Header */}
        <div
          dir="rtl"
          className="flex justify-between items-center mb-4 text-gray-900 dark:text-gray-100"
        >
          <h2 className="text-lg font-semibold">خدمات قابل انتخاب</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Content */}
        <div
          dir="rtl"
          className="flex-1 overflow-y-auto space-y-4 pb-2 px-1 text-gray-900 dark:text-gray-100"
        >
          {/* سرویس‌های اصلی */}
          <div className="flex gap-2 flex-wrap justify-center">
            {defaultServices.map((service) => (
              <button
                key={service.name}
                onClick={() => handleMainSelect(service)}
                className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg
                  ${
                    selectedMain?.name === service.name
                      ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800 border border-gray-300 dark:border-indigo-600 text-gray-800 dark:text-white/90 shadow-indigo-300 scale-105"
                      : "bg-white dark:bg-white/80 hover:bg-sky-100 dark:hover:bg-white/95 border border-gray-200 text-gray-800 shadow-md"
                  }`}
              >
                {service.name}
              </button>
            ))}
          </div>

          {/* تعداد */}
          {selectedMain && (
            <div className="flex items-center gap-4 justify-center mt-2">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-9 h-9 rounded-full bg-sky-50 shadow-md dark:bg-gray-600"
              >
                −
              </button>
              <span className="w-10 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-9 h-9 rounded-full bg-sky-50 shadow-md dark:bg-gray-600"
              >
                +
              </button>
            </div>
          )}

          {/* گزینه‌های اضافه */}
          {cardServices.map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              className="
                rounded-xl p-3
                bg-white dark:bg-gray-700/40
                border border-sky-200 dark:border-gray-600
                shadow-lg
              "
            >
              <span className="block font-semibold mb-2 text-sm">
                {item.name}
              </span>
              <div className="flex gap-2 flex-wrap">
                {item.choices?.map((choice, cIdx) => (
                  <button
                    key={`${item.name}-${choice.label}-${cIdx}`}
                    onClick={() =>
                      handleOptionToggle(
                        item.name,
                        choice.label,
                        choice.price
                      )
                    }
                    className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all duration-300
                      ${
                        selectedOptions[item.name]?.includes(choice.label)
                          ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800 border border-gray-300 dark:border-indigo-600 text-gray-800 dark:text-white/90 shadow-md shadow-indigo-300 scale-105"
                          : "bg-white dark:bg-white/80 hover:bg-sky-100 dark:hover:bg-white/95 border border-gray-200 text-gray-800 shadow"
                      }`}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-sky-200 dark:border-gray-600 p-4 flex justify-between items-center text-gray-900 dark:text-gray-100">
          <span className="text-sm">
            مجموع: {totalPrice.toLocaleString()} تومان
          </span>
          <button
            onClick={handleAdd}
            disabled={!selectedMain}
            className="px-4 py-2 rounded-xl bg-sky-600 dark:bg-purple-800 text-white disabled:opacity-40"
          >
            افزودن به سبد
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
