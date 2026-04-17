import { useState, useEffect } from "react";
import GlobalDiscountModal from "../modals/GlobalDiscountModal";
import { fetchGlobalDiscounts } from "../../../../api/discountsApi";

export default function GlobalDiscountTab() {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetchGlobalDiscounts();
    setItems(res);
  };

  return (
    <div className="p-6 md:mr-3 rounded-3xl bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-sky-200/50 shadow-xl overflow-x-hidden">

      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">
          تخفیف‌های عمومی
        </h3>

        <button
          onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="px-4 py-2 rounded-xl bg-purple-700 text-white shadow hover:scale-105 transition"
        >
          + افزودن
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500 text-center">هیچ تخفیف فعالی موجود نیست.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white/70 dark:bg-white/20 border border-sky-200/60 dark:border-sky-700 rounded-xl shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700 dark:text-gray-200 font-semibold">
                    نوع: {item.type === "percent" ? "درصدی" : "مبلغی"}
                  </p>

                  <p className="text-gray-700 dark:text-gray-300">
                    مقدار:{" "}
                    {item.type === "percent"
                      ? `${item.value}%`
                      : `${item.value.toLocaleString()} تومان`}
                  </p>
                </div>

                <button
                  onClick={() => { setEditItem(item); setModalOpen(true); }}
                  className="px-3 py-1 rounded-xl bg-sky-200 dark:bg-purple-700 text-gray-800 dark:text-white transition"
                >
                  ویرایش
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <GlobalDiscountModal
          isOpen={modalOpen}
          editItem={editItem}
          onClose={() => setModalOpen(false)}
          onSaved={load}
        />
      )}
    </div>
  );
}
