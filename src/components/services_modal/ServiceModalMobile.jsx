import MobileModal from "../basemodal/MobileModal";

export default function ServiceModalMobile({
  onClose,
  defaultServices = [],
  cardServices = [],
  selectedMain,
  quantity,
  selectedOptions,
  totalPrice,
  handleMainSelect,
  handleQuantityChange,
  handleOptionToggle,
  handleAdd,
}) {
  return (
    <MobileModal isOpen={true} onClose={onClose} title="خدمات قابل انتخاب">
      <div className="flex-1 overflow-y-auto space-y-4 px-4 pb-3">
        {/* انتخاب سرویس اصلی */}
        <div className="flex gap-2 flex-wrap justify-center">
          {defaultServices.map((service, idx) => (
            <button
              key={`${service.name}-${idx}`} // 🔑 unique key
              onClick={() => handleMainSelect(service)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${
                selectedMain?.name === service.name
                  ? "bg-sky-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              {service.name}
            </button>
          ))}
        </div>

        {/* تعداد */}
        {selectedMain && (
          <div className="flex items-center gap-4 justify-center">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600"
            >
              −
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

        {/* گزینه‌های اضافه */}
        {cardServices.map((item, idx) => (
          <div
            key={`${item.name}-${idx}`} // 🔑 unique key for each group
            className="rounded-xl p-3 bg-white/60 dark:bg-gray-700/40 border"
          >
            <span className="block font-semibold mb-2 text-sm">{item.name}</span>
            <div className="flex gap-2 flex-wrap">
              {item.choices?.map((choice, cIdx) => (
                <button
                  key={`${item.name}-${choice.label}-${cIdx}`} // 🔑 unique key for each choice
                  onClick={() =>
                    handleOptionToggle(item.name, choice.label, choice.price)
                  }
                  className={`px-3 py-1.5 rounded-xl text-sm transition ${
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
      <div className="border-t p-4 flex justify-between items-center bg-white/80 dark:bg-gray-800">
        <span className="text-sm font-medium">
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
    </MobileModal>
  );
}
