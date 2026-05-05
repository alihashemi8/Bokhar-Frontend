import { useState } from "react";
import ServiceModal from "./services_modal/ServiceModal";
import api from "../api/clientApi";
import DiscountBadgeClient from "./DiscountBadgeClient";

export default function Card({ id, image, title, base_price, category }) {
  const [open, setOpen] = useState(false);
  const [pricing, setPricing] = useState(null);

  const openModal = async () => {
    try {
      const res = await api.getProduct(id);
      setPricing(res.pricing);
      setOpen(true);
    } catch (err) {
      console.log("Error loading pricing", err);
    }
  };

  return (
    <div dir="rtl" className="relative p-4 rounded-2xl bg-white/70 dark:bg-neutral-800/80 backdrop-blur-lg border border-sky-200 dark:border-indigo-600 shadow-xl flex flex-col justify-between min-h-[280px] hover:scale-[1.03] transition-all duration-300 group">
      <DiscountBadgeClient product={{ id, title, image, base_price, pricing, category }} />
      
      <div className="w-full aspect-[4/3] mb-3 overflow-hidden rounded-xl border border-sky-200 dark:border-indigo-600 shadow">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
      
      <div className="flex-1 flex flex-col justify-between gap-3">
        <h3 className="font-bold text-center truncate text-slate-800 dark:text-gray-100 px-2">
          {title}
        </h3>

        <button
          onClick={openModal}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800 border border-sky-200 dark:border-indigo-600 shadow-lg text-gray-800 dark:text-white font-semibold hover:scale-105 transition-all active:scale-95"
        >
          خدمات
        </button>
      </div>

      <ServiceModal
        isOpen={open}
        onClose={() => setOpen(false)}
        pricing={pricing || {}}
        itemTitle={title}
      />
    </div>
  );
}
