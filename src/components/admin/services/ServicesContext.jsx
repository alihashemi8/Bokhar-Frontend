import { createContext, useState } from "react";

export const ServicesContext = createContext();

export function ServicesProvider({ children }) {
  // بارگذاری اولیه از localStorage با بررسی معتبر بودن JSON
  const parseJSON = (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item);
    } catch (e) {
      return fallback;
    }
  };

  const [categories, setCategories] = useState(parseJSON("categories", []));
  const [services, setServices] = useState(parseJSON("services", []));

  // helper برای بروزرسانی همزمان state و localStorage
  const updateCategories = (newCats) => {
    setCategories(newCats);
    localStorage.setItem("categories", JSON.stringify(newCats));
  };

  const updateServices = (newServices) => {
    setServices(newServices);
    localStorage.setItem("services", JSON.stringify(newServices));
  };

  return (
    <ServicesContext.Provider
      value={{
        categories,
        services,
        setCategories: updateCategories,
        setServices: updateServices
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}
