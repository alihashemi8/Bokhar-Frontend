import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // افزودن به سبد
  const addToCart = (item) => {
    const index = cartItems.findIndex(
      i => i.id === item.id && JSON.stringify(i.options) === JSON.stringify(item.options)
    );

    if (index > -1) {
      setCartItems(prev =>
        prev.map((i, idx) =>
          idx === index ? { ...i, qty: i.qty + item.qty } : i
        )
      );
    } else {
      setCartItems(prev => [...prev, item]);
    }
  };

  // افزایش تعداد
  const increaseQty = (item) => {
    setCartItems(prev =>
      prev.map(i =>
        i.id === item.id && JSON.stringify(i.options) === JSON.stringify(item.options)
          ? { ...i, qty: i.qty + 1 }
          : i
      )
    );
  };

  // کاهش تعداد
  const decreaseQty = (item) => {
    setCartItems(prev =>
      prev
        .map(i =>
          i.id === item.id && JSON.stringify(i.options) === JSON.stringify(item.options)
            ? { ...i, qty: i.qty - 1 }
            : i
        )
        .filter(i => i.qty > 0)
    );
  };

  // حذف آیتم
  const removeFromCart = (item) => {
    setCartItems(prev =>
      prev.filter(
        i => i.id !== item.id || JSON.stringify(i.options) !== JSON.stringify(item.options)
      )
    );
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        totalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
