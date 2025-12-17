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
      className="fixed inset-0 bg-black/40 z-[9999] flex justify-center items-center backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-gradient-to-bl from-sky-50 via-sky-100 to-sky-200 dark:bg-gray-800
          rounded-3xl
          w-[550px]
          max-h-[88vh]
          overflow-hidden
          shadow-[0_20px_40px_rgba(0,0,0,0.2)]
          p-5 flex flex-col
        "
      >
        {/* Header */}
        <div dir="rtl" className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">خدمات قابل انتخاب</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Content */}
        <div dir="rtl" className="flex-1 overflow-y-auto space-y-4 pb-2 px-1">
          <div className="flex gap-2 flex-wrap justify-center">
            {defaultServices.map((service) => (
              <button
                key={service.name}
                onClick={() => handleMainSelect(service)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium ${
                  selectedMain?.name === service.name
                    ? "bg-sky-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                {service.name}
              </button>
            ))}
          </div>

          {selectedMain && (
            <div className="flex items-center gap-4 justify-center">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600"
              >
                -
              </button>
              <span className="w-10 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600"
              >
                +
              </button>
            </div>
          )}

          {cardServices.map((item) => (
            <div
              key={item.name}
              className="rounded-xl p-3 bg-white/60 dark:bg-gray-700/40 border"
            >
              <span className="block font-semibold mb-2 text-sm">
                {item.name}
              </span>
              <div className="flex gap-2 flex-wrap">
                {item.choices?.map((choice) => (
                  <button
                    key={choice.label}
                    onClick={() =>
                      handleOptionToggle(item.name, choice.label, choice.price)
                    }
                    className={`px-3 py-1.5 rounded-xl text-sm ${
                      selectedOptions[item.name]?.includes(choice.label)
                        ? "bg-sky-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700"
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
        <div className="border-t p-4 flex justify-between items-center">
          <span className="text-sm">
            مجموع: {totalPrice.toLocaleString()} تومان
          </span>
          <button
            onClick={handleAdd}
            disabled={!selectedMain}
            className="px-4 py-2 rounded-xl bg-sky-600 text-white disabled:opacity-40"
          >
            افزودن به سبد
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
