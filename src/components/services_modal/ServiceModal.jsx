import { useEffect, useState, useMemo } from "react";
import { useCart } from "../../context/CartContext";
import { addToCart as addToCartAPI } from "../../api/cartService";
import BaseModal from "../BaseModal/BaseModal";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function ServiceModal({
  isOpen,
  onClose,
  productId,
  itemTitle = "سرویس",
  pricing = {},
}) {
  const { refreshCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [quantities, setQuantities] = useState({});
const { isAuthenticated } = useAuth();

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
              product_id: mp.product_id || productId,
              has_discount: mp.has_discount,
              discount_type: mp.discount_type,
              discount_value: Number(mp.discount_value ?? 0),
            },
          ])
        );
      }

      normalized[tab] = { ...tabData, materialPrices };
    }

    return normalized;
  }, [pricing, productId]);

  const getEffectivePrice = (item) => {
    if (!item?.has_discount) return item.price;

    if (item.discount_type === "percent") {
      return Math.round(item.price * (1 - item.discount_value / 100));
    }

    if (item.discount_type === "fixed") {
      return Math.max(0, item.price - item.discount_value);
    }

    return item.price;
  };

  const availableTabs = Object.keys(normalizedPricing).filter(
    (tab) => Object.keys(normalizedPricing[tab].materialPrices || {}).length > 0
  );

  useEffect(() => {
    if (availableTabs.length > 0 && !activeTab) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

  const changeQuantity = (material, delta) => {
    setQuantities((prev) => {
      const tabQuantities = prev[activeTab] || {};
      const currentQty = tabQuantities[material] || 0;
      const nextQty = Math.max(0, currentQty + delta);

      const updatedTab = { ...tabQuantities };

      if (nextQty === 0) delete updatedTab[material];
      else updatedTab[material] = nextQty;

      return { ...prev, [activeTab]: updatedTab };
    });
  };
function addToGuestCart(items) {
  
  const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");

  const updatedCart = [...guestCart];

  items.forEach(item => {
    const existing = updatedCart.find(
      i =>
        i.productId === item.product_id &&
        i.service === item.options.service &&
        i.material === item.options.material
    );

    if (existing) {
      existing.qty += item.quantity;
    } else {
      updatedCart.push({
        id_unique: `guest-${item.product_id}-${Date.now()}`,
        productId: item.product_id,
        name: item.product_name,
        qty: item.quantity,
        unitPrice: item.price,              // ✅ قیمت بعد تخفیف
        originalUnitPrice: item.original_price, // ✅ قیمت قبل تخفیف
        service: item.options.service,
        material: item.options.material,
        sizeDisplay: "-",
      });
    }
  });

  localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
}

  // ✅ محاسبه قیمت نهایی (با تخفیف)
  const totalPrice = useMemo(() => {
    return Object.entries(quantities).reduce((acc, [tabName, mats]) => {
      const tabPriceData = normalizedPricing[tabName]?.materialPrices || {};

      const tabSum = Object.entries(mats).reduce((sum, [mat, qty]) => {
        const item = tabPriceData[mat];
        return sum + (item ? getEffectivePrice(item) * qty : 0);
      }, 0);

      return acc + tabSum;
    }, 0);
  }, [quantities, normalizedPricing]);

  // ✅ محاسبه قیمت اصلی (قبل تخفیف)
  const originalTotalPrice = useMemo(() => {
    return Object.entries(quantities).reduce((acc, [tabName, mats]) => {
      const tabPriceData = normalizedPricing[tabName]?.materialPrices || {};

      const tabSum = Object.entries(mats).reduce((sum, [mat, qty]) => {
        const item = tabPriceData[mat];
        // استفاده از قیمت اولیه (بدون تخفیف)
        return sum + (item ? item.price * qty : 0);
      }, 0);

      return acc + tabSum;
    }, 0);
  }, [quantities, normalizedPricing]);

  const hasAnyDiscount = originalTotalPrice > totalPrice;
  const savingsAmount = originalTotalPrice - totalPrice;

  const selectedItems = useMemo(() => {
  const items = [];

  Object.entries(quantities).forEach(([tabName, mats]) => {
    const tab = normalizedPricing[tabName]?.materialPrices || {};

    Object.entries(mats).forEach(([mat, qty]) => {
      const item = tab[mat];
      if (!item) return;

      const finalPrice = getEffectivePrice(item);

      items.push({
        product_id: item.product_id,
        product_name: itemTitle,
        quantity: qty,
        price: finalPrice,
        original_price: item.price,
        has_discount: item.has_discount,
        discount_type: item.discount_type,
        discount_value: item.discount_value,
        options: {
          service: tabName,
          material: mat,
          size: "-",
        },
      });
    });
  });

  return items;
}, [quantities, normalizedPricing]);

const handleAdd = async () => {
  if (!productId) {
    toast.error("شناسه محصول نامعتبر است");
    return;
  }

  if (selectedItems.length === 0) {
    toast.error("لطفاً حداقل یک مورد را انتخاب کنید");
    return;
  }

  // ✅ اگر کاربر لاگین نیست → Guest Cart
  if (!isAuthenticated) {
    addToGuestCart(selectedItems);
    await refreshCart(true);
    toast.success("آیتم‌ها به سبد خرید اضافه شدند");
    setQuantities({});
    onClose();
    return;
  }

  // ✅ اگر لاگین است → API
  setLoading(true);
  const toastId = toast.loading("در حال افزودن به سبد...");

  try {
    const promises = selectedItems.map((item) =>
      addToCartAPI(item.product_id, item.quantity, {
        service: item.options.service,
        material: item.options.material,
        size: item.options.size,
        product_name: item.product_name,
        price: item.price,
        original_price: item.original_price,
        has_discount: item.has_discount,
        discount_type: item.discount_type,
        discount_value: item.discount_value,
      })
    );

    await Promise.all(promises);
    toast.success("آیتم‌ها به سبد اضافه شدند", { id: toastId });
    await refreshCart();
    setQuantities({});
    onClose();
  } catch (e) {
    toast.error("خطا در افزودن به سبد", { id: toastId });
  } finally {
    setLoading(false);
  }
};

  const currentMaterials = normalizedPricing[activeTab]?.materialPrices || {};
  const currentTabQuantities = quantities[activeTab] || {};

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={itemTitle} maxWidth="md">
      {availableTabs.length > 1 && (
        <div className="flex gap-2 mt-2 mb-4 overflow-x-auto pb-1">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-xl text-sm border whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-sky-50 border-sky-500 text-sky-700 font-bold"
                  : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3 max-h-[55vh] overflow-y-auto pb-4 px-1">
        {Object.entries(currentMaterials).map(([mat, item]) => {
          const qty = currentTabQuantities[mat] || 0;
          const finalPrice = getEffectivePrice(item);

          return (
            <div
              key={mat}
              className={`flex justify-between items-center p-4 rounded-xl border transition-all duration-200 ${
                qty > 0
                  ? "border-sky-500 bg-sky-50 shadow-sm"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-800">{mat}</span>

                  {item.has_discount && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      {item.discount_type === "percent"
                        ? `${item.discount_value}٪`
                        : `${item.discount_value.toLocaleString()} تومان`}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  {item.has_discount && (
                    <span className="text-xs line-through text-gray-400 decoration-red-300">
                      {item.price.toLocaleString()} تومان
                    </span>
                  )}

                  <span
                    className={`font-bold ${
                      item.has_discount ? "text-green-600" : "text-gray-700"
                    }`}
                  >
                    {finalPrice.toLocaleString()} تومان
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => changeQuantity(mat, -1)}
                  disabled={qty === 0 || loading}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors active:scale-95 ${
                    qty > 0
                      ? "bg-white text-sky-600 shadow-sm border border-sky-200"
                      : "bg-gray-100 text-gray-300"
                  }`}
                >
                  −
                </button>

                <span className="w-6 text-center font-bold text-lg text-gray-800">
                  {qty}
                </span>

                <button
                  onClick={() => changeQuantity(mat, 1)}
                  disabled={loading}
                  className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-md hover:bg-sky-700 active:scale-95 transition-all disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ بخش فوتر با نمایش سود و تخفیف کلی */}
      <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
        {/* نمایش سود کاربر (اگر تخفیف دارد) */}

        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">مبلغ قابل پرداخت:</span>
            
            <div className="flex items-center gap-2">
              {hasAnyDiscount && (
                <span className="text-sm line-through text-gray-400 decoration-red-300">
                  {originalTotalPrice.toLocaleString()}
                </span>
              )}
              <span className={`font-bold text-xl ${hasAnyDiscount ? "text-green-600" : "text-sky-700"}`}>
                {totalPrice.toLocaleString()}
                <span className="text-sm font-normal text-gray-500 mr-1">
                  تومان
                </span>
              </span>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={totalPrice === 0 || loading}
            className="px-6 py-3 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-700 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-lg shadow-sky-200 flex items-center gap-2 min-w-[140px] justify-center"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>در حال افزودن...</span>
              </>
            ) : (
              "افزودن به سبد"
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
