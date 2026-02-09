export const getCategories = () => {
  try {
    const data = localStorage.getItem("categories");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const getServices = () => {
  try {
    const data = localStorage.getItem("services");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveCategories = (categories) => {
  localStorage.setItem("categories", JSON.stringify(categories));
  return categories;
};

export const saveServices = (services) => {
  localStorage.setItem("services", JSON.stringify(services));
  return services;
};
