import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { fetchCart } from "../api/cartService";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

// همان تابع تبدیل Factor
function transformBackendCart(backendItems) {
  if (!Array.isArray(backendItems)) return [];
  
  return backendItems.map((item, index) => {
    const finalPrice = item.final_price || item.unit_price || item.price || 0;
    const originalPrice = item.original_price || item.base_price || finalPrice;
    
    return {
      id: item.id || item.product_id || index, 
      id_unique: item.id_unique || item.cart_item_id || item.uuid || `item-${index}`,
      name: item.product_name || item.name || item.title || "محصول",
      qty: item.quantity || item.qty || 1,
      totalPrice: finalPrice,
      price: finalPrice, // برای سازگاری با کامپوننت‌های قدیمی
      options: {
        service: item.service_name || item.service || item.service_type || "-",
        material: item.material_name || item.material || item.material_type || "-",
        originalPrice: originalPrice,
        isDiscounted: originalPrice > finalPrice
      }
    };
  });
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // لود اصلی از API
  const loadCart = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const result = await fetchCart();
      if (result.success) {
        const items = result.data?.cart || result.data?.items || [];
        setCartItems(transformBackendCart(items));
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Cart load error:", err);
      setCartItems([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // لود اولیه هنگام mount
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // محاسبات با useMemo برای پرفورمنس
  const totalItems = useMemo(() => 
    cartItems.reduce((sum, item) => sum + (item.qty || 1), 0),
  [cartItems]);

  const totalPrice = useMemo(() => 
    cartItems.reduce((sum, item) => sum + (item.totalPrice || 0) * (item.qty || 1), 0),
  [cartItems]);

  const originalTotalPrice = useMemo(() => 
    cartItems.reduce((sum, item) => {
      const originalPrice = item.options?.originalPrice || item.totalPrice || 0;
      return sum + originalPrice * (item.qty || 1);
    }, 0),
  [cartItems]);

  const hasAnyDiscount = originalTotalPrice > totalPrice;
  const savingsAmount = originalTotalPrice - totalPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,           // آرایه آیتم‌ها (هم‌ struktur با Factor)
        totalItems,          // عدد Badge
        totalPrice,          // قیمت نهایی
        originalTotalPrice,  // قیمت قبل تخفیف
        hasAnyDiscount,      // boolean آیا تخفیف داریم؟
        savingsAmount,       // مبلغ صرفه‌جویی
        loading,             // برای نمایش اسکلتون در Badge
        refreshCart: loadCart, // تابع رفرش (بعد از add/remove/update صدا بزنید)
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
