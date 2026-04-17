import { useState, useEffect } from "react";
import {
  fetchGlobalDiscounts,
  createGlobalDiscount,
  updateGlobalDiscount
} from "../../../../api/discountsApi";


export default function GlobalDiscountModal({ isOpen, onClose, editItem, onSaved }) {
  const [type, setType] = useState("percent");
  const [value, setValue] = useState("");

  useEffect(() => {
    if (editItem) {
      setType(editItem.type);
      setValue(editItem.value);
    }
  }, [editItem]);

  const submit = async () => {
    if (editItem) {
      await updateGlobalDiscount(editItem.id, { type, value });
    } else {
      await createGlobalDiscount({ type, value });
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="w-full max-w-lg bg-white/80 dark:bg-gray-900/90 p-6 rounded-3xl">

        <h2 className="text-xl font-bold mb-4">
          {editItem ? "ویرایش تخفیف" : "افزودن تخفیف"}
        </h2>

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
