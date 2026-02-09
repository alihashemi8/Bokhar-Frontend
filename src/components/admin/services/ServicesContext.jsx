import { createContext, useState } from "react";

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

  return (
    <ServicesContext.Provider
      value={{ categories, services, setCategories, setServices }}
    >
      {children}
    </ServicesContext.Provider>
  );
}
