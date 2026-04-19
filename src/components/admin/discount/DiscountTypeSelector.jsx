import { useState, useEffect, useRef } from "react";

export default function DiscountTypeSelector({ value, onChange }) {
  const [active, setActive] = useState(value?.type || null);
  const [amountValue, setAmountValue] = useState(
    value?.type === "amount" ? value.value : ""
  );
  const [percentValue, setPercentValue] = useState(
    value?.type === "percent" ? value.value : ""
  );

  useEffect(() => {
    if (!active) return;

    const val = active === "percent" ? percentValue : amountValue;

    onChange({
      type: active,
      value: val,
    });
  }, [active, amountValue, percentValue]);

  const reset = () => {
    setActive(null);
    setAmountValue("");
    setPercentValue("");
    onChange(null);
  };

  const wrapperClass = (type) => {
    if (active === null) return "flex-1";
    if (active === type) return "flex-1";
    return "w-0 opacity-0";
  };

  const activateType = (e, type) => {
    e.stopPropagation();
    if (!active) setActive(type);
  };

  return (
    <div className="flex gap-2 w-full h-12 select-none">
      {/* Percent */}
      <div
        onClick={(e) => activateType(e, "percent")}
        className={`relative overflow-hidden rounded-xl bg-gray-100 flex items-center transition-all duration-500 ease-in-out cursor-pointer ${wrapperClass(
          "percent"
        )}`}
      >
        <input
          type="number"
          value={percentValue}
          onClick={(e) => activateType(e, "percent")}
          onChange={(e) => setPercentValue(e.target.value)}
          placeholder="درصد"
          disabled={active !== "percent"}
          className="w-full h-full px-3 bg-transparent outline-none"
        />

        <span className="absolute left-3 text-sm text-gray-500">٪</span>

        {active === "percent" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              reset();
            }}
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
          value={amountValue}
          onClick={(e) => activateType(e, "amount")}
          onChange={(e) => setAmountValue(e.target.value)}
          placeholder="مبلغ"
          disabled={active !== "amount"}
          className="w-full h-full px-3 bg-transparent outline-none"
        />

        <span className="absolute left-3 text-sm text-gray-500">تومان</span>

        {active === "amount" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              reset();
            }}
            className="absolute right-3 text-gray-400"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
