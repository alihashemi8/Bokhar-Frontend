import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const exists = prev.find(i => i.id === item.id && JSON.stringify(i.options) === JSON.stringify(item.options));
      if (exists) {
        return prev.map(i =>
          i.id === item.id && JSON.stringify(i.options) === JSON.stringify(item.options)
            ? { ...i, qty: i.qty + item.qty }
            : i
        );
      } else {
        return [...prev, { ...item, qty: item.qty }];
      }
    });
  };

  const increaseQty = (id) => {
    setCartItems(prev =>
      prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item)
    );
  };

  const decreaseQty = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, increaseQty, decreaseQty, removeFromCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
