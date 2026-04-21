import { useEffect, useState, useCallback, useRef } from "react";
import BaseModal from "../../../basemodal/BaseModal";
import {
  fetchProductFullPricing,
  createProductDiscount,
} from "../../../../api/discountsApi";

function DiscountTimeInputs({
  startDate,
  endDate,
  startTime,
  endTime,
  setStartDate,
  setEndDate,
  setStartTime,
  setEndTime,
}) {
  return (
    <div className="space-y-3 mb-4">
      {/* Row 1: Calendar Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 mr-1">تاریخ شروع</label>
          <div className="flex items-center bg-gray-100 rounded-xl h-10 px-3 sm:h-12">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
              dir="ltr"
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 mr-1">تاریخ پایان</label>
          <div className="flex items-center bg-gray-100 rounded-xl h-10 px-3 sm:h-12">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* Row 2: Time Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 mr-1">ساعت شروع</label>
          <div className="flex items-center bg-gray-100 rounded-xl h-10 px-3 sm:h-12">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
              dir="ltr"
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 mr-1">ساعت پایان</label>
          <div className="flex items-center bg-gray-100 rounded-xl h-10 px-3 sm:h-12">
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
              dir="ltr"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Input Component
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

  // refs برای اتوفوکوس
  const percentRef = useRef(null);
  const amountRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setActiveType(null);
      return;
    }

    if (percentValue) setActiveType("percent");
    else if (amountValue) setActiveType("amount");
  }, [active, percentValue, amountValue]);

  // اتوفوکوس هنگام فعال ‌شدن
  useEffect(() => {
    if (activeType === "percent" && percentRef.current) {
      percentRef.current.focus();
      percentRef.current.select();
    }

    if (activeType === "amount" && amountRef.current) {
      amountRef.current.focus();
      amountRef.current.select();
    }
  }, [activeType]);

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
    if (e) e.stopPropagation();
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
          <div className="flex gap-2 flex-1 h-10 md:h-12 select-none">
            {/* Percent */}
            <div
              onClick={(e) => activateType(e, "percent")}
              className={`relative overflow-hidden rounded-xl bg-gray-100 flex items-center transition-all duration-500 ease-in-out cursor-pointer ${wrapperClass(
                "percent",
              )}`}
            >
              <input
                ref={percentRef}
                type="number"
                value={percentValue ?? ""}
                onClick={(e) => activateType(e, "percent")}
                onChange={(e) => onChangePercent(e.target.value)}
                placeholder="درصد"
                readOnly={activeType !== "percent"}
                className="w-full h-full px-3 bg-transparent outline-none remove-arrows pr-6"
                min="0"
                max="100"
              />

              <span className="absolute right-3 text-sm text-gray-500 pointer-events-none">
                ٪
              </span>

              {activeType === "percent" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    reset();
                  }}
                  className="absolute left-3 text-gray-400"
                >
                  ×
                </button>
              )}
            </div>

            {/* Amount */}
            <div
              onClick={(e) => activateType(e, "amount")}
              className={`relative overflow-hidden rounded-xl bg-gray-100 flex items-center transition-all duration-500 ease-in-out cursor-pointer ${wrapperClass(
                "amount",
              )}`}
            >
              <input
                ref={amountRef}
                type="number"
                value={amountValue ?? ""}
                onClick={(e) => activateType(e, "amount")}
                onChange={(e) => onChangeAmount(e.target.value)}
                placeholder="مبلغ"
                readOnly={activeType !== "amount"}
                className="w-full h-full px-3 bg-transparent outline-none remove-arrows pr-8"
                min="0"
              />

              <span className="absolute right-3 text-sm text-gray-500 pointer-events-none">
                $
              </span>

              {activeType === "amount" && (
                <button
                  onClick={reset}
                  className="absolute left-3 text-gray-400"
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

// Price Display Component
function PriceDisplay({ basePrice, percent, amount }) {
  const hasPercent = percent !== undefined && percent !== "" && !isNaN(percent);
  const hasAmount = amount !== undefined && amount !== "" && !isNaN(amount);

  if (!hasPercent && !hasAmount) {
    return (
      <div className="text-xs text-gray-500">
        قیمت: {basePrice?.toLocaleString()} تومان
      </div>
    );
  }

  const originalPrice = Number(basePrice);
  let discounted = originalPrice;

  if (hasAmount) discounted -= Number(amount);
  else if (hasPercent) discounted -= (originalPrice * Number(percent)) / 100;

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
            ? `${Number(amount).toLocaleString()}  تومان `
            : `${percent}%تخفیف`}
          )
        </span>
      </span>
    </div>
  );
}

// Main Discount Modal
export default function DiscountModal({ isOpen, onClose, product, category }) {
  const [loading, setLoading] = useState(false);

  const [tabs, setTabs] = useState([]);
  const [pricing, setPricing] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const [discounts, setDiscounts] = useState({});
  
  // New Date/Time States instead of days/hours
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");

  const target = product || category;

  // Initialize default dates when modal opens
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const formatDate = (d) => d.toISOString().split('T')[0];
      const formatTime = (d) => d.toTimeString().slice(0, 5);
      
      setStartDate(formatDate(now));
      setStartTime(formatTime(now));
      setEndDate(formatDate(nextWeek));
      setEndTime("23:59");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !product?.id) return;

    (async () => {
      try {
        setLoading(true);

        const data = await fetchProductFullPricing(product.id);

        const tabNames = Object.keys(data.pricing);

        setTabs(tabNames);
        setPricing(data.pricing);

        const initialDiscounts = {};

        tabNames.forEach((tabName) => {
          const tab = data.pricing[tabName];
          initialDiscounts[tabName] = {};

          tab.materialPrices.forEach((mat) => {
            if (mat.discount_amount && Number(mat.discount_amount) > 0) {
              initialDiscounts[tabName][mat.material] = {
                percent: "",
                amount: mat.discount_amount,
              };
            }
          });
        });

        setDiscounts(initialDiscounts);
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
    [currentTab],
  );

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
    [currentTab],
  );

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
    [currentTab],
  );

  const handleSave = async () => {
    // Validation
    if (!startDate || !endDate) {
      alert("لطفاً تاریخ شروع و پایان را انتخاب کنید");
      return;
    }

    // Create ISO strings from date and time inputs
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    
    if (end <= start) {
      alert("تاریخ پایان باید بعد از تاریخ شروع باشد");
      return;
    }

    const startISO = start.toISOString();
    const endISO = end.toISOString();

    // ۱) داده‌ها را پاکسازی کن
    const clean = {};

    for (const [tabName, materials] of Object.entries(discounts)) {
      const filtered = {};

      for (const [matName, d] of Object.entries(materials)) {
        if (
          (d.percent !== "" && !isNaN(d.percent)) ||
          (d.amount !== "" && !isNaN(d.amount))
        ) {
          filtered[matName] = {
            percent: d.percent !== "" ? Number(d.percent) : null,
            amount: d.amount !== "" ? Number(d.amount) : null,
          };
        }
      }

      if (Object.keys(filtered).length > 0) {
        clean[tabName] = filtered;
      }
    }

    if (!Object.keys(clean).length) return;

    // ۳) ساخت payload نهایی
    const payload = [];

    for (const [tabName, materials] of Object.entries(clean)) {
      const tabData = pricing[tabName];
      const tabId = tabData.id;

      for (const [matName, d] of Object.entries(materials)) {
        // پیدا کردن material object با id
        const matObj = tabData.materialPrices.find(
          (m) => m.material === matName
        );

        if (!matObj) continue;

        const isPercent = d.percent !== null;
        const type = isPercent ? "percent" : "fixed";
        const value = isPercent ? d.percent : d.amount;

        payload.push({
          product: product.id,
          pricing_tab: tabId,
          material: matObj.id,
          type,
          value,
          start_at: startISO,
          end_at: endISO,
        });
      }
    }

    try {
      setLoading(true);

      // ۴) ارسال همه تخفیف‌ها
      await Promise.all(payload.map((item) => createProductDiscount(item)));

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
      <div dir="rtl" className="py-1 max-h-[80vh] px-3 overflow-y-auto">
        <DiscountTimeInputs
          startDate={startDate}
          endDate={endDate}
          startTime={startTime}
          endTime={endTime}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
        />

        {loading && (
          <div className="text-center py-6">در حال دریافت اطلاعات...</div>
        )}

        {!loading && tabs.length > 0 && (
          <>
            <div className="flex gap-1 pt-2">
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

            <div className="bg-white border border-gray-200 border-t-white rounded-b-xl p-3 space-y-4 max-h-[50vh] overflow-y-auto">
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
                      onChangePercent={(v) => changePercent(mat.material, v)}
                      onChangeAmount={(v) => changeAmount(mat.material, v)}
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

        <div className="flex justify-between mt-3">
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
