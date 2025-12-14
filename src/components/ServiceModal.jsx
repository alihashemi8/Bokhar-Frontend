import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ServiceModal({ onClose, cardOptions }) {
  const { addToCart } = useCart();

  const [isMobile, setIsMobile] = useState(false);
  const [selectedMain, setSelectedMain] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [dragY, setDragY] = useState(0);

  const defaultServices = [
    { name: "خشکشویی", price: 50000 },
    { name: "اتو", price: 30000 },
    { name: "خشکشویی ویژه", price: 90000 },
  ];

  const cardServices =
    cardOptions?.map((opt) => ({ ...opt, type: "select" })) || [];

  /* ---------------- Detect Mobile ---------------- */
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  /* ---------------- Lock Scroll ---------------- */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  /* ---------------- iOS Drag ---------------- */
  const handleDragStart = (e) => {
    if (!isMobile) return;

    const startY = e.touches[0].clientY;

    const move = (ev) => {
      const diff = ev.touches[0].clientY - startY;
      setDragY(Math.max(0, diff));
    };

    const end = () => {
      if (dragY > 120) onClose();
      setDragY(0);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };

    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", end);
  };

  /* ---------------- Handlers ---------------- */
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
      return prevSet.includes(value)
        ? { ...prev, [groupName]: prevSet.filter((v) => v !== value) }
        : {
            ...prev,
            [groupName]: [...prevSet, value],
            [`${groupName}_price_${value}`]: price,
          };
    });
  };

  /* ---------------- Price ---------------- */
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

  /* ---------------- Add To Cart ---------------- */
  const handleAdd = () => {
    if (!selectedMain) return;

    const options = {};
    Object.entries(selectedOptions).forEach(([key, val]) => {
      if (!key.includes("_price_")) options[key] = val;
    });

    // سرویس اصلی
    addToCart({
      id: selectedMain.name,
      name: selectedMain.name,
      price: selectedMain.price,
      qty: quantity,
      options,
    });

    // آپشن‌ها (هرکدوم آیتم جدا)
    Object.entries(selectedOptions).forEach(([key, vals]) => {
      if (key.includes("_price_")) return;

      vals.forEach((val) => {
        addToCart({
          id: `${key}-${val}`,
          name: `${key}: ${val}`,
          price: selectedOptions[`${key}_price_${val}`] || 0,
          qty: 1,
          options: {},
        });
      });
    });

    setSelectedMain(null);
    setQuantity(1);
    setSelectedOptions({});
    onClose();
  };

  /* ---------------- Render ---------------- */
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/40 z-[9999] flex justify-center md:items-center backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleDragStart}
        style={{
          transform: `translateY(${dragY}px)`,
          transition: dragY === 0 ? "transform 0.25s ease-out" : "none",
        }}
        className={`
          bg-gradient-to-bl from-sky-50 via-sky-100 to-sky-200 dark:bg-gray-800
          rounded-t-[32px] md:rounded-3xl
          w-full md:w-[550px]
          max-h-[88vh]
          mt-auto
          overflow-hidden
          shadow-[0_-8px_20px_rgba(0,0,0,0.15)]
          p-5 flex flex-col
          ${isMobile ? "animate-slide-up-ios" : ""}
        `}
      >
        {/* Drag Handle */}
        <div className="w-12 h-1.5 bg-gray-300/70 dark:bg-gray-500/50 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div dir="rtl" className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">خدمات قابل انتخاب</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Content */}
        <div
          dir="rtl"
          className="flex-1 overflow-y-auto space-y-4 pb-2 px-1"
        >
          {/* Main Services */}
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

          {/* Quantity */}
          {selectedMain && (
            <div className="flex items-center gap-4 justify-center">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600"
              >
                -
              </button>
              <span className="w-10 text-center font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600"
              >
                +
              </button>
            </div>
          )}

          {/* Options */}
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
                      handleOptionToggle(
                        item.name,
                        choice.label,
                        choice.price
                      )
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
