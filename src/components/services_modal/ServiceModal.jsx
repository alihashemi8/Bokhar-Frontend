import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import ServiceModalMobile from "./ServiceModalMobile";
import ServiceModalDesktop from "./ServiceModalDesktop";

export default function ServiceModal({ onClose, cardOptions }) {
  const { addToCart } = useCart();

  const [isMobile, setIsMobile] = useState(false);
  const [selectedMain, setSelectedMain] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});

  const defaultServices = [
    { name: "خشکشویی", price: 50000 },
    { name: "اتو", price: 30000 },
    { name: "خشکشویی ویژه", price: 90000 },
  ];

  const cardServices =
    cardOptions?.map((opt) => ({ ...opt, type: "select" })) || [];

  /* -------- Detect Mobile -------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* -------- Lock Scroll -------- */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  /* -------- Handlers -------- */
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
    (selectedMain?.price || 0) * quantity +
    Object.entries(selectedOptions).reduce((sum, [key, val]) => {
      if (key.includes("_price_")) return sum;
      return (
        sum +
        val.reduce(
          (s, v) => s + (selectedOptions[`${key}_price_${v}`] || 0),
          0
        )
      );
    }, 0);

  const handleAdd = () => {
    if (!selectedMain) return;

    const options = {};
    Object.entries(selectedOptions).forEach(([k, v]) => {
      if (!k.includes("_price_")) options[k] = v;
    });

    addToCart({
      id: selectedMain.name,
      name: selectedMain.name,
      price: selectedMain.price,
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
          qty: 1,
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
    defaultServices,
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
