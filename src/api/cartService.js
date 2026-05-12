import axios from 'axios';
import moment from 'jalali-moment'; 

const API_BASE = import.meta.env?.VITE_API_URL || process?.env?.REACT_APP_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// ✅ Interceptor برای خواندن خودکار CSRF قبل از هر درخواست
api.interceptors.request.use((config) => {
  const token = getCookie('csrftoken');
  if (token) {
    config.headers['X-CSRFToken'] = token;
  }
  return config;
});

// ✅ Interceptor برای هندل کردن خطاهای عمومی (اختیاری ولی مفید)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error('CSRF Error or Permission Denied');
    }
    return Promise.reject(error);
  }
);

// ✅ تابع تبدیل اصلاح شده با پشتیبانی اعداد فارسی
const toGregorian = (shamsiDateStr) => {
  if (!shamsiDateStr) return null;
  try {
    // تبدیل اعداد فارسی به انگلیسی
    const faToEn = (str) => str.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728));
    const cleanDate = faToEn(shamsiDateStr).replace(/\//g, '-');
    
    const m = moment(cleanDate, 'jYYYY-jMM-jDD');
    if (!m.isValid()) return null;
    
    return m.format('YYYY-MM-DD');
  } catch (e) {
    console.error("Date conversion error:", e);
    return null;
  }
};

const TIME_SLOT_MAP = {
  "۸ صبح تا ۱۳": "morning",
  "۱۶ تا ۲۰": "evening"
};

export const REVERSE_TIME_MAP = {
  "morning": "۸ صبح تا ۱۳",
  "evening": "۱۶ تا ۲۰"
};

// ───────────────────────────────────────────
// API Functions 
// ───────────────────────────────────────────

export const fetchCart = async () => {
  try {
    const response = await api.get('/cart/');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || "خطا در دریافت سبد" };
  }
};

export const addToCart = async (productId, quantity = 1, options = {}) => {
  try {
    const payload = {
      quantity: parseInt(quantity), // مطمئن شو integer هست
      service: options.service || "",
      material: options.material || "",
      size: options.size || null,
    };
    
    console.log("Sending to cart:", { productId, payload }); // لاگ برای دیباگ
    
    const response = await api.post(`/cart/add/${productId}/`, payload);
    return { success: true, data: response.data };
  } catch (error) {
    // لاگ دقیق خطا
    console.error("Cart API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      payload: error.config?.data // چی فرستادی
    });
    return { 
      success: false, 
      error: error.response?.data || error.message 
    };
  }
};

export const removeCartItem = async (idUnique) => {
  try {
    // ✅ encodeURIComponent برای فارسی‌ها ضروریه
    const encodedId = encodeURIComponent(idUnique);
    const response = await api.post(`/cart/remove/${encodedId}/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Remove error:', error.response?.status, error.response?.data);
    return { success: false, error: error.response?.data };
  }
};

export const updateCartQuantity = async (idUnique, newQuantity) => {
  try {
    // ✅ اینجا هم encode کن
    const encodedId = encodeURIComponent(idUnique);
    const response = await api.patch(`/cart/${encodedId}/`, { quantity: newQuantity });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data };
  }
};

export const clearCart = async () => {
  try {
    await api.delete('/cart/delete/');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.response?.data };
  }
};

const transformCartItems = (cartItems) => {
  // تطابق با خروجی بک‌اند: cartItems باید از API اومده باشن نه state محلی
  return cartItems.map(item => ({
    service_item_id: item.id, // این باید product_id یا id_unique باشه که بک‌اند می‌ده
    quantity: item.qty || item.quantity,
    unit_price: item.totalPrice,
    original_price: item.options?.originalPrice || item.totalPrice,
    description: `${item.options?.service || ''} - ${item.options?.material || ''}`.trim()
  }));
};

export const createOrder = async ({
  cartItems, // باید از fetchCart گرفته شده باشه نه از state محلی
  datetime,
  location,
  discountCode,
  customerNote = ""
}) => {
  const payload = {
    cart_items: transformCartItems(cartItems),
    pickup_date: toGregorian(datetime.pickup.date),
    pickup_shift: TIME_SLOT_MAP[datetime.pickup.time],
    delivery_date: toGregorian(datetime.delivery.date),
    delivery_shift: TIME_SLOT_MAP[datetime.delivery.time],
    address_data: {
      title: location.title,
      address: location.address,
      plaque: location.plaque,
      unit: location.unit,
      description: location.description,
      latitude: location.coords?.lat,
      longitude: location.coords?.lng
    },
    coupon_code: discountCode || null,
    service_type: datetime.pricing?.type,
    rush_fee_amount: datetime.pricing?.amount || 0,
    customer_note: customerNote
  };

  try {
    const response = await api.post('/orders/create/', payload);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Order creation failed:", error.response?.data);
    return { 
      success: false, 
      errors: error.response?.data || { general: "خطای سرور" } 
    };
  }
};

export const getTimeCapacity = async (date, shift) => {
  const gregorianDate = toGregorian(date);
  if (!gregorianDate) return { available: false, remaining: 0 };
  
  try {
    const response = await api.get('/orders/check-capacity/', {
      params: { date: gregorianDate, shift: TIME_SLOT_MAP[shift] }
    });
    return response.data; 
  } catch (error) {
    return { available: false, remaining: 0 };
  }
};

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

export default api;
