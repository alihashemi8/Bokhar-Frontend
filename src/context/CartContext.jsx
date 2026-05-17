import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import {
  fetchCart,
  getGuestCart,
  saveGuestCart,
  syncGuestCartWithServer,
} from "../api/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);

  // ⭐ تابع اصلی لود کردن سبد خرید
  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      if (!isAuthenticated) {
        const guestItems = getGuestCart();
        // تبدیل به فرمت یکپارچه
        setCartItems(transformCartItems(guestItems));
        setIsGuest(true);
        return;
      }

      const result = await fetchCart();
      if (result.success) {
        // تبدیل داده‌های بک‌اند به فرمت یکپارچه
        setCartItems(transformCartItems(result.data.items || []));
        setIsGuest(false);
      } else {
        // اگر خطا بود، fallback به guest
        const guestItems = getGuestCart();
        setCartItems(transformCartItems(guestItems));
        setIsGuest(true);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      const guestItems = getGuestCart();
      setCartItems(transformCartItems(guestItems));
      setIsGuest(true);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ⭐ رفرش کردن سبد خرید (برای استفاده در Factor)
  const refreshCart = useCallback(async () => {
    await loadCart();
  }, [loadCart]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // ⭐ تابع تبدیل یکپارچه سازی ساختار داده
  const transformCartItems = (items) => {
    if (!Array.isArray(items)) return [];
    
    return items.map((item) => {
      // بررسی اینکه آیتم از بک‌اند آمده یا لوکال
      const isFromBackend = item.id_unique && !item.id_unique.startsWith('guest-');
      
      const qty = Number(item.qty || item.quantity || 1);
      const unitPrice = Number(
        item.unitPrice || 
        item.unit_price || 
        item.price || 
        item.discount_price || 
        0
      );
      const originalUnitPrice = Number(
        item.originalUnitPrice || 
        item.original_price || 
        item.price_before_discount || 
        unitPrice
      );
      
      return {
        id_unique: item.id_unique || `guest-${item.product_id || item.productId}-${Date.now()}`,
        productId: item.productId || item.product_id,
        name: item.name || item.product_name || "محصول",
        qty: qty,
        unitPrice: unitPrice,
        originalUnitPrice: originalUnitPrice,
        finalLineTotal: unitPrice * qty,
        originalLineTotal: originalUnitPrice * qty,
        hasDiscount: originalUnitPrice > unitPrice,
        sizeDisplay: item.sizeDisplay || item.size || "-",
        service: item.service || "-",
        material: item.material || "-",
        image: item.image || null,
      };
    });
  };

  // ⭐ آپدیت لوکال (سریع) - برای استفاده در Factor
  const updateCartLocal = useCallback((newItems) => {
    setCartItems(transformCartItems(newItems));
    if (isGuest) {
      // اگر مهمان است، در localStorage هم ذخیره کن
      const storageFormat = newItems.map(item => ({
        id_unique: item.id_unique,
        product_id: item.productId || item.product_id,
        product_name: item.name,
        quantity: item.qty,
        qty: item.qty,
        price: item.unitPrice,
        unit_price: item.unitPrice,
        original_price: item.originalUnitPrice,
        service: item.service,
        material: item.material,
        size: item.sizeDisplay,
        image: item.image,
      }));
      saveGuestCart(storageFormat);
    }
  }, [isGuest]);

  // ⭐ محاسبه تعداد آیتم‌ها (برای Badge نوبار)
  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.qty || 0), 0);
  }, [cartItems]);

  // ⭐ محاسبه قیمت کل
  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + ((item.finalLineTotal || item.unitPrice * item.qty) || 0),
      0
    );
  }, [cartItems]);

  const value = {
    cartItems,
    loading,
    isGuest,
    totalItems,       // برای نمایش در Badge
    totalPrice,
    loadCart,
    refreshCart,      // ⭐ اضافه شده
    updateCartLocal,  // ⭐ اضافه شده
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
};
