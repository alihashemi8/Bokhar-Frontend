import React from "react";
import Card from "../Card";

export default function Shoes() {
  const cards = [
    {
      id: 1,
      title: "کتونی",
      image: "/images/sneakers.png",
      basePrice: 50000,
      category: "کفش",
      options: [
        { key: "clean", label: "تمیزکاری", price: 10000, type: "checkbox" },
        { key: "polish", label: "واکس", price: 5000, type: "checkbox" },
      ],
    },
    {
      id: 2,
      title: "کیف",
      image: "/images/bag.png",
      basePrice: 40000,
      category: "کیف",
      options: [
        { key: "clean", label: "تمیزکاری", price: 8000, type: "checkbox" },
      ],
    },
    {
      id: 3,
      title: "کوله پشتی",
      image: "/images/backpack.png",
      basePrice: 45000,
      category: "کیف",
      options: [
        { key: "clean", label: "تمیزکاری", price: 8000, type: "checkbox" },
      ],
    },
    {
      id: 4,
      title: "بوت",
      image: "/images/boots.png",
      basePrice: 60000,
      category: "کفش",
      options: [
        { key: "clean", label: "تمیزکاری", price: 12000, type: "checkbox" },
        { key: "polish", label: "واکس", price: 8000, type: "checkbox" },
      ],
    },
    {
      id: 5,
      title: "کیف پول",
      image: "/images/wallet.png",
      basePrice: 30000,
      category: "کیف",
      options: [
        { key: "clean", label: "تمیزکاری", price: 5000, type: "checkbox" },
      ],
    },
    {
      id: 6,
      title: "کیف زنانه",
      image: "/images/women-bag.png",
      basePrice: 50000,
      category: "کیف",
      options: [
        { key: "clean", label: "تمیزکاری", price: 10000, type: "checkbox" },
      ],
    },
    {
      id: 7,
      title: "صندل",
      image: "/images/sandal.png",
      basePrice: 35000,
      category: "کفش",
      options: [
        { key: "clean", label: "تمیزکاری", price: 8000, type: "checkbox" },
      ],
    },
    {
      id: 8,
      title: "ساک",
      image: "/images/travel-bag.png",
      basePrice: 60000,
      category: "کیف",
      options: [
        { key: "clean", label: "تمیزکاری", price: 12000, type: "checkbox" },
      ],
    },
    {
      id: 9,
      title: "چمدان",
      image: "/images/suitcase.png",
      basePrice: 80000,
      category: "کیف",
      options: [
        { key: "clean", label: "تمیزکاری", price: 15000, type: "checkbox" },
      ],
    },
    {
      id: 10,
      title: "چکمه",
      image: "/images/boots-tall.png",
      basePrice: 70000,
      category: "کفش",
      options: [
        { key: "clean", label: "تمیزکاری", price: 15000, type: "checkbox" },
        { key: "polish", label: "واکس", price: 10000, type: "checkbox" },
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
