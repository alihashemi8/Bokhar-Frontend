const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error:", errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Categories
  getCategories: () => fetchWithAuth("/categories/"),
  createCategory: (name) =>
    fetchWithAuth("/categories/", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  deleteCategory: (id) =>
    fetchWithAuth(`/categories/${id}/`, { method: "DELETE" }),

  // Products/Services
  getProducts: () => fetchWithAuth("/products/"),
  getProduct: (id) => fetchWithAuth(`/products/${id}/`),

  createProduct: (data) =>
    fetchWithAuth("/products/create/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateProduct: (id, data) =>
    fetchWithAuth(`/products/${id}/update/`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteProduct: (id) =>
    fetchWithAuth(`/products/${id}/delete/`, { method: "DELETE" }),

  searchProducts: (q) =>
    fetchWithAuth(`/products/search/?q=${encodeURIComponent(q)}`),
};
