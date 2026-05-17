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

function transformBackendCart(backendItems) {
  if (!Array.isArray(backendItems)) return [];
  
  return backendItems.map((item) => {
    const unitPrice = parseInt(item.unit_price || item.price || 0);
    const originalPrice = parseInt(item.original_price || unitPrice);
    const quantity = parseInt(item.quantity || 1);
    
    const finalLineTotal = item.total_price || (unitPrice * quantity);
    const originalLineTotal = item.original_total || (originalPrice * quantity);
    
    return {
      id_unique: item.id_unique,
      name: item.product_name || "محصول",
      qty: quantity,
      unitPrice: unitPrice,
      originalUnitPrice: originalPrice,
      finalLineTotal: finalLineTotal,
      originalLineTotal: originalLineTotal,
      hasDiscount: originalPrice > unitPrice,
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
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isGuest, setIsGuest] = useState(false); // ✅ اضافه شد

  const loadCart = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const result = await fetchCart();
      
      if (result.success) {
        const items = result.data?.cart || result.data?.items || [];
        setCartItems(transformBackendCart(items));
        setIsGuest(result.data.is_guest || false); // ✅ حالا تعریف شده
        setIsAuthenticated(!result.data.is_guest);
      } else {
        if (result.unauthorized) {
          setIsAuthenticated(false);
          setIsGuest(true); // ✅ اگر لاگین نیست، مهمانه
          setCartItems([]);
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

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const totalItems = useMemo(() => 
    cartItems.reduce((sum, item) => sum + (item.qty || 1), 0),
  [cartItems]);

  const totalPrice = useMemo(() => 
    cartItems.reduce((sum, item) => sum + (item.finalLineTotal || 0), 0),
  [cartItems]);

  const originalTotalPrice = useMemo(() => 
    cartItems.reduce((sum, item) => sum + (item.originalLineTotal || 0), 0),
  [cartItems]);

  const hasAnyDiscount = originalTotalPrice > totalPrice;
  const savingsAmount = originalTotalPrice - totalPrice;
  const uniqueItemsCount = useMemo(() => cartItems.length, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        uniqueItemsCount,
        totalPrice,
        originalTotalPrice,
        hasAnyDiscount,
        savingsAmount,
        loading,
        isAuthenticated,
        isGuest,           // ✅ export شد
        setIsGuest,        // ✅ export شد (اگه لازم داری)
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
