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

// ✅ تابع تبدیل یکپارچه با Factor.js
function transformBackendCart(backendItems) {
  if (!Array.isArray(backendItems)) return [];
  
  return backendItems.map((item) => {
    // استخراج مقادیر از بک‌اند (همسان با Factor.js)
    const unitPrice = parseInt(item.unit_price || item.price || 0);
    const originalPrice = parseInt(item.original_price || unitPrice);
    const quantity = parseInt(item.quantity || 1);
    
    // محاسبه جمع کل خط
    const finalLineTotal = item.total_price || (unitPrice * quantity);
    const originalLineTotal = item.original_total || (originalPrice * quantity);
    
    return {
      id_unique: item.id_unique, // کلید اصلی برای عملیات‌ها
      name: item.product_name || "محصول",
      qty: quantity,
      unitPrice: unitPrice,               // قیمت واحد نهایی
      originalUnitPrice: originalPrice,   // قیمت واحد اصلی
      finalLineTotal: finalLineTotal,     // جمع کل خط (قیمت × تعداد)
      originalLineTotal: originalLineTotal, // جمع کل خط اصلی
      hasDiscount: originalPrice > unitPrice,
      // اطلاعات تکمیلی
      sizeDisplay: item.size_display || (item.size ? `سایز ${item.size}` : "-"),
      service: item.service || "-",
      material: item.material || "-",
      productId: item.product_id
    };
  });
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // ✅ وضعیت لاگین

  // لود اصلی از API
  const loadCart = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const result = await fetchCart();
      
      if (result.success) {
        const items = result.data?.cart || result.data?.items || [];
        setCartItems(transformBackendCart(items));
        setIsAuthenticated(true);
      } else {
        // ✅ هندل کردن خطای 401
        if (result.unauthorized) {
          setIsAuthenticated(false);
          setCartItems([]); // پاک کردن سبد برای کاربر لاگین نشده
        } else {
          setCartItems([]);
        }
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

  // محاسبات بهینه شده با ساختار جدید
  const totalItems = useMemo(() => 
    cartItems.reduce((sum, item) => sum + (item.qty || 1), 0),
  [cartItems]);

  // ✅ استفاده از finalLineTotal که قبلاً محاسبه شده (unitPrice × qty)
  const totalPrice = useMemo(() => 
    cartItems.reduce((sum, item) => sum + (item.finalLineTotal || 0), 0),
  [cartItems]);

  // ✅ استفاده از originalLineTotal
  const originalTotalPrice = useMemo(() => 
    cartItems.reduce((sum, item) => sum + (item.originalLineTotal || 0), 0),
  [cartItems]);

  const hasAnyDiscount = originalTotalPrice > totalPrice;
  const savingsAmount = originalTotalPrice - totalPrice;

  // ✅ تعداد آیتم‌های منحصر به فرد (برای badge می‌تواند مفید باشد)
  const uniqueItemsCount = useMemo(() => cartItems.length, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,           // آرایه آیتم‌ها (ساختار یکسان با Factor.js)
        totalItems,          // مجموع تعداد کل (برای نمایش در badge)
        uniqueItemsCount,    // تعداد آیتم‌های متفاوت
        totalPrice,          // قیمت نهایی کل سبد
        originalTotalPrice,  // قیمت قبل از تخفیف
        hasAnyDiscount,      // آیا تخفیف وجود دارد؟
        savingsAmount,       // مبلغ صرفه‌جویی شده
        loading,             // وضعیت لودینگ
        isAuthenticated,     // وضعیت احراز هویت (برای نمایش پیام لاگین)
        refreshCart: loadCart, // تابع رفرش
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
