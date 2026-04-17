import { useState, useEffect } from "react";
import BaseModal from "../../../basemodal/BaseModal";
import {
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
    } else {
      setType("percent");
      setValue("");
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
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editItem ? "ویرایش تخفیف" : "افزودن تخفیف"}
      maxWidth="md"
    >
      <div className="flex flex-col gap-4">

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/50 dark:bg-white/10 border"
        >
          <option value="percent">درصدی</option>
          <option value="amount">مبلغ</option>
        </select>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="مقدار..."
          className="w-full p-3 rounded-xl bg-white/50 dark:bg-white/10 border"
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-xl"
          >
            بستن
          </button>

          <button
            onClick={submit}
            className="px-4 py-2 bg-purple-700 text-white rounded-xl"
          >
            ذخیره
          </button>
        </div>

      </div>
    </BaseModal>
  );
}
