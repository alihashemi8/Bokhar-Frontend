import { useEffect, useState, useMemo } from "react";
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
   * نرمال‌سازی دیتا و استخراج فیلدهای تخفیف
   ------------------------------------------------------- */
  const normalizedPricing = useMemo(() => {
    const normalized = {};

    for (const [tab, tabData] of Object.entries(pricing || {})) {
      let materialPrices = {};

      if (Array.isArray(tabData.materialPrices)) {
        materialPrices = Object.fromEntries(
          tabData.materialPrices.map((mp) => [
            mp.material,
            {
              price: Number(mp.price),
              has_discount: mp.has_discount,
              discount_type: mp.discount_type, // "percent" or "fixed"
              discount_value: Number(mp.discount_value || 0),
            },
          ]),
        );
      } else if (
        typeof tabData.materialPrices === "object" &&
        tabData.materialPrices !== null
      ) {
        materialPrices = tabData.materialPrices;
      }

      normalized[tab] = { ...tabData, materialPrices };
    }

    return normalized;
  }, [pricing]);

  // تابع محاسبه قیمت نهایی بعد از تخفیف
  const getEffectivePrice = (item) => {
    if (!item?.has_discount) return item.price;
    if (item.discount_type === "percent") {
      return item.price - (item.price * item.discount_value) / 100;
    }
    if (item.discount_type === "fixed") {
      return Math.max(0, item.price - item.discount_value);
    }
    return item.price;
  };

  const availableTabs = Object.keys(normalizedPricing).filter(
    (tab) =>
      normalizedPricing[tab] &&
      Object.keys(normalizedPricing[tab].materialPrices || {}).length > 0,
  );

  const [activeTab, setActiveTab] = useState(availableTabs[0] || "");
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (availableTabs.length > 0) {
      setActiveTab(availableTabs[0]);
      setQuantities({});
    }
  }, [pricing]);

  const currentMaterials = normalizedPricing[activeTab]?.materialPrices || {};

  /* -------------------------------------------------------
   * مدیریت تعداد
   ------------------------------------------------------- */
  const changeQuantity = (material, delta) => {
    setQuantities((prev) => {
      const tabQuantities = prev[activeTab] || {};
      const currentQty = tabQuantities[material] || 0;
      const nextQty = Math.max(0, currentQty + delta);
      const updatedTabQuantities = { ...tabQuantities };

      if (nextQty === 0) delete updatedTabQuantities[material];
      else updatedTabQuantities[material] = nextQty;

      return { ...prev, [activeTab]: updatedTabQuantities };
    });
  };

  /* -------------------------------------------------------
   * محاسبه مجموع کل (بر اساس قیمت تخفیف خورده)
   ------------------------------------------------------- */
  const totalPrice = Object.entries(quantities).reduce(
    (acc, [tabName, mats]) => {
      const tabPriceData = normalizedPricing[tabName]?.materialPrices || {};
      const tabSum = Object.entries(mats).reduce((sum, [mat, qty]) => {
        const item = tabPriceData[mat];
        if (!item) return sum;
        return sum + getEffectivePrice(item) * qty;
      }, 0);
      return acc + tabSum;
    },
    0,
  );

  /* -------------------------------------------------------
   * افزودن به سبد خرید
   ------------------------------------------------------- */
  const handleAdd = () => {
    const allItems = Object.entries(quantities);
    if (allItems.length === 0) return;

    allItems.forEach(([tabName, mats]) => {
      const tabPriceData = normalizedPricing[tabName]?.materialPrices || {};
      Object.entries(mats).forEach(([mat, qty]) => {
        const item = tabPriceData[mat];
        const price = getEffectivePrice(item);

        addToCart({
          id: `${itemTitle}-${tabName}-${mat}`,
          name: itemTitle,
          qty: qty,
          price: price,
          totalPrice: price,
          options: {
            service: tabName,
            material: mat,
            originalPrice: item.price,
            isDiscounted: item.has_discount,
          },
        });
      });
    });
    onClose();
  };

  const currentTabQuantities = quantities[activeTab] || {};

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={itemTitle} maxWidth="md">
      {/* نمایش تب‌ها */}
      {availableTabs.length > 1 && (
        <div className="flex gap-2 mt-2 mb-4 overflow-x-auto pb-1">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-xl text-sm border whitespace-nowrap ${
                activeTab === tab
                  ? "bg-sky-50 border-sky-500 text-sky-700 font-bold"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* لیست متریال‌ها با نمایش تخفیف */}
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pb-4 px-1">
        {Object.entries(currentMaterials).map(([mat, item]) => {
          const qty = currentTabQuantities[mat] || 0;
          const selected = qty > 0;
          const finalPrice = getEffectivePrice(item);

          return (
            <div
              key={mat}
              className={`flex justify-between items-center p-4 rounded-xl border transition-all ${
                selected ? "border-sky-500 bg-white" : "bg-sky-50 border-gray-200"
              }`}
            >
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-800">{mat}</span>
                  {/* بج مقدار تخفیف */}
                  {item.has_discount && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-lg font-medium">
                      {item.discount_type === "percent"
                        ? `${item.discount_value}٪-`
                        : `${item.discount_value.toLocaleString()} تومان-`}
                    </span>
                  )}
                </div>

                {item.has_discount ? (
                  <div className="flex flex-col">
                    <span className="text-xs line-through text-gray-400">
                      {item.price.toLocaleString()} تومان
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {finalPrice.toLocaleString()} تومان
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    {item.price.toLocaleString()} تومان
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => changeQuantity(mat, -1)}
                  disabled={qty === 0}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    qty > 0 ? "bg-sky-100 text-sky-600" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  −
                </button>
                <span className="w-4 text-center font-bold text-lg">{qty}</span>
                <button
                  onClick={() => changeQuantity(mat, 1)}
                  className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* فوتر */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">مبلغ قابل پرداخت:</span>
          <span className="font-bold text-lg text-sky-700">
            {totalPrice.toLocaleString()} تومان
          </span>
        </div>

        <button
          onClick={handleAdd}
          disabled={totalPrice === 0}
          className="px-8 py-3 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-700 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-lg shadow-sky-200"
        >
          افزودن به سبد
        </button>
      </div>
    </BaseModal>
  );
}
