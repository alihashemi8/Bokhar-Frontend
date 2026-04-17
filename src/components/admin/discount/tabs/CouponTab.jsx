import { useState, useEffect } from "react";
import CouponModal from "../modals/CouponModal";
import { fetchCoupons } from "../../../../api/discountsApi";

export default function CouponTab() {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetchCoupons();
    setItems(res);
  };

  return (
    <div className="p-6 md:mr-3 rounded-3xl bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-sky-200/50 shadow-xl overflow-x-hidden">

      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">
          کدهای تخفیف
        </h3>

        <button
          onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="px-4 py-2 rounded-xl bg-purple-700 text-white shadow hover:scale-105 transition"
        >
          + افزودن
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-sky-200 dark:border-sky-700 no-scrollbar">
        <table className="w-full text-sm table-auto min-w-[600px]">
          <thead className="bg-white/60 dark:bg-white/20">
            <tr className="text-gray-700 dark:text-gray-300">
              <th className="p-2">کد</th>
              <th className="p-2">نوع</th>
              <th className="p-2">مقدار</th>
              <th className="p-2">محدودیت</th>
              <th className="p-2">فعال</th>
              <th className="p-2"></th>
            </tr>
          </thead>

          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="bg-white/70 dark:bg-white/10 border-b border-sky-200 dark:border-sky-700">
                <td className="p-2">{c.code}</td>

                <td className="p-2">
                  {c.type === "percent" ? "درصدی" : "مبلغی"}
                </td>

                <td className="p-2">
                  {c.type === "percent" ? `${c.value}%` : `${c.value.toLocaleString()} تومان`}
                </td>

                <td className="p-2">{c.usage_limit || "-"}</td>

                <td className="p-2">{c.is_active ? "✓" : "✗"}</td>

                <td className="p-2">
                  <button
                    onClick={() => { setEditItem(c); setModalOpen(true); }}
                    className="px-3 py-1 rounded-xl bg-sky-200 dark:bg-purple-700 text-gray-800 dark:text-white transition"
                  >
                    ویرایش
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <CouponModal
          isOpen={modalOpen}
          editItem={editItem}
          onClose={() => setModalOpen(false)}
          onSaved={load}
        />
      )}
    </div>
  );
}
