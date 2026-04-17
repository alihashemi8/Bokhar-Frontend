import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import BaseModal from "../../../basemodal/BaseModal";
import {
  fetchServiceTabs,
  fetchServiceMaterials,
  createProductDiscount,
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

  const isValid = value && service;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`تنظیم تخفیف برای ${service?.title ?? ""}`}
      maxWidth="lg"
    >
      <div dir="rtl" className="space-y-4 max-h-[80vh] overflow-y-auto">
        {/* هدف تخفیف */}
        <div className="relative">
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full h-10 px-3 text-sm rounded-xl bg-gray-100 appearance-none"
          >
            <option value="product">کل سرویس</option>
            <option value="category">دسته‌بندی سرویس</option>
            <option value="material">جنس</option>
            <option value="price_tab">تب قیمت</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs">
            ▼
          </div>
        </div>

        {/* انتخاب جنس */}
        {target === "material" && (
          <div className="relative">
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-xl bg-gray-100 appearance-none"
            >
              <option value="">انتخاب جنس</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs">
              ▼
            </div>
          </div>
        )}

        {/* انتخاب تب قیمت */}
        {target === "price_tab" && (
          <div className="relative">
            <select
              value={priceTab}
              onChange={(e) => setPriceTab(e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-xl bg-gray-100 appearance-none"
            >
              <option value="">انتخاب تب قیمت</option>
              {tabs.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs">
              ▼
            </div>
          </div>
        )}

        {/* نوع تخفیف */}
        <div className="relative">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full h-10 px-3 text-sm rounded-xl bg-gray-100 appearance-none"
          >
            <option value="percent">درصدی</option>
            <option value="amount">مبلغ ثابت</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs">
            ▼
          </div>
        </div>

        {/* مقدار */}
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="مقدار تخفیف"
          className="w-full h-10 px-3 text-sm rounded-xl bg-gray-100"
        />

        {/* Footer */}
        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
          >
            انصراف
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={!isValid}
            className="px-6 py-2 rounded-xl bg-purple-600 text-white disabled:opacity-50 hover:bg-purple-700 transition"
          >
            ذخیره
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
