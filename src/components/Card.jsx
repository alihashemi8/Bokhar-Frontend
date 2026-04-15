import { useState } from "react";
import ServiceModal from "./services_modal/ServiceModal";
import api from "../api/clientApi";

export default function Card({ id, image, title, base_price }) {
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
  <div dir="rtl" className="rounded-xl shadow-md p-2">
    <img src={image} alt={title} className="h-32 mx-auto" />
    <h3 className="text-center font-bold">{title}</h3>

    <button
      onClick={openModal}
      className="w-full py-2 mt-3 bg-sky-600 text-white rounded-lg"
    >
      خدمات
    </button>

    <ServiceModal
      isOpen={open}                    // ← کنترل باز/بسته بودن
      onClose={() => setOpen(false)}
      pricing={pricing || {}}          // ← null نباشه
      itemTitle={title}
    />
  </div>
);

}
