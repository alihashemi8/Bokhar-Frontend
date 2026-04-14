// ServicesModal.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import BaseModal from "../../basemodal/BaseModal";

const tabs = ["اتو", "خشکشویی", "سفیدشویی", "ویژه"];
const materials = ["چرم", "مخمل", "نخی", "کتان"];

const makeEmptyPricing = () =>
  tabs.reduce(
    (acc, tab) => ({ ...acc, [tab]: { materialPrices: {}, sizeType: "" } }),
    {}
  );

// ادغام pricing ذخیره‌شده با ساختار پایه
const mergePricing = (saved = {}) => {
  const base = makeEmptyPricing();

  for (const tab of tabs) {
    const tabData = saved?.[tab];
    if (!tabData) continue;

    let materialPrices = {};

    // اگر backend فرمت آرایه فرستاده بود
    if (Array.isArray(tabData.materialPrices)) {
      materialPrices = Object.fromEntries(
        tabData.materialPrices.map((mp) => [mp.material, mp.price])
      );
    }

    // اگر دیکشنری بود (فرمت قدیمی/فرانت)
    else if (typeof tabData.materialPrices === "object") {
      materialPrices = tabData.materialPrices;
    }

    base[tab] = {
      materialPrices,
      sizeType: tabData.sizeType || "",
    };
  }

  return base;
};



function Toast({ message, type = "error", onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return createPortal(
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-white shadow-xl z-[9999] flex items-center gap-4 ${
        type === "error" ? "bg-red-500" : "bg-green-500"
      }`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="font-bold text-lg leading-none">
        ×
      </button>
    </div>,
    document.body
  );
}

function MaterialPriceInput({ mat, value, onToggle, onChange }) {
  const active = value !== undefined && value !== null;
  return (
    <div className="flex gap-3 items-center">
      <button
        type="button"
        onClick={onToggle}
        className={`px-3 py-2 rounded-xl transition min-w-[60px] ${
          active ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700"
        }`}
      >
        {mat}
      </button>
      {active && (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="قیمت (تومان)"
          className="flex-1 p-2 rounded-xl bg-gray-100"
          min="0"
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

export default function ServicesModal({
  isOpen,
  onClose,
  categories,
  editItem,
  onSave,
  isLoading,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState({
    title: "",
    category: categories[0] || "",
    pricing: makeEmptyPricing(),
  });
  const [toast, setToast] = useState({ message: "", type: "error" });

  // هر بار که مودال باز میشه یا editItem عوض میشه، فرم ریست/پر میشه
  useEffect(() => {
    setActiveTab(0);
    if (editItem) {
      setForm({
        title: editItem.title || "",
        category: editItem.category || categories[0] || "",
        pricing: mergePricing(editItem.pricing),
      });
    } else {
      setForm({
        title: "",
        category: categories[0] || "",
        pricing: makeEmptyPricing(),
      });
    }
  }, [editItem, isOpen, categories]); // isOpen هم اضافه شد تا با هر بار باز شدن ریست شه

  const currentTab = tabs[activeTab];
  const data = form.pricing[currentTab];

  const setPricingField = useCallback(
    (field, value) => {
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
    },
    [currentTab]
  );

  const toggleMaterial = useCallback(
    (mat) => {
      setForm((f) => {
        const currentPrices = f.pricing[currentTab].materialPrices;
        const active =
          currentPrices[mat] !== undefined && currentPrices[mat] !== null;
        const newMaterials = active
          ? Object.fromEntries(
              Object.entries(currentPrices).filter(([k]) => k !== mat)
            )
          : { ...currentPrices, [mat]: "" };
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
    },
    [currentTab]
  );

  const setMaterialPrice = useCallback(
    (mat, value) => {
      setForm((f) => ({
        ...f,
        pricing: {
          ...f.pricing,
          [currentTab]: {
            ...f.pricing[currentTab],
            materialPrices: {
              ...f.pricing[currentTab].materialPrices,
              [mat]: value,
            },
          },
        },
      }));
    },
    [currentTab]
  );

  const validateForm = () => {
    if (!form.title.trim()) {
      setToast({ message: "لطفاً عنوان سرویس را وارد کنید.", type: "error" });
      return false;
    }
    if (!form.category) {
      setToast({ message: "لطفاً دسته‌بندی را انتخاب کنید.", type: "error" });
      return false;
    }

    let hasAnyMaterial = false;
    for (const tab of tabs) {
      const tabData = form.pricing[tab];
      if (
        tabData.materialPrices &&
        Object.keys(tabData.materialPrices).length > 0
      ) {
        hasAnyMaterial = true;
        for (const [mat, price] of Object.entries(tabData.materialPrices)) {
          if (!price || isNaN(parseInt(price)) || parseInt(price) < 0) {
            setToast({
              message: `قیمت "${mat}" در تب "${tab}" نامعتبر است.`,
              type: "error",
            });
            return false;
          }
        }
      }
    }

    if (!hasAnyMaterial) {
      setToast({
        message: "حداقل برای یک تب، یک جنس انتخاب کنید.",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const cleanPricing = {};
    for (const [tab, tabData] of Object.entries(form.pricing)) {
      const cleanMaterials = {};
      for (const [mat, price] of Object.entries(tabData.materialPrices || {})) {
        if (price !== "" && price !== null && price !== undefined) {
          cleanMaterials[mat] = String(price);
        }
      }
      if (Object.keys(cleanMaterials).length > 0 || tabData.sizeType) {
        cleanPricing[tab] = {
          materialPrices: cleanMaterials,
          sizeType: tabData.sizeType || "",
        };
      }
    }

    onSave({ ...form, pricing: cleanPricing });
  };

  const isValid = form.title.trim() && form.category;

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
              disabled={isLoading}
            />
            <div className="flex-1 relative">
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full h-10 px-3 text-sm rounded-xl bg-gray-100 appearance-none"
                disabled={isLoading}
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

          {/* Tabs */}
          <div className="flex relative gap-1 z-10 -mb-0.5">
            {tabs.map((tab, i) => {
              const hasData =
                form.pricing[tab]?.materialPrices &&
                Object.keys(form.pricing[tab].materialPrices).length > 0;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  className={`flex-1 py-2 text-sm border rounded-t-xl transition relative ${
                    activeTab === i
                      ? "bg-white border-gray-200 border-b-white z-20 font-semibold"
                      : "bg-gray-200 border-transparent text-gray-500"
                  }`}
                >
                  {tab}
                  {hasData && activeTab !== i && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* محتوای تب */}
          <div className="bg-white border border-gray-200 rounded-b-xl p-3 max-h-[50vh] overflow-y-auto">
            <div className="mb-5">
              <div className="text-sm font-semibold mb-2 text-gray-700">
                جنس‌ها
              </div>
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
                <div className="text-sm font-semibold mb-2 text-gray-700">
                  ابعاد
                </div>
                <SizeSelector
                  value={data.sizeType}
                  onChange={(v) => setPricingField("sizeType", v)}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
              disabled={isLoading}
            >
              انصراف
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isValid || isLoading}
              className="px-6 py-2 rounded-xl bg-purple-600 text-white disabled:opacity-50 hover:bg-purple-700 transition"
            >
              {isLoading ? "در حال ذخیره..." : "ذخیره"}
            </button>
          </div>
        </div>
      </BaseModal>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "error" })}
      />
    </>
  );
}
