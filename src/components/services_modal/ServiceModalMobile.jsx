import MobileModal from "../basemodal/BaseModal";

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

  const title = "خدمات قابل انتخاب";
  return (
    <MobileModal isOpen={true} onClose={onClose} >
      <h2 className="text-center text-md mb-4 font-bold">{title}</h2>
      <div className="flex-1 overflow-y-auto space-y-4 px-4 pb-3 ">
        {/* انتخاب سرویس اصلی */}
        <div className="flex gap-2 flex-wrap justify-center">
          {defaultServices.map((service, idx) => (
            <button
              key={`${service.name}-${idx}`} 
              onClick={() => handleMainSelect(service)}
              className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 shadow-md
                ${
                  selectedMain?.name === service.name
                    ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800 border border-gray-300 dark:border-indigo-600 text-gray-800 dark:text-white/90 shadow-indigo-300 scale-105"
                    : "bg-white dark:bg-white/80 hover:bg-sky-100 dark:hover:bg-white/95 border border-gray-200 text-gray-800"
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
            className="rounded-xl p-3 bg-white dark:bg-gray-700/40 border border-sky-200 shadow-lg"
          >
            <span className="block font-semibold mb-2 text-sm">{item.name}</span>
            <div className="flex gap-2 flex-wrap">
              {item.choices?.map((choice, cIdx) => (
                <button
                  key={`${item.name}-${choice.label}-${cIdx}`} 
                  onClick={() =>
                    handleOptionToggle(item.name, choice.label, choice.price)
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
      <div dir="ltr" className="border-t dark:border-t-gray-300 p-4 flex justify-between items-center bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 dark:from-sky-900 dark:via-sky-900 dark:to-sky-950">
        <span className="text-sm font-bold dark:text-gray-100">
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
    </MobileModal>
  );
}
