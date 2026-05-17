// src/api/cartService.js

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const GUEST_CART_KEY = "guest_cart";

/* ======================= */
/*  Guest Cart Helpers     */
/* ======================= */

export const getGuestCart = () => {
  try {
    const cart = localStorage.getItem(GUEST_CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const saveGuestCart = (cart) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
};

const generateGuestId = () =>
  `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

/* ======================= */
/*  Fetch Cart             */
/* ======================= */

export const fetchCart = async () => {
  try {
    const res = await fetch(`${API_BASE}/cart/`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    // 🔴 مهمان
    if (res.status === 401) {
      const guestCart = getGuestCart();

      return {
        success: true,
        data: {
          items: guestCart.map((item) => ({
            ...item,
            unit_price: item.price,
            total_price: (item.price || 0) * (item.quantity || 1),
          })),
          total: guestCart.reduce(
            (sum, item) => sum + (item.price || 0) * item.quantity,
            0
          ),
          is_guest: true,
        },
      };
    }

    // ✅ لاگین
    if (!res.ok) throw new Error("Failed to fetch cart");

    const data = await res.json();
    return { success: true, data: { ...data, is_guest: false } };

  } catch (err) {
    return { success: false, error: err.message };
  }
};

/* ======================= */
/*  Add To Cart            */
/* ======================= */

export const addToCart = async (productId, quantity = 1, options = {}) => {
  try {
    const res = await fetch(`${API_BASE}/cart/add/${productId}/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        quantity: Number(quantity),
        service: options.service || "",
        material: options.material || "",
        size: options.size || null,
      }),
    });

    // 🔴 مهمان → ذخیره در localStorage
    if (res.status === 401) {
      const guestCart = getGuestCart();

      const index = guestCart.findIndex(
        (i) =>
          i.product_id === productId &&
          i.service === options.service &&
          i.material === options.material &&
          i.size === options.size
      );

      if (index >= 0) {
        guestCart[index].quantity += Number(quantity);
      } else {
        guestCart.push({
          id_unique: generateGuestId(),
          product_id: productId,
          product_name: options.product_name || "",
          quantity: Number(quantity),
          price: options.price || 0,
          unit_price: options.price || 0,
          original_price: options.original_price || options.price || 0,
          has_discount: options.has_discount || false,
          discount_type: options.discount_type,
          discount_value: options.discount_value,
          service: options.service || "",
          material: options.material || "",
          size: options.size || null,
          image: options.image || null,
        });
      }

      saveGuestCart(guestCart);
      return { success: true, is_guest: true };
    }

    if (!res.ok) throw new Error("Add to cart failed");
    return { success: true, data: await res.json() };

  } catch (err) {
    return { success: false, error: err.message };
  }
};

/* ======================= */
/*  Remove Item            */
/* ======================= */

export const removeCartItem = async (idUnique) => {
  try {
    const res = await fetch(
      `${API_BASE}/cart/remove/${encodeURIComponent(idUnique)}/`,
      {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
      }
    );

    // مهمان
    if (res.status === 401) {
      const cart = getGuestCart().filter((i) => i.id_unique !== idUnique);
      saveGuestCart(cart);
      return { success: true, is_guest: true };
    }

    return { success: res.ok };

  } catch (err) {
    return { success: false, error: err.message };
  }
};

/* ======================= */
/*  Update Quantity        */
/* ======================= */

export const updateCartQuantity = async (idUnique, quantity) => {
  try {
    const res = await fetch(
      `${API_BASE}/cart/update/${encodeURIComponent(idUnique)}/`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({ quantity }),
      }
    );

    // مهمان
    if (res.status === 401) {
      const cart = getGuestCart();
      const index = cart.findIndex((i) => i.id_unique === idUnique);

      if (index >= 0) {
        quantity <= 0
          ? cart.splice(index, 1)
          : (cart[index].quantity = quantity);
        saveGuestCart(cart);
      }

      return { success: true, is_guest: true };
    }

    return { success: res.ok };

  } catch (err) {
    return { success: false, error: err.message };
  }
};

/* ======================= */
/*  Clear Cart             */
/* ======================= */

export const clearCart = async () => {
  try {
    const res = await fetch(`${API_BASE}/cart/delete/`, {
      method: "POST",
      credentials: "include",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
    });

    if (res.status === 401) {
      localStorage.removeItem(GUEST_CART_KEY);
      return { success: true, is_guest: true };
    }

    return { success: true };

  } catch (err) {
    return { success: false, error: err.message };
  }
};

/* ======================= */
/*  Sync Guest Cart        */
/* ======================= */

export const syncGuestCartWithServer = async () => {
  const guestCart = getGuestCart();
  if (!guestCart.length) return;

  for (const item of guestCart) {
    await fetch(`${API_BASE}/cart/add/${item.product_id}/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        quantity: item.quantity,
        service: item.service,
        material: item.material,
        size: item.size,
      }),
    });
  }

  localStorage.removeItem(GUEST_CART_KEY);
};

/* ======================= */
/*  Cookie Helper          */
/* ======================= */

function getCookie(name) {
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

export default {
  fetchCart,
  addToCart,
  removeCartItem,
  updateCartQuantity,
  clearCart,
  syncGuestCartWithServer,
};
