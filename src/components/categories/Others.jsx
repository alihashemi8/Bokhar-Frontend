import React from "react";
import Card from "../Card";

export default function Others() {
  const cards = [
    {
      id: 2,
      title: "جوراب",
      image: "/images/robe.png",
      basePrice: 20000,
      category: "سایر",
      options: [
        { key: "wash", label: "شستشو", price: 7000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 10000, type: "checkbox" },
      ],
    },
    {
      id: 3,
      title: "پیشبند",
      image: "/images/apron.png",
      basePrice: 10000,
      category: "سایر",
      options: [{ key: "wash", label: "شستشو", price: 3000, type: "checkbox" }],
    },
    {
      id: 4,
      title: "روپوش",
      image: "/images/coat.png",
      basePrice: 25000,
      category: "سایر",
      options: [
        { key: "wash", label: "شستشو", price: 8000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 12000, type: "checkbox" },
      ],
    },
    {
      id: 5,
      title: "دستکش",
      image: "/images/gloves.png",
      basePrice: 15000,
      category: "سایر",
      options: [{ key: "wash", label: "شستشو", price: 4000, type: "checkbox" }],
    },
    {
      id: 6,
      title: "جانماز",
      image: "/images/prayer-mat.png",
      basePrice: 12000,
      category: "سایر",
      options: [
        { key: "wash", label: "شستشو کامل", price: 7000, type: "checkbox" },
      ],
    },
    {
      id: 7,
      title: "پرچم",
      image: "/images/flag.png",
      basePrice: 10000,
      category: "سایر",
      options: [{ key: "wash", label: "شستشو", price: 3000, type: "checkbox" }],
    },
    {
      id: 8,
      title: "کلاه",
      image: "/images/hat.png",
      basePrice: 8000,
      category: "سایر",
      options: [{ key: "wash", label: "شستشو", price: 2000, type: "checkbox" }],
    },
    {
      id: 9,
      title: "سجاده",
      image: "/images/rug.png",
      basePrice: 15000,
      category: "سایر",
      options: [
        { key: "wash", label: "شستشو کامل", price: 5000, type: "checkbox" },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {cards.map((card) => (
        <Card key={card.id} {...card} />
      ))}
    </div>
  );
}
