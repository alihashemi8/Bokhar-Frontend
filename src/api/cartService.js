// src/api/cartService.js

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const GUEST_CART_KEY = 'guest_cart';

// ✅ تشخیص لاگین
export const checkIsAuthenticated = () => {
  return !!localStorage.getItem('access_token') || !!localStorage.getItem('is_logged_in');
};

// ✅ توابع مدیریت سبد مهمان
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

const generateGuestId = () => `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ✅ دریافت سبد
export const fetchCart = async () => {
  if (!checkIsAuthenticated()) {
    const guestCart = getGuestCart();
    return { 
      success: true, 
      data: {
        items: guestCart.map(item => ({
          ...item,
          unit_price: item.price,
          total_price: (item.price || 0) * (item.quantity || 1)
        })),
        cart: guestCart,
        total: guestCart.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0),
        is_guest: true
      }
    };
  }

  try {
    const response = await fetch(`${API_BASE}/cart/`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.status === 401) {
      return { success: false, unauthorized: true };
    }
    
    if (!response.ok) throw new Error("API Error");
    
    const data = await response.json();
    return { success: true, data: { ...data, is_guest: false } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ✅ افزودن به سبد
export const addToCart = async (productId, quantity = 1, options = {}) => {
  if (!checkIsAuthenticated()) {
    const guestCart = getGuestCart();
    
    const newItem = {
      id_unique: generateGuestId(),
      product_id: productId,
      product_name: options.product_name || `محصول ${productId}`,
      service: options.service || "",
      material: options.material || "",
      size: options.size || null,
      quantity: parseInt(quantity),
      price: options.price || 0,
      unit_price: options.price || 0,
      image: options.image || null,
      added_at: new Date().toISOString()
    };

    const existingIndex = guestCart.findIndex(item => 
      item.product_id === productId && 
      item.service === options.service && 
      item.material === options.material &&
      item.size === options.size
    );

    if (existingIndex >= 0) {
      guestCart[existingIndex].quantity += parseInt(quantity);
    } else {
      guestCart.push(newItem);
    }

    saveGuestCart(guestCart);
    
    return { success: true, data: { message: "به سبد مهمان اضافه شد" }, is_guest: true };
  }

  try {
    const response = await fetch(`${API_BASE}/cart/add/${productId}/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        quantity: parseInt(quantity),
        service: options.service || "",
        material: options.material || "",
        size: options.size || null
      })
    });
    
    if (response.status === 401) return { success: false, unauthorized: true };
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ✅ حذف آیتم
export const removeCartItem = async (idUnique) => {
  if (!checkIsAuthenticated()) {
    const guestCart = getGuestCart().filter(item => item.id_unique !== idUnique);
    saveGuestCart(guestCart);
    return { success: true };
  }
  
  try {
    const response = await fetch(`${API_BASE}/cart/remove/${encodeURIComponent(idUnique)}/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-CSRFToken': getCookie('csrftoken') }
    });
    return { success: response.ok };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ✅ آپدیت تعداد
export const updateCartQuantity = async (idUnique, newQuantity) => {
  if (!checkIsAuthenticated()) {
    const guestCart = getGuestCart();
    const index = guestCart.findIndex(item => item.id_unique === idUnique);
    
    if (index >= 0) {
      if (newQuantity <= 0) {
        guestCart.splice(index, 1);
      } else {
        guestCart[index].quantity = newQuantity;
      }
      saveGuestCart(guestCart);
    }
    return { success: true };
  }
  
  try {
    const response = await fetch(`${API_BASE}/cart/update/${encodeURIComponent(idUnique)}/`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({ quantity: newQuantity })
    });
    return { success: response.ok };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ✅ همگام‌سازی با سرور بعد از لاگین
export const syncGuestCartWithServer = async () => {
  const guestCart = getGuestCart();
  if (guestCart.length === 0) return { success: true };
  
  try {
    const promises = guestCart.map(item => 
      fetch(`${API_BASE}/cart/add/${item.product_id}/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          quantity: item.quantity,
          service: item.service,
          material: item.material,
          size: item.size
        })
      })
    );
    
    await Promise.all(promises);
    localStorage.removeItem(GUEST_CART_KEY);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ✅ پاک کردن سبد
export const clearCart = async () => {
  if (!checkIsAuthenticated()) {
    localStorage.removeItem(GUEST_CART_KEY);
    return { success: true };
  }
  
  try {
    await fetch(`${API_BASE}/cart/delete/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-CSRFToken': getCookie('csrftoken') }
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Helper
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default {
  fetchCart,
  addToCart,
  removeCartItem,
  updateCartQuantity,
  syncGuestCartWithServer,
  clearCart,
  checkIsAuthenticated,
  getGuestCart,
  saveGuestCart
};
