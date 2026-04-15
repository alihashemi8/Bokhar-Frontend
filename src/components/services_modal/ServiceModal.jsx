import { useEffect, useState, useMemo } from "react"; // اضافه کردن useMemo برای بهینه سازی
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
  const normalizedPricing = useMemo(() => {
    const normalized = {};
    for (const [tab, tabData] of Object.entries(pricing || {})) {
      let materialPrices = {};
      if (Array.isArray(tabData.materialPrices)) {
        materialPrices = Object.fromEntries(
          tabData.materialPrices.map((mp) => [mp.material, String(mp.price)])
        );
      } else if (typeof tabData.materialPrices === "object" && tabData.materialPrices !== null) {
        materialPrices = tabData.materialPrices;
      }
      normalized[tab] = { ...tabData, materialPrices };
    }
    return normalized;
  }, [pricing]);

  const availableTabs = Object.keys(normalizedPricing).filter(
    (tab) =>
      normalizedPricing[tab] &&
      Object.keys(normalizedPricing[tab].materialPrices || {}).length > 0
  );

  const [activeTab, setActiveTab] = useState(availableTabs[0] || "");
  
  // ساختار جدید وضعیت: ذخیره بر اساس تب
  const [quantities, setQuantities] = useState({}); 

  useEffect(() => {
    if (availableTabs.length > 0) {
      setActiveTab(availableTabs[0]);
      setQuantities({}); // فقط وقتی کل دیتای pricing عوض شد ریست شود
    }
  }, [pricing]);

  const currentMaterials = normalizedPricing[activeTab]?.materialPrices || {};

  /* -------------------------------------------------------
   * 2) Quantity handlers (اصلاح شده برای پشتیبانی از چند تب)
   ------------------------------------------------------- */
  const changeQuantity = (material, delta) => {
    setQuantities((prev) => {
      const tabQuantities = prev[activeTab] || {};
      const currentQty = tabQuantities[material] || 0;
      const nextQty = Math.max(0, currentQty + delta);

      const updatedTabQuantities = { ...tabQuantities };
      if (nextQty === 0) {
        delete updatedTabQuantities[material];
      } else {
        updatedTabQuantities[material] = nextQty;
      }

      return {
        ...prev,
        [activeTab]: updatedTabQuantities,
      };
    });
  };

  /* -------------------------------------------------------
   * 3) Total price (محاسبه مجموع تمام تب‌ها)
   ------------------------------------------------------- */
  const totalPrice = Object.entries(quantities).reduce((acc, [tabName, mats]) => {
    const tabPriceData = normalizedPricing[tabName]?.materialPrices || {};
    const tabSum = Object.entries(mats).reduce((sum, [mat, qty]) => {
      const price = parseFloat(tabPriceData[mat] || 0);
      return sum + price * qty;
    }, 0);
    return acc + tabSum;
  }, 0);

  /* -------------------------------------------------------
   * 4) Add to cart (افزودن تمام انتخاب‌ها از تمام تب‌ها)
   ------------------------------------------------------- */
  const handleAdd = () => {
    const allItems = Object.entries(quantities);
    if (allItems.length === 0) return;

    allItems.forEach(([tabName, mats]) => {
      const tabPriceData = normalizedPricing[tabName]?.materialPrices || {};
      Object.entries(mats).forEach(([mat, qty]) => {
        const price = parseFloat(tabPriceData[mat] || 0);
        addToCart({
          title: itemTitle,
          tab: tabName,
          material: mat,
          price,
          quantity: qty,
        });
      });
    });

    onClose();
  };

  /* -------------------------------------------------------
   * 5) UI logic (ارسال مقادیر تب جاری به لیست)
   ------------------------------------------------------- */
  const currentTabQuantities = quantities[activeTab] || {};
  /* -------------------------------------------------------
   * 6) افزودن badge بالای تب
   ------------------------------------------------------- */
  const getTabCount = (tab) => {
  const tabItems = quantities[tab] || {};
  return Object.values(tabItems).reduce((sum, q) => sum + q, 0);
};


  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={itemTitle} maxWidth="md">
      {/* TABS */}
      {availableTabs.length > 1 && (
<div className="flex gap-2 mt-2 mb-4">
{availableTabs.map((tab) => {
  const count = getTabCount(tab);
  const isActive = activeTab === tab;
  const hasItems = count > 0;

  return (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`relative flex-1 py-2 rounded-xl text-sm transition border ${
        isActive
          ? "bg-white dark:bg-sky-800 shadow-sm font-semibold border-sky-500 text-sky-700 dark:text-sky-300"
          : hasItems
            ? "bg-white/80 dark:bg-gray-800 border-sky-300 text-gray-700 dark:text-gray-300"
            : "bg-gray-200 dark:bg-gray-700 border border-sky-200 text-gray-700 dark:text-gray-400"
      }`}
    >
      {tab}

      {/* Badge */}
      {hasItems && (
        <span className="absolute -top-2 -right-2 bg-sky-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
          {count}
        </span>
      )}
    </button>
  );
})}

</div>

      )}

      {/* MATERIAL LIST */}
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pb-4">
        {Object.entries(currentMaterials).map(([mat, price]) => {
          const qty = currentTabQuantities[mat] || 0; // استفاده از کوانتیتی تب جاری
          const selected = qty > 0;

          return (
            <div
              key={mat}
              className={`flex justify-between items-center p-4 rounded-xl border transition ${
                selected
                  ? "border-sky-600 bg-white dark:bg-sky-900/40 shadow-lg"
                  : "border border-gray-400 bg-white/50 dark:border-gray-700"
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
                  className={`w-8 h-8 rounded-lg text-lg  font-bold flex items-center justify-center ${
                    qty === 0 ? "opacity-30" : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                  −

                </button>
                <span className={`w-6 text-center font-bold ${selected ? "text-gray-900" : ""}`}>
                  {qty}
                </span>
                <button
                  onClick={() => changeQuantity(mat, 1)}
                  className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-600 text-lg font-bold"
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
        <div className="font-bold text-gray-700">
          مجموع:
          <span className="text-gray-900 mx-1">{totalPrice.toLocaleString()} تومان</span>
        </div>
        <button
          onClick={handleAdd}
          disabled={totalPrice === 0}
          className="px-6 py-3 rounded-xl bg-sky-600 text-white font-bold disabled:opacity-40"
        >
          افزودن
        </button>
      </div>
    </BaseModal>
  );
}
