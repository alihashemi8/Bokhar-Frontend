import React from "react";
import Card from "../Card";

export default function Sports() {
  const cards = [
    {
      id: 1,
      title: "ست ورزشی",
      image: "/images/sports.png",
      basePrice: 35000,
      category: "ورزشی",
      options: [
        { key: "wash", label: "شستشو", price: 10000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 15000, type: "checkbox" },
      ],
    },
    {
      id: 2,
      title: "کاپشن اسکی",
      image: "/images/ski-jacket.png",
      basePrice: 70000,
      category: "ورزشی",
      options: [
        { key: "wash", label: "شستشو تخصصی", price: 20000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 30000, type: "checkbox" },
      ],
    },
    {
      id: 3,
      title: "شلوار اسکی",
      image: "/images/ski-pants.png",
      basePrice: 50000,
      category: "ورزشی",
      options: [
        { key: "wash", label: "شستشو تخصصی", price: 15000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 25000, type: "checkbox" },
      ],
    },
    {
      id: 4,
      title: "دستکش بوکس",
      image: "/images/boxing-gloves.png",
      basePrice: 30000,
      category: "ورزشی",
      options: [{ key: "wash", label: "شستشو", price: 8000, type: "checkbox" }],
    },
    {
      id: 5,
      title: "دستکش دروازبانی",
      image: "/images/goalkeeper-gloves.png",
      basePrice: 25000,
      category: "ورزشی",
      options: [{ key: "wash", label: "شستشو", price: 7000, type: "checkbox" }],
    },
    {
      id: 6,
      title: "کیسه خواب",
      image: "/images/sleeping-bag.png",
      basePrice: 40000,
      category: "ورزشی",
      options: [
        { key: "wash", label: "شستشو کامل", price: 15000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 20000, type: "checkbox" },
      ],
    },
    {
      id: 7,
      title: "مایو",
      image: "/images/swimsuit.png",
      basePrice: 20000,
      category: "ورزشی",
      options: [
        { key: "wash", label: "شستشو ملایم", price: 5000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 10000, type: "checkbox" },
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
