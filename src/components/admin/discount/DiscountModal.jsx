import { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import BaseModal from "../../basemodal/BaseModal";

// Toast
function Toast({ message, type = "error", onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return createPortal(
    <div className={`fixed top-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-white shadow-lg z-[9999] ${type === "error" ? "bg-red-500" : "bg-green-500"}`}>
      <div className="flex items-center gap-4">
        <span>{message}</span>
        <button onClick={onClose} className="font-bold">×</button>
      </div>
    </div>,
    document.body
  );
}

// انتخاب نوع تخفیف
function DiscountTypeSelector({ value, onChange }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange("percent")}
        className={`flex-1 py-1 rounded-xl text-xs ${value === "percent" ? "bg-purple-600 text-white" : "bg-gray-100"}`}
      >
        درصدی
      </button>
      <button
        onClick={() => onChange("amount")}
        className={`flex-1 py-1 rounded-xl text-xs ${value === "amount" ? "bg-purple-600 text-white" : "bg-gray-100"}`}
      >
        مبلغی
      </button>
    </div>
  );
}

// ردیف جنس برای تخفیف
function MaterialDiscountRow({ mat, value, onToggle, onChange }) {
  const active = value !== undefined;

  return (
    <div className="flex gap-2 items-start">
      <button
        onClick={onToggle}
        className={`px-3 py-2 rounded-xl text-sm shrink-0 ${active ? "bg-purple-600 text-white" : "bg-gray-100"}`}
      >
        {mat}
      </button>

      {active && (
        <div className="flex-1 flex gap-2">
          <DiscountTypeSelector
            value={value.type}
            onChange={(t) => onChange({ ...value, type: t })}
          />
          <input
            type="text"
            value={value.value}
            onChange={(e) => onChange({ ...value, value: e.target.value })}
            placeholder={value.type === "percent" ? "%" : "تومان"}
            className="flex-1 h-8 px-2 rounded-xl bg-gray-100 text-sm"
          />
        </div>
      )}
    </div>
  );
}

export default function DiscountModal({ isOpen, onClose, editItem, onSave }) {
  // استخراج تب‌ها و جنس‌ها از خود سرویس
  const tabs = useMemo(() => Object.keys(editItem?.pricing || {}), [editItem]);

  const materialsByTab = useMemo(() => {
    const result = {};
    tabs.forEach(tab => {
      result[tab] = Object.keys(editItem.pricing?.[tab]?.materialPrices || {});
    });
    return result;
  }, [tabs, editItem]);

  const emptyDiscount = { materialDiscounts: {} };

  const initialDiscount = useMemo(
    () => tabs.reduce((acc, t) => ({ ...acc, [t]: { ...emptyDiscount } }), {}),
    [tabs]
  );

  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState({
    discounts: initialDiscount
  });

  const [toast, setToast] = useState({ message: "", type: "error" });

  useEffect(() => {
    if (editItem?.discounts) {
      setForm({ discounts: { ...initialDiscount, ...editItem.discounts } });
    }
  }, [editItem, initialDiscount]);

  const currentTab = tabs[activeTab];
  const data = form.discounts[currentTab];

  const toggleMaterial = useCallback((mat) => {
    setForm(f => {
      const active = f.discounts[currentTab].materialDiscounts?.[mat] !== undefined;

      const newMats = active
        ? Object.fromEntries(
            Object.entries(f.discounts[currentTab].materialDiscounts).filter(([k]) => k !== mat)
          )
        : {
            ...f.discounts[currentTab].materialDiscounts,
            [mat]: { type: "percent", value: "" }
          };

      return {
        discounts: {
          ...f.discounts,
          [currentTab]: {
            ...f.discounts[currentTab],
            materialDiscounts: newMats
          }
        }
      };
    });
  }, [currentTab]);

  const setMaterialDiscount = useCallback((mat, value) => {
    setForm(f => ({
      discounts: {
        ...f.discounts,
        [currentTab]: {
          ...f.discounts[currentTab],
          materialDiscounts: {
            ...f.discounts[currentTab].materialDiscounts,
            [mat]: value
          }
        }
      }
    }));
  }, [currentTab]);

  const handleSave = () => {
    // حداقل یک جنس باید انتخاب شده باشه
    if (!data.materialDiscounts || Object.keys(data.materialDiscounts).length === 0) {
      setToast({ message: "حداقل یک جنس را انتخاب کنید.", type: "error" });
      return;
    }

    setToast({ message: "تخفیف با موفقیت ذخیره شد!", type: "success" });
    onSave(form);
  };

  const isValid = useMemo(
    () => Object.keys(data.materialDiscounts || {}).length > 0,
    [data.materialDiscounts]
  );

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="تعیین تخفیف"
      >
        <div dir="rtl" className="space-y-4 max-h-[80vh] overflow-y-auto">

          {/* تب‌ها */}
          <div className="flex gap-1 -mb-0.5">
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => setActiveTab(i)}
                className={`flex-1 py-2 text-sm rounded-t-xl border ${
                  activeTab === i
                    ? "bg-white border-gray-200 border-b-white font-semibold"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* اجناس */}
          <div className="bg-white border rounded-b-xl p-4 space-y-3">
            <div className="text-sm font-semibold">جنس‌ها</div>
            {materialsByTab[currentTab]?.map(mat => (
              <MaterialDiscountRow
                key={mat}
                mat={mat}
                value={data.materialDiscounts?.[mat]}
                onToggle={() => toggleMaterial(mat)}
                onChange={v => setMaterialDiscount(mat, v)}
              />
            ))}
          </div>

          {/* فوتر */}
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-200"
            >
              انصراف
            </button>
            <button
              disabled={!isValid}
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-purple-600 text-white disabled:opacity-50"
            >
              ذخیره
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
