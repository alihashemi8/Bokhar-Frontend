// src/api/discountsApi.js

const API_BASE = import.meta.env.VITE_API_URL;

// Helper fetch wrapper
async function request(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${endpoint}`, options);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API Error:", errorText);
    throw new Error(errorText);
  }

  return res.json();
}

// ****** SERVICES ******

// دسته‌بندی سرویس‌ها
export const fetchCategories = () =>
  request("/services/categories/");

// سرویس‌ها با جستجو
export const fetchServices = (query = "") =>
  request(`/services/?search=${query}`);

// تب‌های قیمت سرویس
export const fetchServiceTabs = (serviceId) =>
  request(`/services/${serviceId}/tabs/`);

// متریال‌های سرویس
export const fetchServiceMaterials = (serviceId) =>
  request(`/services/${serviceId}/materials/`);


// ****** PRODUCT DISCOUNT ******
export const createProductDiscount = (data) =>
  request("/discounts/product-discounts/", "POST", data);


// ****** GLOBAL DISCOUNT ******
export const fetchGlobalDiscounts = () =>
  request("/discounts/global-discounts/");

export const createGlobalDiscount = (data) =>
  request("/discounts/global-discounts/", "POST", data);

export const updateGlobalDiscount = (id, data) =>
  request(`/discounts/global-discounts/${id}/`, "PUT", data);


// ****** COUPON ******
export const fetchCoupons = () =>
  request("/discounts/coupons/");

export const createCoupon = (data) =>
  request("/discounts/coupons/", "POST", data);

export const updateCoupon = (id, data) =>
  request(`/discounts/coupons/${id}/`, "PUT", data);
