import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import ServiceModalMobile from "./ServiceModalMobile";
import ServiceModalDesktop from "./ServiceModalDesktop";

export default function ServiceModal({ onClose, pricing, onAddToCart }) {
  const { addToCart } = useCart();

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") return window.innerWidth < 768;
    return false;
  });

  const [selectedMain, setSelectedMain] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});

  // سرویس‌های اصلی (از تب‌ها)
  const mainServices = Object.keys(pricing || {}).map((tab) => ({
    name: tab,
    price: 0, // قیمت اصلی انتخاب نمی‌شود. آپشن انتخاب می‌شود.
  }));

  // ساخت ساختار cardServices برای گزینه‌های اضافه
  const cardServices = Object.entries(pricing || {}).map(([tabName, tab]) => ({
    name: tabName,
    choices: Object.entries(tab.materialPrices).map(([mat, price]) => ({
      label: mat,
      price: Number(price),
    })),
  }));

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  const handleMainSelect = (service) => {
    setSelectedMain(service);
    setQuantity(1);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((p) => Math.max(1, p + delta));
  };

  const handleOptionToggle = (group, value, price = 0) => {
    setSelectedOptions((prev) => {
      const prevSet = prev[group] || [];
      return prevSet.includes(value)
        ? { ...prev, [group]: prevSet.filter((v) => v !== value) }
        : {
            ...prev,
            [group]: [...prevSet, value],
            [`${group}_price_${value}`]: price,
          };
    });
  };

  const totalPrice =
    Object.entries(selectedOptions).reduce((sum, [key, val]) => {
      if (key.includes("_price_")) return sum;
      return (
        sum +
        val.reduce((s, v) => s + (selectedOptions[`${key}_price_${v}`] || 0), 0)
      );
    }, 0) * quantity;

  const handleAdd = () => {
    if (!selectedMain) return;

    const options = {};
    Object.entries(selectedOptions).forEach(([k, v]) => {
      if (!k.includes("_price_")) options[k] = v;
    });

    addToCart({
      id: selectedMain.name,
      name: selectedMain.name,
      price: 0,
      qty: quantity,
      options,
    });

    Object.entries(selectedOptions).forEach(([k, vals]) => {
      if (k.includes("_price_")) return;
      vals.forEach((v) =>
        addToCart({
          id: `${k}-${v}`,
          name: `${k}: ${v}`,
          price: selectedOptions[`${k}_price_${v}`] || 0,
          qty: quantity,
          options: {},
        })
      );
    });

    setSelectedMain(null);
    setQuantity(1);
    setSelectedOptions({});
    onClose();
  };

  const sharedProps = {
    onClose,
    defaultServices: mainServices, 
    cardServices,
    selectedMain,
    quantity,
    selectedOptions,
    totalPrice,
    handleMainSelect,
    handleQuantityChange,
    handleOptionToggle,
    handleAdd,
  };

  return isMobile ? (
    <ServiceModalMobile {...sharedProps} />
  ) : (
    <ServiceModalDesktop {...sharedProps} />
  );
}
