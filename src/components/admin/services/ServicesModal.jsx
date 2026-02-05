import { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import BaseModal from "../../basemodal/BaseModal";

const tabs = ["اتو", "خشکشویی", "سفیدشویی", "ویژه"];
const materials = ["چرم", "مخمل", "نخی", "کتان"];
const emptyPricing = { materialPrices: {}, sizeType: "" };

// Toast با portal و نمایش بالای صفحه
function Toast({ message, type = "error", onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return createPortal(
    <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-xl text-white ${type === "error" ? "bg-red-500" : "bg-green-500"} shadow-lg z-[9999]`}>
      <div className="flex items-center justify-between gap-4">
        <span>{message}</span>
        <button onClick={onClose} className="font-bold">×</button>
      </div>
    </div>,
    document.body
  );
}

function MaterialPriceInput({ mat, value, onToggle, onChange }) {
  const active = value !== undefined;
  return (
    <div className="flex gap-3">
      <button
        onClick={onToggle}
        className={`px-3 py-2 rounded-xl transition ${
          active ? "bg-purple-600 text-white" : "bg-gray-100"
        }`}
        aria-label={`toggle ${mat}`}
      >
        {mat}
      </button>
      {active && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="قیمت"
          className="flex-1 p-2 rounded-xl bg-gray-100"
        />
      )}
    </div>
  );
}

function SizeSelector({ value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 text-sm rounded-xl bg-gray-100 appearance-none"
      >
        <option value="">نوع ابعاد</option>
        <option value="singleDouble">تک / دو نفره</option>
        <option value="meter">متراژی</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs">
        ▼
      </div>
    </div>
  );
}

export default function ServicesModal({ isOpen, onClose, categories, editItem, onSave }) {
  const initialPricing = useMemo(
    () => tabs.reduce((acc, tab) => ({ ...acc, [tab]: { ...emptyPricing } }), {}),
    []
  );

  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState({
    title: "",
    category: categories[0] || "",
    pricing: initialPricing,
  });

  const [toast, setToast] = useState({ message: "", type: "error" });

  useEffect(() => {
    if (editItem) {
      setForm({
        title: editItem.title || "",
        category: editItem.category || categories[0] || "",
        pricing: { ...initialPricing, ...editItem.pricing },
      });
    }
  }, [editItem, categories, initialPricing]);

  const currentTab = tabs[activeTab];
  const data = form.pricing[currentTab];

  const setPricingField = useCallback((field, value) => {
    setForm((f) => ({
      ...f,
      pricing: {
        ...f.pricing,
        [currentTab]: {
          ...f.pricing[currentTab],
          [field]: value,
        },
      },
    }));
  }, [currentTab]);

  const toggleMaterial = useCallback((mat) => {
    setForm((f) => {
      const active = f.pricing[currentTab].materialPrices[mat] !== undefined;
      const newMaterials = active
        ? Object.fromEntries(
            Object.entries(f.pricing[currentTab].materialPrices).filter(([k]) => k !== mat)
          )
        : { ...f.pricing[currentTab].materialPrices, [mat]: "" };
      return {
        ...f,
        pricing: {
          ...f.pricing,
          [currentTab]: {
            ...f.pricing[currentTab],
            materialPrices: newMaterials,
          },
        },
      };
    });
  }, [currentTab]);

  const setMaterialPrice = useCallback((mat, value) => {
    setPricingField("materialPrices", {
      ...data.materialPrices,
      [mat]: value,
    });
  }, [data.materialPrices, setPricingField]);

  const handleSave = () => {
    if (!form.title) {
      setToast({ message: "لطفاً عنوان سرویس را وارد کنید.", type: "error" });
      return;
    }
    if (Object.keys(data.materialPrices).length === 0) {
      setToast({ message: "حداقل یک جنس را انتخاب کنید.", type: "error" });
      return;
    }
    setToast({ message: "سرویس با موفقیت ذخیره شد!", type: "success" });
    onSave(form);
  };

  const isValid = useMemo(() => form.title && Object.keys(data.materialPrices).length > 0, [form.title, data.materialPrices]);

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title={editItem ? "ویرایش سرویس" : "سرویس جدید"}
      >
        <div dir="rtl" className="space-y-4 max-h-[80vh] overflow-y-auto">
          {/* عنوان و دسته‌بندی */}
          <div className="flex gap-2 mt-1 mb-2">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="عنوان سرویس"
              className="flex-1 h-10 px-3 text-sm rounded-xl bg-gray-100"
            />
            <div className="flex-1 relative">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-10 px-3 text-sm rounded-xl bg-gray-100 appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="flex relative gap-1 z-10 -mb-0.5">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex-1 py-2 text-sm border rounded-t-xl transition ${
                  activeTab === i
                    ? "bg-white border-gray-200 border-b-white z-20 font-semibold"
                    : "bg-gray-200 border-transparent text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* جنس‌ها و ابعاد */}
          <div className="bg-white border border-gray-200 rounded-b-xl p-3 max-h-[50vh] overflow-y-auto">
            <div className="mb-5">
              <div className="text-sm font-semibold mb-2">جنس‌ها</div>
              <div className="space-y-3">
                {materials.map((mat) => (
                  <MaterialPriceInput
                    key={mat}
                    mat={mat}
                    value={data.materialPrices[mat]}
                    onToggle={() => toggleMaterial(mat)}
                    onChange={(v) => setMaterialPrice(mat, v)}
                  />
                ))}
              </div>

              <div className="mt-4">
                <div className="text-sm font-semibold mb-2">ابعاد</div>
                <SizeSelector
                  value={data.sizeType}
                  onChange={(v) => setPricingField("sizeType", v)}
                />
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-between">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-200">
              انصراف
            </button>
            <button
              onClick={handleSave}
              disabled={!isValid}
              className="px-6 py-2 rounded-xl bg-purple-600 text-white disabled:opacity-50"
            >
              ذخیره
            </button>
          </div>
        </div>
      </BaseModal>

      {/* Toast بالای صفحه */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "error" })}
      />
    </>
  );
}
