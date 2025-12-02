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
  className="bg-sky-100/40 dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl shadow-pink-200
             border-2 border-sky-100 transition-transform hover:scale-105 flex flex-col"
>
  {/* تصویر */}
  <div className="w-full h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-t-2xl">
    <img
      src={image}
      alt={title}
      className="max-h-full max-w-full object-contain p-2"
    />
  </div>

  {/* توضیحات */}
  <div className="p-3 flex flex-col flex-1">
    <h3 className="text-lg font-bold mb-2 text-center">{title}</h3>

    <p className="text-lg font-semibold text-center text-amber-500 mb-3">
      {basePrice.toLocaleString()} تومان
    </p>

    <button
      onClick={() => setOpen(true)}
      className="w-full py-2 rounded-lg font-medium bg-sky-600 text-white hover:bg-sky-700 transition"
    >
      خدمات
    </button>
  </div>

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
