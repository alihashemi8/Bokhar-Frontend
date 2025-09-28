import React from "react";
import Card from "../Card";

export default function HomeAndBed() {
  const cards = [
    {
      id: 1,
      title: "لحاف",
      image: "/images/quilt.png",
      basePrice: 50000,
      category: "خانه و خواب",
      options: [
        { key: "wash", label: "شستشو", price: 10000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 15000, type: "checkbox" },
      ],
    },
    {
      id: 2,
      title: "پتو",
      image: "/images/blanket.png",
      basePrice: 30000,
      category: "خانه و خواب",
      options: [
        { key: "wash", label: "شستشو", price: 8000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 12000, type: "checkbox" },
      ],
    },
    {
      id: 3,
      title: "پتو مسافرتی",
      image: "/images/travel-blanket.png",
      basePrice: 40000,
      category: "خانه و خواب",
      options: [
        { key: "wash", label: "شستشو", price: 8000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 12000, type: "checkbox" },
      ],
    },
    {
      id: 4,
      title: "حوله",
      image: "/images/towel.png",
      basePrice: 15000,
      category: "خانه و خواب",
      options: [{ key: "wash", label: "شستشو", price: 5000, type: "checkbox" }],
    },
    {
      id: 5,
      title: "روفرشی",
      image: "/images/cover.png",
      basePrice: 20000,
      category: "خانه و خواب",
      options: [
        { key: "wash", label: "شستشو", price: 7000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
      ],
    },
    {
      id: 6,
      title: "روبالشی",
      image: "/images/pillowcase.png",
      basePrice: 10000,
      category: "خانه و خواب",
      options: [{ key: "wash", label: "شستشو", price: 5000, type: "checkbox" }],
    },
    {
      id: 7,
      title: "بالشت",
      image: "/images/pillow.png",
      basePrice: 25000,
      category: "خانه و خواب",
      options: [
        { key: "wash", label: "شستشو", price: 8000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 12000, type: "checkbox" },
      ],
    },
    {
      id: 8,
      title: "حوله تن پوش",
      image: "/images/robe-towel.png",
      basePrice: 30000,
      category: "خانه و خواب",
      options: [
        { key: "wash", label: "شستشو", price: 8000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
      ],
    },
    {
      id: 9,
      title: "کاور لحاف",
      image: "/images/quilt-cover.png",
      basePrice: 20000,
      category: "خانه و خواب",
      options: [{ key: "wash", label: "شستشو", price: 7000, type: "checkbox" }],
    },
    {
      id: 10,
      title: "کاور تشک",
      image: "/images/mattress-cover.png",
      basePrice: 25000,
      category: "خانه و خواب",
      options: [{ key: "wash", label: "شستشو", price: 7000, type: "checkbox" }],
    },
    {
      id: 11,
      title: "رو مبلی",
      image: "/images/sofa-cover.png",
      basePrice: 30000,
      category: "خانه و خواب",
      options: [
        { key: "wash", label: "شستشو", price: 8000, type: "checkbox" },
        { key: "iron", label: "اتو", price: 3000, type: "checkbox" },
      ],
    },
    {
      id: 12,
      title: "روتختی",
      image: "/images/bed-cover.png",
      basePrice: 40000,
      category: "خانه و خواب",
      options: [
        { key: "wash", label: "شستشو", price: 10000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 15000, type: "checkbox" },
      ],
    },
    {
      id: 13,
      title: "پرده زبرا",
      image: "/images/zebra-curtain.png",
      basePrice: 35000,
      category: "خانه و خواب",
      options: [
        { key: "wash", label: "شستشو", price: 10000, type: "checkbox" },
      ],
    },
    {
      id: 14,
      title: "کوسن",
      image: "/images/cushion.png",
      basePrice: 15000,
      category: "خانه و خواب",
      options: [{ key: "wash", label: "شستشو", price: 5000, type: "checkbox" }],
    },
    {
      id: 15,
      title: "رو میز",
      image: "/images/table-cover.png",
      basePrice: 10000,
      category: "خانه و خواب",
      options: [{ key: "wash", label: "شستشو", price: 5000, type: "checkbox" }],
    },
    {
      id: 16,
      title: "سفره",
      image: "/images/tablecloth.png",
      basePrice: 12000,
      category: "خانه و خواب",
      options: [{ key: "wash", label: "شستشو", price: 5000, type: "checkbox" }],
    },
    {
      id: 17,
      title: "زیر سفره",
      image: "/images/table-mat.png",
      basePrice: 8000,
      category: "خانه و خواب",
      options: [{ key: "wash", label: "شستشو", price: 3000, type: "checkbox" }],
    },
    {
      id: 18,
      title: "بالشت پشت گردنی",
      image: "/images/neck-pillow.png",
      basePrice: 15000,
      category: "خانه و خواب",
      options: [{ key: "wash", label: "شستشو", price: 5000, type: "checkbox" }],
    },
    {
      id: 19,
      title: "سرویس آشپزخانه",
      image: "/images/kitchen-set.png",
      basePrice: 60000,
      category: "خانه و خواب",
      options: [
        { key: "wash", label: "شستشو", price: 10000, type: "checkbox" },
        { key: "dry", label: "خشکشویی", price: 15000, type: "checkbox" },
      ],
    },
    {
      id: 20,
      title: "کفش",
      image: "/images/shoes.png",
      basePrice: 40000,
      category: "خانه و خواب",
      options: [
        { key: "clean", label: "تمیزکاری", price: 15000, type: "checkbox" },
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
