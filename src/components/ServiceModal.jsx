import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

export default function ServiceModal({ onClose, onAddToCart, cardOptions }) {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedMain, setSelectedMain] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});

  const defaultServices = [
    { name: "خشکشویی", price: 50000 },
    { name: "اتو", price: 30000 },
    { name: "خشکشویی ویژه", price: 90000 },
  ];

  const cardServices =
    cardOptions?.map((opt) => ({ ...opt, type: "select" })) || [];

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleMainSelect = (service) => {
    setSelectedMain(service);
    setQuantity(1);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleOptionToggle = (groupName, value, price = 0) => {
    setSelectedOptions((prev) => {
      const prevSet = prev[groupName] || [];
      if (prevSet.includes(value)) {
        return { ...prev, [groupName]: prevSet.filter((v) => v !== value) };
      } else {
        return {
          ...prev,
          [groupName]: [...prevSet, value],
          [`${groupName}_price_${value}`]: price,
        };
      }
    });
  };

  const totalPrice =
    (selectedMain?.price || 0) * quantity +
    Object.entries(selectedOptions).reduce((sum, [key, value]) => {
      if (key.includes("_price_")) return sum;
      return (
        sum +
        value.reduce(
          (s, val) => s + (selectedOptions[`${key}_price_${val}`] || 0),
          0
        )
      );
    }, 0);

  const handleAdd = () => {
    if (!selectedMain) return;

    const items = [
      { name: selectedMain.name, qty: quantity, price: selectedMain.price },
      ...Object.entries(selectedOptions).flatMap(([key, vals]) => {
        if (key.includes("_price_")) return [];
        return vals.map((val) => ({
          name: `${key}: ${val}`,
          qty: 1,
          price: selectedOptions[`${key}_price_${val}`] || 0,
        }));
      }),
    ];

    onAddToCart(items);
    setSelectedMain(null);
    setQuantity(1);
    setSelectedOptions({});
    onClose();
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/40 z-[9999] flex justify-center items-end md:items-center"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-bl from-sky-50 via-sky-100 to-sky-200 dark:bg-gray-800 rounded-t-3xl md:rounded-2xl 
             w-full md:w-[550px] max-h-[80vh] md:max-h-[80vh]
             shadow-lg p-5 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div dir="rtl" className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-sky-700 dark:text-purple-400">
            خدمات قابل انتخاب
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* محتوا */}
<div
  dir="rtl"
  className="flex-1 overflow-y-auto space-y-4 pb-2 px-1"
>

  {/* دسته‌بندی سرویس اصلی */}
  <div className="flex gap-2 flex-wrap justify-center text-center">
    {defaultServices.map((service) => (
      <button
        key={service.name}
        onClick={() => handleMainSelect(service)}
        className={`px-4 py-2 rounded-2xl text-sm font-medium shadow-sm transition-all ${
          selectedMain?.name === service.name
            ? "bg-sky-600 text-white scale-105 shadow-md"
            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
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
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600"
      >
        -
      </button>
      <span className="w-8 text-center text-lg font-semibold">
        {quantity}
      </span>
      <button
        onClick={() => handleQuantityChange(1)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600"
      >
        +
      </button>
    </div>
  )}

  {/* گزینه‌های کارتی */}
  {cardServices.map((item) => (
    <div
      key={item.name}
      className="rounded-xl p-3 bg-white/50 dark:bg-gray-700/30 shadow-sm"
    >
      <span className="block font-semibold text-gray-700 dark:text-gray-200 mb-3 text-sm">
        {item.name}
      </span>

      <div className="flex gap-2 flex-wrap">
        {item.choices?.map((choice) => (
          <button
            key={choice.value || choice.label}
            onClick={() =>
              handleOptionToggle(item.name, choice.label, choice.price)
            }
            className={`px-3 py-1 rounded-xl border text-sm flex-shrink-0 transition ${
              selectedOptions[item.name]?.includes(choice.label)
                ? "bg-sky-600 text-white border-sky-600 shadow-md"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
            }`}
          >
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  ))}

</div>


        <div className="sticky bottom-0 border-t p-4 flex justify-between items-center bg-gradient-to-r from-sky-200 via-sky-100 to-sky-50 dark:bg-gray-800">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            مجموع: {totalPrice.toLocaleString()} تومان
          </span>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
            disabled={!selectedMain}
          >
            افزودن به سبد
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
