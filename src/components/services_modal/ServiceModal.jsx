import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import BaseModal from "../BaseModal/BaseModal";

export default function ServiceModal({
  isOpen,
  onClose,
  itemTitle = "سرویس",
  pricing = {},
}) {
  const { addToCart } = useCart();

  /* -------------------------------------------------------
   * 1) Normalize backend pricing
   ------------------------------------------------------- */
  const normalizedPricing = {};
  for (const [tab, tabData] of Object.entries(pricing || {})) {
    let materialPrices = {};

    if (Array.isArray(tabData.materialPrices)) {
      materialPrices = Object.fromEntries(
        tabData.materialPrices.map((mp) => [mp.material, String(mp.price)])
      );
    } else if (
      typeof tabData.materialPrices === "object" &&
      tabData.materialPrices !== null
    ) {
      materialPrices = tabData.materialPrices;
    }

    normalizedPricing[tab] = { ...tabData, materialPrices };
  }

  const availableTabs = Object.keys(normalizedPricing).filter(
    (tab) =>
      normalizedPricing[tab] &&
      Object.keys(normalizedPricing[tab].materialPrices || {}).length > 0
  );

  const [activeTab, setActiveTab] = useState(availableTabs[0] || "");
  const [quantities, setQuantities] = useState({});

  /* Reset activeTab and quantities when pricing changes */
  useEffect(() => {
    if (availableTabs.length > 0) {
      setActiveTab(availableTabs[0]);
      setQuantities({});
    }
  }, [pricing]);

  const currentMaterials =
    normalizedPricing[activeTab]?.materialPrices || {};

  /* -------------------------------------------------------
   * 2) Quantity handlers
   ------------------------------------------------------- */
  const changeQuantity = (material, delta) => {
    setQuantities((prev) => {
      const current = prev[material] || 0;
      const next = Math.max(0, current + delta);

      const updated = { ...prev };
      if (next === 0) delete updated[material];
      else updated[material] = next;

      return updated;
    });
  };

  /* -------------------------------------------------------
   * 3) Total price
   ------------------------------------------------------- */
  const totalPrice = Object.entries(quantities).reduce(
    (sum, [mat, qty]) => {
      const price = parseFloat(currentMaterials[mat] || 0);
      return sum + price * qty;
    },
    0
  );

  /* -------------------------------------------------------
   * 4) Add to cart
   ------------------------------------------------------- */
  const handleAdd = () => {
    if (!Object.keys(quantities).length) return;

    Object.entries(quantities).forEach(([mat, qty]) => {
      const price = parseFloat(currentMaterials[mat] || 0);
      addToCart({
        title: itemTitle,
        tab: activeTab,
        material: mat,
        price,
        quantity: qty,
      });
    });

    onClose();
  };

  /* -------------------------------------------------------
   * 5) UI inside BaseModal
   ------------------------------------------------------- */
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={itemTitle}
      maxWidth="md"
    >
      {/* TABS */}
      {availableTabs.length > 0 && (
        <div className="flex gap-2 mt-1 mb-4">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setQuantities({});
              }}
              className={`flex-1 py-2 rounded-xl text-sm transition ${
                activeTab === tab
                  ? "bg-white dark:bg-sky-800 shadow font-semibold border border-sky-300 dark:border-sky-700"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* MATERIAL LIST */}
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pb-4">
        {Object.entries(currentMaterials).map(([mat, price]) => {
          const qty = quantities[mat] || 0;
          const selected = qty > 0;

          return (
            <div
              key={mat}
              className={`flex justify-between items-center p-4 rounded-xl border transition ${
                selected
                  ? "border-sky-600 bg-sky-50 dark:bg-sky-900/40"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            >
              <div className="text-right">
                <div className="font-bold">{mat}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {Number(price).toLocaleString()} تومان
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeQuantity(mat, -1)}
                  disabled={qty === 0}
                  className={`w-8 h-8 rounded-lg text-lg font-bold flex items-center justify-center
                    ${
                      qty === 0
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                        : "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                    }
                  `}
                >
                  –
                </button>

                <span
                  className={`w-6 text-center font-bold ${
                    selected ? "text-sky-600 dark:text-sky-300" : ""
                  }`}
                >
                  {qty}
                </span>

                <button
                  onClick={() => changeQuantity(mat, 1)}
                  className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-gray-700">
        <div className="font-bold text-gray-800 dark:text-gray-100">
          مجموع:
          <span className="text-sky-600 dark:text-sky-300 mx-1">
            {totalPrice.toLocaleString()} تومان
          </span>
        </div>

        <button
          onClick={handleAdd}
          disabled={totalPrice === 0}
          className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 
                   dark:bg-sky-700 dark:hover:bg-sky-600 text-white font-bold disabled:opacity-40"
        >
          افزودن
        </button>
      </div>
    </BaseModal>
  );
}
