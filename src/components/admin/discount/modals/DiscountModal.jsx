import { useEffect, useState, useCallback } from "react";
import BaseModal from "../../../basemodal/BaseModal";
import {
  fetchProductFullPricing,
  createProductDiscount,
} from "../../../../api/discountsApi";

// -------------------------
// Input Component
// -------------------------

function MaterialDiscountInput({
  material,
  percentValue,
  amountValue,
  onToggle,
  onChangePercent,
  onChangeAmount,
  active,
}) {
  const [activeType, setActiveType] = useState(null);

  useEffect(() => {
    if (!active) {
      setActiveType(null);
      return;
    }

    if (percentValue) setActiveType("percent");
    else if (amountValue) setActiveType("amount");
  }, [active, percentValue, amountValue]);

  const wrapperClass = (type) => {
    if (activeType === null) return "flex-1";
    if (activeType === type) return "flex-1";
    return "w-0 opacity-0";
  };

  const activateType = (e, type) => {
    e.stopPropagation();
    if (!activeType) setActiveType(type);
  };

  const reset = (e) => {
    e.stopPropagation();
    setActiveType(null);
    onChangePercent("");
    onChangeAmount("");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 items-center">
        <button
          type="button"
          onClick={onToggle}
          className={`px-3 py-2 rounded-xl transition min-w-[70px] ${
            active ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          {material}
        </button>

        {active && (
          <div className="flex gap-2 flex-1 h-12 select-none">
            {/* Percent */}
            <div
              onClick={(e) => activateType(e, "percent")}
              className={`relative overflow-hidden rounded-xl bg-gray-100 flex items-center transition-all duration-500 ease-in-out cursor-pointer ${wrapperClass(
                "percent"
              )}`}
            >
              <input
                type="number"
                value={percentValue ?? ""}
                onClick={(e) => activateType(e, "percent")}
                onChange={(e) => onChangePercent(e.target.value)}
                placeholder="درصد"
                disabled={activeType !== "percent"}
                className="w-full h-full px-3 bg-transparent outline-none"
                min="0"
                max="100"
              />

              <span className="absolute left-3 text-sm text-gray-500">٪</span>

              {activeType === "percent" && (
                <button
                  onClick={reset}
                  className="absolute right-3 text-gray-400"
                >
                  ×
                </button>
              )}
            </div>

            {/* Amount */}
            <div
              onClick={(e) => activateType(e, "amount")}
              className={`relative overflow-hidden rounded-xl bg-gray-100 flex items-center transition-all duration-500 ease-in-out cursor-pointer ${wrapperClass(
                "amount"
              )}`}
            >
              <input
                type="number"
                value={amountValue ?? ""}
                onClick={(e) => activateType(e, "amount")}
                onChange={(e) => onChangeAmount(e.target.value)}
                placeholder="مبلغ"
                disabled={activeType !== "amount"}
                className="w-full h-full px-3 bg-transparent outline-none"
                min="0"
              />

              <span className="absolute left-3 text-sm text-gray-500">
                تومان
              </span>

              {activeType === "amount" && (
                <button
                  onClick={reset}
                  className="absolute right-3 text-gray-400"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// -------------------------
// Price Display Component
// -------------------------
function PriceDisplay({ basePrice, percent, amount }) {
  const hasPercent =
    percent !== undefined && percent !== "" && !isNaN(percent);
  const hasAmount =
    amount !== undefined && amount !== "" && !isNaN(amount);

  if (!hasPercent && !hasAmount) {
    return (
      <div className="text-xs text-gray-500">
        قیمت: {basePrice?.toLocaleString()} تومان
      </div>
    );
  }

  const originalPrice = Number(basePrice);
  let discounted = originalPrice;

  if (hasAmount) {
    discounted -= Number(amount);
  } else if (hasPercent) {
    discounted -= (originalPrice * Number(percent)) / 100;
  }

  if (discounted < 0) discounted = 0;

  return (
    <div className="flex items-center space-x-2 text-xs">
      <span className="text-red-600 line-through">
        {originalPrice.toLocaleString()} تومان
      </span>

      <span className="text-green-600 font-semibold">
        {discounted.toLocaleString()} تومان

        <span className="text-gray-500 mr-1">
          (
          {hasAmount
            ? `${Number(amount).toLocaleString()} تومان`
            : `${percent}%`}
          تخفیف)
        </span>
      </span>
    </div>
  );
}

// -------------------------
// Main Discount Modal
// -------------------------
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

  const [discounts, setDiscounts] = useState({}); // { tab: { material: { percent, amount } } }

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
          empty[t] = {};
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
  const tabForm = discounts[currentTab] || {};

  // -------------------------
  // Toggle Material
  // -------------------------
  const toggleMaterial = useCallback(
    (material) => {
      setDiscounts((prev) => {
        const active = prev[currentTab]?.[material];

        const updated = { ...prev[currentTab] };

        if (active) delete updated[material];
        else updated[material] = { percent: "", amount: "" };

        return {
          ...prev,
          [currentTab]: updated,
        };
      });
    },
    [currentTab]
  );

  // -------------------------
  // Change Percent
  // -------------------------
  const changePercent = useCallback(
    (material, value) => {
      let v = value;
      if (v !== "") {
        const num = Number(v);
        if (num < 0) v = "0";
        if (num > 100) v = "100";
      }

      setDiscounts((prev) => ({
        ...prev,
        [currentTab]: {
          ...prev[currentTab],
          [material]: {
            ...prev[currentTab][material],
            percent: v,
          },
        },
      }));
    },
    [currentTab]
  );

  // -------------------------
  // Change Amount
  // -------------------------
  const changeAmount = useCallback(
    (material, value) => {
      let v = value;
      if (v !== "" && Number(v) < 0) v = "0";

      setDiscounts((prev) => ({
        ...prev,
        [currentTab]: {
          ...prev[currentTab],
          [material]: {
            ...prev[currentTab][material],
            amount: v,
          },
        },
      }));
    },
    [currentTab]
  );

  // -------------------------
  // Save
  // -------------------------
  const handleSave = async () => {
    const clean = {};

    for (const [tab, materials] of Object.entries(discounts)) {
      const filtered = {};

      for (const [mat, d] of Object.entries(materials)) {
        if (
          (d.percent !== "" && !isNaN(d.percent)) ||
          (d.amount !== "" && !isNaN(d.amount))
        ) {
          filtered[mat] = {};

          if (d.percent !== "") filtered[mat].percent = Number(d.percent);
          if (d.amount !== "") filtered[mat].amount = Number(d.amount);
        }
      }

      if (Object.keys(filtered).length) clean[tab] = filtered;
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
          <div className="text-center py-6">در حال دریافت اطلاعات...</div>
        )}

        {!loading && tabs.length > 0 && (
          <>
            <div className="flex gap-1 pt-5">
              {tabs.map((tab, i) => {
                const hasData =
                  discounts[tab] && Object.keys(discounts[tab]).length > 0;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(i)}
                    className={`flex-1 py-2 text-sm border rounded-t-xl transition relative ${
                      activeTab === i
                        ? "bg-white border-gray-200 border-b-white font-semibold"
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

              {tabPricing.materialPrices.map((mat) => {
                const saved = tabForm[mat.material] || {};
                const active = !!tabForm[mat.material];

                return (
                  <div key={mat.material} className="space-y-2">
                    <MaterialDiscountInput
                      material={mat.material}
                      percentValue={saved.percent}
                      amountValue={saved.amount}
                      onToggle={() => toggleMaterial(mat.material)}
                      onChangePercent={(v) =>
                        changePercent(mat.material, v)
                      }
                      onChangeAmount={(v) =>
                        changeAmount(mat.material, v)
                      }
                      active={active}
                    />

                    {active && (
                      <div className="mr-[80px]">
                        <PriceDisplay
                          basePrice={mat.price}
                          percent={saved.percent}
                          amount={saved.amount}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
            disabled={loading}
          >
            انصراف
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-purple-600 text-white disabled:opacity-50 hover:bg-purple-700 transition"
            disabled={loading}
          >
            {loading ? "در حال ذخیره..." : "ذخیره"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}