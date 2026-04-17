import { useState, useEffect } from "react";
import {
  createCoupon,
  updateCoupon
} from "../../../../api/discountsApi";

export default function CouponModal({ isOpen, onClose, editItem, onSaved }) {
  const [code, setCode] = useState("");
  const [type, setType] = useState("percent");
  const [value, setValue] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (editItem) {
      setCode(editItem.code);
      setType(editItem.type);
      setValue(editItem.value);
      setUsageLimit(editItem.usage_limit);
      setMinOrder(editItem.min_order_amount);
      setIsActive(editItem.is_active);
    }
  }, [editItem]);

  const submit = async () => {
    const payload = {
      code,
      type,
      value,
      usage_limit: usageLimit || null,
      min_order_amount: minOrder || null,
      is_active: isActive,
    };

    if (editItem) {
      await updateCoupon(editItem.id, payload);
    } else {
      await createCoupon(payload);
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="w-full max-w-lg bg-white/80 dark:bg-gray-900/90 p-6 rounded-3xl">

        <h2 className="text-xl font-bold mb-4">
          {editItem ? "ویرایش کد تخفیف" : "افزودن کد تخفیف"}
        </h2>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="کد تخفیف..."
          className="w-full p-3 rounded-xl mb-4 bg-white/50 dark:bg-white/10 border"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 rounded-xl mb-4 bg-white/50 dark:bg-white/10 border"
        >
          <option value="percent">درصدی</option>
          <option value="amount">مبلغ</option>
        </select>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="مقدار..."
          className="w-full p-3 rounded-xl mb-4 bg-white/50 dark:bg-white/10 border"
        />

        <input
          value={usageLimit}
          onChange={(e) => setUsageLimit(e.target.value)}
          placeholder="حداکثر تعداد استفاده (اختیاری)"
          className="w-full p-3 rounded-xl mb-4 bg-white/50 dark:bg-white/10 border"
        />

        <input
          value={minOrder}
          onChange={(e) => setMinOrder(e.target.value)}
          placeholder="حداقل مبلغ سفارش (اختیاری)"
          className="w-full p-3 rounded-xl mb-4 bg-white/50 dark:bg-white/10 border"
        />

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          فعال باشد
        </label>

        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-xl">
            بستن
          </button>

          <button onClick={submit} className="px-4 py-2 bg-purple-700 text-white rounded-xl">
            ذخیره
          </button>
        </div>
      </div>
    </div>
  );
}
