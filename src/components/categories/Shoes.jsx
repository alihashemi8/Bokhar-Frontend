import React from "react";
import Card from "../Card";

const shoesData = [
  {
    id: 1,
    title: "کتونی",
    image: "/images/sneakers.png",
    basePrice: 50000,
    category: "کفش",
    options: [
      { key: "clean", label: "تمیزکاری", price: 10000, type: "checkbox" },
      { key: "polish", label: "واکس", price: 5000, type: "checkbox" },
      { key: "stain", label: "لکه‌گیری", price: 8000, type: "checkbox" },
      { key: "size", label: "سایز", type: "select", choices: [
        { value: "38", label: "38", price: 0 },
        { value: "39", label: "39", price: 0 },
        { value: "40", label: "40", price: 0 },
      ]},
    ],
  },
  {
    id: 2,
    title: "کیف زنانه",
    image: "/images/women-bag.png",
    basePrice: 50000,
    category: "کیف",
    options: [
      { key: "clean", label: "تمیزکاری", price: 10000, type: "checkbox" },
      { key: "sanitize", label: "ضدعفونی", price: 5000, type: "checkbox" },
      { key: "material", label: "جنس کیف", type: "select", choices: [
        { value: "leather", label: "چرم", price: 10000 },
        { value: "fabric", label: "پارچه‌ای", price: 0 },
      ]},
    ],
  },
  {
    id: 3,
    title: "بوت",
    image: "/images/boots.png",
    basePrice: 60000,
    category: "کفش",
    options: [
      { key: "clean", label: "تمیزکاری", price: 12000, type: "checkbox" },
      { key: "polish", label: "واکس", price: 8000, type: "checkbox" },
      { key: "stain", label: "لکه‌گیری", price: 10000, type: "checkbox" },
      { key: "size", label: "سایز", type: "select", choices: [
        { value: "38", label: "38", price: 0 },
        { value: "39", label: "39", price: 0 },
        { value: "40", label: "40", price: 0 },
        { value: "41", label: "41", price: 0 },
      ]},
    ],
  },
  {
    id: 4,
    title: "چمدان",
    image: "/images/suitcase.png",
    basePrice: 80000,
    category: "کیف",
    options: [
      { key: "clean", label: "تمیزکاری", price: 15000, type: "checkbox" },
      { key: "pack", label: "بسته‌بندی سفر", price: 5000, type: "checkbox" },
    ],
  },
  {
    id: 5,
    title: "صندل",
    image: "/images/sandal.png",
    basePrice: 35000,
    category: "کفش",
    options: [
      { key: "clean", label: "تمیزکاری", price: 8000, type: "checkbox" },
      { key: "polish", label: "واکس", price: 4000, type: "checkbox" },
      { key: "size", label: "سایز", type: "select", choices: [
        { value: "36", label: "36", price: 0 },
        { value: "37", label: "37", price: 0 },
        { value: "38", label: "38", price: 0 },
      ]},
    ],
  },
];

export default function Shoes() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {shoesData.map((item) => (
        <Card key={item.id} {...item} />
      ))}
    </div>
  );
}
