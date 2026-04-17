import { useState, useEffect } from "react";
import BaseModal from "../../../basemodal/BaseModal";

import {
  fetchServiceTabs,
  fetchServiceMaterials,
  createProductDiscount
} from "../../../../api/discountsApi";

export default function DiscountModal({ isOpen, onClose, service }) {
  const [materials, setMaterials] = useState([]);
  const [tabs, setTabs] = useState([]);

  const [target, setTarget] = useState("product");
  const [type, setType] = useState("percent");
  const [value, setValue] = useState("");
  const [material, setMaterial] = useState("");
  const [priceTab, setPriceTab] = useState("");

  useEffect(() => {
    if (service?.id) {
      loadTabs();
      loadMaterials();
    }
  }, [service]);

  const loadTabs = async () => {
    const data = await fetchServiceTabs(service.id);
    setTabs(data);
  };

  const loadMaterials = async () => {
    const data = await fetchServiceMaterials(service.id);
    setMaterials(data);
  };

  const submit = async () => {
    await createProductDiscount({
      service: service.id,
      target,
      type,
      value,
      material: target === "material" ? material : null,
      price_tab: target === "price_tab" ? priceTab : null,
    });

    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`تنظیم تخفیف برای ${service?.title ?? ""}`}
      maxWidth="lg"
    >
      <div className="flex flex-col gap-4">

        {/* هدف */}
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/50 dark:bg-white/10 border"
        >
          <option value="product">کل سرویس</option>
          <option value="category">دسته‌بندی سرویس</option>
          <option value="material">جنس‌ها</option>
          <option value="price_tab">تب قیمت‌ها</option>
        </select>

        {target === "material" && (
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/50 dark:bg-white/10 border"
          >
            <option value="">انتخاب جنس</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        )}

        {target === "price_tab" && (
          <select
            value={priceTab}
            onChange={(e) => setPriceTab(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/50 dark:bg-white/10 border"
          >
            <option value="">انتخاب تب قیمت</option>
            {tabs.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        )}

        {/* نوع تخفیف */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/50 dark:bg-white/10 border"
        >
          <option value="percent">درصدی</option>
          <option value="amount">مبلغ</option>
        </select>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="مقدار تخفیف..."
          className="w-full p-3 rounded-xl bg-white/50 dark:bg-white/10 border"
        />

        <div className="flex justify-between pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-xl"
          >
            بستن
          </button>

          <button
            onClick={submit}
            className="px-4 py-2 bg-purple-700 text-white rounded-xl"
          >
            ذخیره
          </button>
        </div>

      </div>
    </BaseModal>
  );
}
