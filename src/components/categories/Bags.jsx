import Card from "../Card";

const bagsData = [
  {
    id: 1,
    image: "/images/shoes.png",
    title: "کفش",
    basePrice: 25000,
    category: "کفش و کیف",
    options: [
      { key: "wash", label: "شستشو", price: 10000, type: "checkbox" },
      { key: "polish", label: "واکس", price: 7000, type: "checkbox" },
      {
        key: "material",
        label: "جنس",
        type: "select",
        choices: [
          { value: "leather", label: "چرم", price: 5000 },
          { value: "fabric", label: "پارچه‌ای", price: 0 },
        ],
      },
    ],
  },
  {
    id: 2,
    image: "/images/sneakers.png",
    title: "کتونی",
    basePrice: 28000,
    category: "کفش و کیف",
    options: [
      { key: "wash", label: "شستشو", price: 10000, type: "checkbox" },
      { key: "deodorize", label: "ضدعفونی و بوگیری", price: 8000, type: "checkbox" },
      {
        key: "size",
        label: "سایز",
        type: "select",
        choices: [
          { value: "36-40", label: "36-40", price: 0 },
          { value: "41-44", label: "41-44", price: 5000 },
        ],
      },
    ],
  },
  {
    id: 3,
    image: "/images/bag.png",
    title: "کیف",
    basePrice: 20000,
    category: "کفش و کیف",
    options: [
      { key: "clean", label: "تمیزکاری سطحی", price: 5000, type: "checkbox" },
      { key: "stain", label: "لکه‌گیری", price: 10000, type: "checkbox" },
    ],
  },
  {
    id: 4,
    image: "/images/backpack.png",
    title: "کوله پشتی",
    basePrice: 30000,
    category: "کفش و کیف",
    options: [
      { key: "wash", label: "شستشو کامل", price: 12000, type: "checkbox" },
      { key: "zipper", label: "بررسی و تعمیر زیپ", price: 15000, type: "checkbox" },
    ],
  },
  {
    id: 5,
    image: "/images/boots.png",
    title: "بوت",
    basePrice: 35000,
    category: "کفش و کیف",
    options: [
      { key: "wash", label: "شستشو", price: 10000, type: "checkbox" },
      { key: "polish", label: "واکس", price: 8000, type: "checkbox" },
      { key: "waterproof", label: "ضدآب کردن", price: 12000, type: "checkbox" },
    ],
  },
  {
    id: 6,
    image: "/images/wallet.png",
    title: "کیف پول",
    basePrice: 15000,
    category: "کفش و کیف",
    options: [
      { key: "clean", label: "تمیزکاری سطحی", price: 3000, type: "checkbox" },
    ],
  },
  {
    id: 7,
    image: "/images/women-bag.png",
    title: "کیف زنانه",
    basePrice: 25000,
    category: "کفش و کیف",
    options: [
      { key: "clean", label: "تمیزکاری", price: 7000, type: "checkbox" },
      { key: "stain", label: "لکه‌گیری", price: 12000, type: "checkbox" },
    ],
  },
  {
    id: 8,
    image: "/images/sandal.png",
    title: "صندل",
    basePrice: 22000,
    category: "کفش و کیف",
    options: [
      { key: "wash", label: "شستشو", price: 8000, type: "checkbox" },
      { key: "repair", label: "تعمیر بند", price: 10000, type: "checkbox" },
    ],
  },
  {
    id: 9,
    image: "/images/travel-bag.png",
    title: "ساک",
    basePrice: 30000,
    category: "کفش و کیف",
    options: [
      { key: "wash", label: "شستشو کامل", price: 15000, type: "checkbox" },
    ],
  },
  {
    id: 10,
    image: "/images/suitcase.png",
    title: "چمدان",
    basePrice: 50000,
    category: "کفش و کیف",
    options: [
      { key: "clean", label: "تمیزکاری سطحی", price: 10000, type: "checkbox" },
      { key: "wheel", label: "بررسی چرخ‌ها", price: 20000, type: "checkbox" },
    ],
  },
  {
    id: 11,
    image: "/images/long-boots.png",
    title: "چکمه",
    basePrice: 40000,
    category: "کفش و کیف",
    options: [
      { key: "wash", label: "شستشو", price: 12000, type: "checkbox" },
      { key: "polish", label: "واکس", price: 10000, type: "checkbox" },
      { key: "waterproof", label: "ضدآب کردن", price: 15000, type: "checkbox" },
    ],
  },
];

export default function Bags() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bagsData.map((item) => (
        <Card key={item.id} {...item} />
      ))}
    </div>
  );
}
