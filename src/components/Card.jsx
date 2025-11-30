import { useState } from "react";
import ServiceModal from "./ServiceModal";

export default function Card({ id, image, title, basePrice, options, onAddToCart }) {
  const [open, setOpen] = useState(false);

  const handleAddToCart = (items) => {
    // جمع کردن آیتم‌ها با قیمت پایه
    const cartItems = [
      { name: title, qty: 1, price: basePrice },
      ...items,
    ];
    if (onAddToCart) onAddToCart(cartItems);
  };

  return (
<div
  dir="rtl"
  className="bg-sky-100/40 dark:bg-gray-800 h-5/6 rounded-2xl shadow-lg shadow-pink-300 hover:shadow-xl 
             border-2 border-sky-100 transition hover:scale-103 flex flex-col"
>
      {/* تصویر */}
      <div className="w-full h-56 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
        <img
          src={image}
          alt={title}
          className="max-h-full max-w-full object-contain p-2"
        />
      </div>

      {/* توضیحات */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold mb-4 text-center">{title}</h3>

        {/* قیمت پایه */}
        <p className="text-lg font-semibold text-center text-amber-500 mb-3">
          {basePrice.toLocaleString()} تومان
        </p>

        {/* دکمه باز کردن مودال */}
        <button
          onClick={() => setOpen(true)}
          className="w-full py-2 rounded-lg font-medium bg-sky-400/80 text-white hover:bg-sky-600 transition"
        >
          خدمات
        </button>
      </div>

      {/* مودال خدمات */}
      {open && (
        <ServiceModal
          onClose={() => setOpen(false)}
          onAddToCart={handleAddToCart}
          cardOptions={options}
        />
      )}
    </div>
  );
}
