import { createContext, useState, useEffect } from "react";
import api from "./servicesApi";

export const ServicesContext = createContext();

export function ServicesProvider({ children }) {
  const getCategories = () => {
    try {
      const data = localStorage.getItem("categories");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const getServices = () => {
    try {
      const data = localStorage.getItem("services");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const [categories, setCategoriesState] = useState(getCategories());
  const [services, setServicesState] = useState(getServices());

  const setCategories = (cats) => {
    setCategoriesState(cats);
    localStorage.setItem("categories", JSON.stringify(cats));
  };

  const setServices = (svcs) => {
    setServicesState(svcs);
    localStorage.setItem("services", JSON.stringify(svcs));
  };

  const refreshData = async () => {
    try {
      const cats = await api.getCategories();
      const products = await api.getProducts();
      // آبجکت کامل { id, name } نگه می‌داریم
      setCategories(cats);
      setServices(products);
    } catch (err) {
      console.error("خطا در ری‌فرش داده‌ها:", err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <ServicesContext.Provider
      value={{ categories, services, setCategories, setServices, refreshData }}
    >
      {children}
    </ServicesContext.Provider>
  );
}
