import { useEffect, useState, useCallback } from "react";
import BaseModal from "../../../basemodal/BaseModal";
import {
  fetchProductFullPricing,
  createProductDiscount,
} from "../../../../api/discountsApi";

function MaterialDiscountInput({
  material,
  basePrice,
  value,
  onToggle,
  onChange,
}) {
  const active = value !== undefined && value !== "" && value !== null;

  return (
    <div className="flex gap-3 items-center">
      <button
        type="button"
        onClick={onToggle}
        className={`px-3 py-2 rounded-xl transition min-w-[70px] ${
          active
            ? "bg-purple-600 text-white"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {material}
      </button>

      {active && (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="درصد"
          className="flex-1 p-2 rounded-xl bg-gray-100"
          min="0"
          max="100"
        />
      )}
    </div>
  );
}

function PriceDisplay({ basePrice, discountPercent }) {
  const hasDiscount = discountPercent !== undefined && discountPercent !== "" && !isNaN(discountPercent);

  if (!hasDiscount) {
    return (
      <div className="text-xs text-gray-500">
        قیمت: {basePrice?.toLocaleString()} تومان
      </div>
    );
  }

  const discount = Number(discountPercent);
  const originalPrice = Number(basePrice);
  const discountedPrice = originalPrice - (originalPrice * discount / 100);

  return (
    <div className="flex items-center space-x-2 text-xs">
      <span className="text-red-600 line-through">
        {originalPrice?.toLocaleString()} تومان
      </span>
      <span className="text-green-600 font-semibold">
        {Math.floor(discountedPrice)?.toLocaleString()} تومان
        <span className="text-gray-500 mr-1">({discount}% تخفیف)</span>
      </span>
    </div>
  );
}

export default function DiscountModal({
  isOpen,
  onClose,
  product,
  category,
}) {
  const [loading, setLoading] = useState(false);

  const [tabs, setTabs] = useState([]);
  const [pricing, setPricing] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const [discounts, setDiscounts] = useState({});

  const target = product || category;

  useEffect(() => {
    if (!isOpen || !product?.id) return;

    (async () => {
      try {
        setLoading(true);

        const data = await fetchProductFullPricing(product.id);

        const tabNames = Object.keys(data.pricing);

        setTabs(tabNames);
        setPricing(data.pricing);

        const empty = {};
        tabNames.forEach((t) => {
          empty[t] = {
            type: "percent",
            materialDiscounts: {},
          };
        });

        setDiscounts(empty);
        setActiveTab(0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, product]);

  const currentTab = tabs[activeTab];
  const tabPricing = pricing[currentTab] || { materialPrices: [] };
  const tabForm = discounts[currentTab] || { materialDiscounts: {} };

  const toggleMaterial = useCallback(
    (material) => {
      setDiscounts((prev) => {
        const current = prev[currentTab]?.materialDiscounts || {};
        const active = current[material] !== undefined && current[material] !== "";

        const updated = { ...current };

        if (active) {
          delete updated[material];
        } else {
          updated[material] = "0";
        }

        return {
          ...prev,
          [currentTab]: {
            ...prev[currentTab],
            materialDiscounts: updated,
          },
        };
      });
    },
    [currentTab]
  );

  const changeDiscount = useCallback(
    (material, value) => {
      let validValue = value;
      if (value !== "") {
        const numValue = Number(value);
        if (numValue < 0) validValue = "0";
        if (numValue > 100) validValue = "100";
      }

      setDiscounts((prev) => ({
        ...prev,
        [currentTab]: {
          ...prev[currentTab],
          materialDiscounts: {
            ...prev[currentTab].materialDiscounts,
            [material]: validValue,
          },
        },
      }));
    },
    [currentTab]
  );

  const handleSave = async () => {
    const clean = {};

    for (const [tab, data] of Object.entries(discounts)) {
      const materials = {};

      for (const [mat, val] of Object.entries(data.materialDiscounts)) {
        if (val !== "" && !isNaN(val) && val !== null) {
          materials[mat] = Number(val);
        }
      }

      if (Object.keys(materials).length) {
        clean[tab] = {
          type: "percent",
          materialDiscounts: materials,
        };
      }
    }

    if (!Object.keys(clean).length) return;

    try {
      setLoading(true);

      await createProductDiscount({
        product: product.id,
        discounts: clean,
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert("خطا در ذخیره تخفیف");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`تنظیم تخفیف برای ${target?.title || target?.name || ""}`}
      maxWidth="lg"
    >
      <div dir="rtl" className="space-y-4 max-h-[80vh] px-3 overflow-y-auto">
        {loading && (
          <div className="text-center py-6">
            در حال دریافت اطلاعات...
          </div>
        )}

        {!loading && tabs.length > 0 && (
          <>
            <div className="flex relative gap-1 z-10 -mb-0.5 pt-5">
              {tabs.map((tab, i) => {
                const hasData =
                  discounts[tab] &&
                  Object.keys(discounts[tab].materialDiscounts).length > 0;
                
                return (
                  <button
                    key={tab}
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

            <div className="bg-white border border-gray-200 rounded-b-xl p-3 space-y-4 max-h-[50vh] overflow-y-auto">
              {tabPricing.materialPrices.length === 0 && (
                <div className="text-center text-sm text-gray-500">
                  متریالی برای این تب وجود ندارد
                </div>
              )}

              {tabPricing.materialPrices.map((mat) => (
                <div key={mat.material} className="space-y-2">
                  <MaterialDiscountInput
                    material={mat.material}
                    basePrice={mat.price}
                    value={tabForm.materialDiscounts[mat.material]}
                    onToggle={() => toggleMaterial(mat.material)}
                    onChange={(v) => changeDiscount(mat.material, v)}
                  />
                  
                  <div className="mr-[80px]">
                    <PriceDisplay 
                      basePrice={mat.price}
                      discountPercent={tabForm.materialDiscounts[mat.material]}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
            disabled={loading}
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-purple-600 text-white disabled:opacity-50 hover:bg-purple-700 transition"
          >
            {loading ? "در حال ذخیره..." : "ذخیره"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
