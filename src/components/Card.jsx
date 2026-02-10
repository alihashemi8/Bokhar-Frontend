import { useState } from "react";
import ServiceModal from "./services_modal/ServiceModal";

export default function Card({
  id,
  image,
  title,
  basePrice,
  options,
  onAddToCart,
}) {
  const [open, setOpen] = useState(false);

  const handleAddToCart = (items) => {
    const cartItems = [{ name: title, qty: 1, price: basePrice }, ...items];
    if (onAddToCart) onAddToCart(cartItems);
  };

  return (
    <div
      dir="rtl"
      className="
        bg-sky-100/40 dark:bg-sky-950/50 
        rounded-2xl shadow-lg hover:shadow-xl shadow-indigo-300
        border border-indigo-200 dark:border-indigo-500 ring ring-indigo-200 dark:ring-indigo-500
        transition-transform hover:scale-[1.02]
        flex flex-col
      "
    >
      {/* تصویر */}
      <div
        className="
          w-full
          h-24 sm:h-28 md:h-48
          flex items-center justify-center
          bg-gray-100 dark:bg-sky-950/30 
          rounded-t-2xl
        "
      >
        <img
          src={image}
          alt={title}
          className="max-h-full max-w-full object-contain p-2"
        />
      </div>

      {/* توضیحات */}
      <div className="p-2 sm:p-3 flex flex-col flex-1">
        <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 text-center">
          {title}
        </h3>

        <button
          onClick={() => setOpen(true)}
          className="
            w-full py-1.5 sm:py-2 mt-4
            rounded-lg font-medium
            text-sm sm:text-base text-white transition
            bg-sky-600 text-whitehover:bg-sky-700 
            bg-gradient-to-r dark:from-purple-700 dark:to-purple-800 
          "
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
