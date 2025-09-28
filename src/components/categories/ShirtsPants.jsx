import React from "react";
import Card from "../Card";

export default function Women() {
  const cards = [
    {
      id: 1,
      title: "شال",
      image: "/images/scarf.png",
      basePrice: 15000,
      category: "زنانه",
      options: [
        { key: "wash", label: "شستشو", price: 5000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 10000, type: "checkbox" },
      ],
    },
    {
      id: 2,
      title: "لباس زنانه",
      image: "/images/women-dress.png",
      basePrice: 30000,
      category: "زنانه",
      options: [
        { key: "wash", label: "شستشو", price: 5000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 10000, type: "checkbox" },
      ],
    },
    {
      id: 3,
      title: "مانتو",
      image: "/images/manto.png",
      basePrice: 35000,
      category: "زنانه",
      options: [
        { key: "dry", label: "خشکشویی", price: 10000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
        { key: "stain", label: "لکه‌گیری", price: 8000, type: "checkbox" },
      ],
    },
    {
      id: 4,
      title: "پالتو",
      image: "/images/coat.png",
      basePrice: 45000,
      category: "زنانه",
      options: [
        { key: "dry", label: "خشکشویی", price: 10000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
        { key: "stain", label: "لکه‌گیری", price: 8000, type: "checkbox" },
      ],
    },
    {
      id: 5,
      title: "تاپ زنانه",
      image: "/images/tanktop.png",
      basePrice: 20000,
      category: "زنانه",
      options: [
        { key: "wash", label: "شستشو", price: 5000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
      ],
    },
    {
      id: 6,
      title: "مانتو پاییزی",
      image: "/images/fall-manto.png",
      basePrice: 40000,
      category: "زنانه",
      options: [
        { key: "dry", label: "خشکشویی", price: 10000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
        { key: "stain", label: "لکه‌گیری", price: 8000, type: "checkbox" },
      ],
    },
    {
      id: 7,
      title: "چادر",
      image: "/images/chador.png",
      basePrice: 25000,
      category: "زنانه",
      options: [
        { key: "wash", label: "شستشو", price: 5000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
      ],
    },
    {
      id: 8,
      title: "دامن",
      image: "/images/skirt.png",
      basePrice: 22000,
      category: "زنانه",
      options: [
        { key: "wash", label: "شستشو", price: 5000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
      ],
    },
    {
      id: 9,
      title: "لباس شب",
      image: "/images/evening-dress.png",
      basePrice: 60000,
      category: "زنانه",
      options: [
        { key: "dry", label: "خشکشویی ویژه", price: 15000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
        { key: "stain", label: "لکه‌گیری", price: 8000, type: "checkbox" },
      ],
    },
    {
      id: 10,
      title: "روسری",
      image: "/images/headscarf.png",
      basePrice: 15000,
      category: "زنانه",
      options: [
        { key: "wash", label: "شستشو", price: 5000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
      ],
    },
    {
      id: 11,
      title: "بلوز",
      image: "/images/blouse.png",
      basePrice: 25000,
      category: "زنانه",
      options: [
        { key: "wash", label: "شستشو", price: 5000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 10000, type: "checkbox" },
      ],
    },
    {
      id: 12,
      title: "اورال",
      image: "/images/overall.png",
      basePrice: 40000,
      category: "زنانه",
      options: [
        { key: "dry", label: "خشکشویی", price: 10000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
      ],
    },
    {
      id: 13,
      title: "سارافون",
      image: "/images/sarafan.png",
      basePrice: 30000,
      category: "زنانه",
      options: [
        { key: "wash", label: "شستشو", price: 5000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 10000, type: "checkbox" },
      ],
    },
    {
      id: 14,
      title: "دامن بلند",
      image: "/images/long-skirt.png",
      basePrice: 28000,
      category: "زنانه",
      options: [
        { key: "wash", label: "شستشو", price: 5000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
      ],
    },
    {
      id: 15,
      title: "دامن پلیسه",
      image: "/images/plisse.png",
      basePrice: 32000,
      category: "زنانه",
      options: [
        { key: "dry", label: "خشکشویی ویژه", price: 15000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
        { key: "wash", label: "شستشو", price: 5000, type: "checkbox" },
      ],
    },
    {
      id: 16,
      title: "لباس عروس",
      image: "/images/wedding-dress.png",
      basePrice: 120000,
      category: "زنانه",
      options: [
        { key: "dry", label: "خشکشویی ویژه", price: 20000, type: "checkbox" },
        { key: "iron", label: "اتو دستی", price: 5000, type: "checkbox" },
        { key: "pack", label: "بسته‌بندی", price: 5000, type: "checkbox" },
      ],
    },
    {
      id: 17,
      title: "جوراب شلواری",
      image: "/images/tights.png",
      basePrice: 10000,
      category: "زنانه",
      options: [
        { key: "wash", label: "شستشو ملایم", price: 3000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 5000, type: "checkbox" },
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
