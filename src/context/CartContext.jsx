import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  // سبد از localStorage لود میشه
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // هر بار تغییر کرد ذخیره میشه
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // تابع مقایسه گزینه‌ها
  const isSameOptions = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  // افزودن به سبد
  const addToCart = (item) => {
    const index = cartItems.findIndex(
      (i) => i.id === item.id && isSameOptions(i.options, item.options)
    );

    if (index > -1) {
      setCartItems((prev) =>
        prev.map((i, idx) =>
          idx === index ? { ...i, qty: i.qty + item.qty } : i
        )
      );
    } else {
      setCartItems((prev) => [...prev, item]);
    }
  };

  // افزایش تعداد
  const increaseQty = (item) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === item.id && isSameOptions(i.options, item.options)
          ? { ...i, qty: i.qty + 1 }
          : i
      )
    );
  };

  // کاهش تعداد
  const decreaseQty = (item) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.id === item.id && isSameOptions(i.options, item.options)
            ? { ...i, qty: i.qty - 1 }
            : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  // حذف آیتم
  const removeFromCart = (item) => {
    setCartItems((prev) =>
      prev.filter(
        (i) => i.id !== item.id || !isSameOptions(i.options, item.options)
      )
    );
  };

  // تعداد کل آیتم‌ها
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  // جمع کل مبلغ
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
