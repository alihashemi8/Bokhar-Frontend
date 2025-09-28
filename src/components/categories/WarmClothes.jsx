import React from "react";
import Card from "../Card";

export default function WarmClothes() {
  const cards = [
    {
      id: 1,
      title: "کاپشن",
      image: "/images/jacket.png",
      basePrice: 40000,
      category: "لباس گرم",
      options: [
        { key: "wash", label: "شستشو", price: 10000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 15000, type: "checkbox" },
      ],
    },
    {
      id: 2,
      title: "لباس بارانی",
      image: "/images/raincoat.png",
      basePrice: 50000,
      category: "لباس گرم",
      options: [
        { key: "wash", label: "شستشو", price: 12000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 18000, type: "checkbox" },
      ],
    },
    {
      id: 3,
      title: "پلیور",
      image: "/images/sweater.png",
      basePrice: 35000,
      category: "لباس گرم",
      options: [
        { key: "wash", label: "شستشو ملایم", price: 8000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 5000, type: "checkbox" },
      ],
    },
    {
      id: 4,
      title: "سوییشرت",
      image: "/images/hoodie.png",
      basePrice: 38000,
      category: "لباس گرم",
      options: [
        { key: "wash", label: "شستشو", price: 9000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 5000, type: "checkbox" },
      ],
    },
    {
      id: 5,
      title: "هودی",
      image: "/images/hoodie.png",
      basePrice: 40000,
      category: "لباس گرم",
      options: [
        { key: "wash", label: "شستشو", price: 10000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 15000, type: "checkbox" },
      ],
    },
    {
      id: 6,
      title: "دورس",
      image: "/images/sweatshirt.png",
      basePrice: 30000,
      category: "لباس گرم",
      options: [
        { key: "wash", label: "شستشو ملایم", price: 7000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 4000, type: "checkbox" },
      ],
    },
    {
      id: 7,
      title: "اورکت",
      image: "/images/overcoat.png",
      basePrice: 60000,
      category: "لباس گرم",
      options: [
        { key: "wash", label: "شستشو", price: 12000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 20000, type: "checkbox" },
      ],
    },
    {
      id: 8,
      title: "بافت",
      image: "/images/knit.png",
      basePrice: 35000,
      category: "لباس گرم",
      options: [
        { key: "wash", label: "شستشو ملایم", price: 8000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 5000, type: "checkbox" },
      ],
    },
    {
      id: 9,
      title: "جکت",
      image: "/images/jacket.png",
      basePrice: 40000,
      category: "لباس گرم",
      options: [
        { key: "wash", label: "شستشو", price: 10000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 15000, type: "checkbox" },
      ],
    },
    {
      id: 10,
      title: "شال گردن",
      image: "/images/scarf.png",
      basePrice: 15000,
      category: "لباس گرم",
      options: [
        { key: "wash", label: "شستشو", price: 5000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
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
