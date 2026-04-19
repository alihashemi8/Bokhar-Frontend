const API_BASE = import.meta.env.VITE_API_URL;

// ---------- Helper Request ----------
async function request(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, options);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API Error:", errorText);
    throw new Error(`API Error ${res.status}`);
  }

  return res.json();
}

// =====================================================
// PRODUCTS (همان سرویس‌هایی که در بک‌اند داری)
// =====================================================

// گرفتن همه محصولات
export const fetchProducts = () => request("/products/");

// گرفتن یک محصول
export const fetchProduct = (id) => request(`/products/${id}/`);

// جستجوی محصول
export const searchProducts = (query = "") =>
  request(`/products/search/?search=${encodeURIComponent(query)}`);

// گرفتن ساختار کامل قیمت محصول
export const fetchProductFullPricing = (id) =>
  request(`/products/${id}/`);

// =====================================================
// CATEGORIES
// =====================================================

export const fetchCategories = () => request("/categories/");

export const fetchCategory = (id) =>
  request(`/categories/${id}/`);

// =====================================================
// PRODUCT DISCOUNTS
// =====================================================

export const createProductDiscount = (data) =>
  request("/discounts/product-discounts/", "POST", data);

// =====================================================
// GLOBAL DISCOUNTS
// =====================================================

export const fetchGlobalDiscounts = () =>
  request("/discounts/global-discounts/");

export const createGlobalDiscount = (data) =>
  request("/discounts/global-discounts/", "POST", data);

export const updateGlobalDiscount = (id, data) =>
  request(`/discounts/global-discounts/${id}/`, "PUT", data);

// =====================================================
// COUPONS
// =====================================================

export const fetchCoupons = () =>
  request("/discounts/coupons/");

export const createCoupon = (data) =>
  request("/discounts/coupons/", "POST", data);

export const updateCoupon = (id, data) =>
  request(`/discounts/coupons/${id}/`, "PUT", data);
