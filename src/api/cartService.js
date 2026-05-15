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

// ✅ تابع بهبود یافته خواندن کوکی
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    // 🔧 FIX: اضافه کردن let برای i
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

// ✅ Interceptor برای CSRF
api.interceptors.request.use((config) => {
  const token = getCookie('csrftoken');
  if (token) {
    config.headers['X-CSRFToken'] = token;
  }
  // لاگ برای دیباگ
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
  return config;
}, (error) => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

// ✅ Interceptor بهبود یافته برای پاسخ
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    // 🔧 FIX: هندل کردن خطاهای شبکه (وقتی error.response وجود ندارد)
    if (!error.response) {
      console.error('Network Error:', error.message);
      // خطای CORS یا عدم اتصال به سرور
      if (error.message === 'Network Error') {
        console.error('سرور در دسترس نیست یا خطای CORS وجود دارد');
      }
      return Promise.reject({
        ...error,
        isNetworkError: true,
        userMessage: 'خطای شبکه: لطفاً اتصال اینترنت را بررسی کنید'
      });
    }

    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      console.error('Authentication required - User not logged in');
    } else if (error.response?.status === 403) {
      console.error('CSRF Error or Permission Denied');
    }
    return Promise.reject(error);
  }
);

// تبدیل تاریخ شمسی به میلادی
const toGregorian = (shamsiDateStr) => {
  if (!shamsiDateStr) return null;
  try {
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
    if (error.response?.status === 401 || error.unauthorized) {
      return { success: false, error: "لطفاً ابتدا وارد حساب کاربری شوید", unauthorized: true };
    }
    return { 
      success: false, 
      error: error.userMessage || error.response?.data || "خطا در دریافت سبد",
      isNetworkError: error.isNetworkError 
    };
  }
};

export const addToCart = async (productId, quantity = 1, options = {}) => {
  try {
    const payload = {
      quantity: parseInt(quantity),
      service: options.service || "",
      material: options.material || "",
      size: options.size || null,
    };
    
    console.log("Sending to cart:", { productId, payload });
    
    const response = await api.post(`/cart/add/${productId}/`, payload);
    return { success: true, data: response.data };
  } catch (error) {
    // 🔧 FIX: لاگ بهتر برای دیباگ
    console.error("Cart API Error Details:", error);
    
    // 🔧 FIX: هندل کردن خطای شبکه
    if (error.isNetworkError || !error.response) {
      return { 
        success: false, 
        error: "خطای شبکه: اتصال به سرور برقرار نشد",
        isNetworkError: true
      };
    }
    
    if (error.response?.status === 401) {
      return { success: false, error: "لطفاً ابتدا وارد حساب کاربری شوید", unauthorized: true };
    }
    
    // 🔧 FIX: استخراج پیام خطای صحیح از پاسخ سرور
    const errorMessage = typeof error.response?.data === 'string' 
      ? error.response.data 
      : error.response?.data?.error 
      || error.response?.data?.detail 
      || error.response?.data?.message 
      || "خطا در افزودن به سبد";
    
    return { 
      success: false, 
      error: errorMessage,
      status: error.response?.status
    };
  }
};

export const removeCartItem = async (idUnique) => {
  try {
    const encodedId = encodeURIComponent(idUnique);
    const response = await api.post(`/cart/remove/${encodedId}/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Remove error:', error);
    if (error.response?.status === 401 || error.unauthorized) {
      return { success: false, error: "لطفاً ابتدا وارد حساب کاربری شوید", unauthorized: true };
    }
    if (error.response?.status === 404) {
      return { success: false, error: "آیتم در سبد یافت نشد" };
    }
    return { success: false, error: error.userMessage || error.response?.data || "خطای حذف آیتم" };
  }
};

export const decrementCartItem = async (idUnique) => {
  try {
    const encodedId = encodeURIComponent(idUnique);
    const response = await api.post(`/cart/decrement/${encodedId}/`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.userMessage || error.response?.data || "خطا در کاهش تعداد" };
  }
};

export const updateCartQuantity = async (idUnique, newQuantity) => {
  try {
    const encodedId = encodeURIComponent(idUnique);
    const response = await api.patch(`/cart/update/${encodedId}/`, { quantity: newQuantity });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 401 || error.unauthorized) {
      return { success: false, error: "لطفاً ابتدا وارد حساب کاربری شوید", unauthorized: true };
    }
    if (error.response?.status === 404) {
      return { success: false, error: "آیتم در سبد یافت نشد" };
    }
    return { success: false, error: error.userMessage || error.response?.data || "خطای بروزرسانی" };
  }
};

export const clearCart = async () => {
  try {
    await api.post('/cart/delete/');
    return { success: true };
  } catch (error) {
    if (error.response?.status === 401 || error.unauthorized) {
      return { success: false, error: "لطفاً ابتدا وارد حساب کاربری شوید", unauthorized: true };
    }
    return { success: false, error: error.userMessage || error.response?.data || "خطای پاک کردن سبد" };
  }
};

const transformCartItems = (cartItems) => {
  return cartItems.map(item => ({
    service_item_id: item.id_unique,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    original_price: item.original_price || item.unit_price,
    description: `${item.service || ''} - ${item.material || ''}`.trim(),
    size: item.size,
    size_display: item.size_display
  }));
};

export const createOrder = async ({
  cartItems,
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
    console.error("Order creation failed:", error);
    if (error.response?.status === 401 || error.unauthorized) {
      return { success: false, errors: { general: "لطفاً ابتدا وارد حساب کاربری شوید" }, unauthorized: true };
    }
    
    // اگر خطای اعتبارسنجی فیلدها باشد
    if (error.response?.status === 400 && typeof error.response.data === 'object') {
      return { success: false, errors: error.response.data };
    }
    
    return { 
      success: false, 
      errors: { general: error.userMessage || "خطای سرور در ایجاد سفارش" } 
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
    console.error('Capacity check error:', error);
    return { available: false, remaining: 0, error: true };
  }
};

export default api;
