import Card from "../Card";

const womenData = [
  {
    id: 1,
    image: "/images/scarf.png",
    title: "شال",
    basePrice: 15000,
    category: "زنانه",
    options: ["شستشو", "اتو", "خشکشویی"],
  },
  {
    id: 2,
    image: "/images/women-dress.png",
    title: "لباس زنانه",
    basePrice: 30000,
    category: "زنانه",
    options: ["شستشو", "اتو", "خشکشویی"],
  },
  {
    id: 3,
    image: "/images/manto.png",
    title: "مانتو",
    basePrice: 35000,
    category: "زنانه",
    options: ["خشکشویی", "اتو", "لکه‌گیری"],
  },
  {
    id: 4,
    image: "/images/coat.png",
    title: "پالتو",
    basePrice: 45000,
    category: "زنانه",
    options: ["خشکشویی", "اتو", "لکه‌گیری"],
  },
  {
    id: 5,
    image: "/images/tanktop.png",
    title: "تاپ زنانه",
    basePrice: 20000,
    category: "زنانه",
    options: ["شستشو", "اتو"],
  },
  {
    id: 6,
    image: "/images/fall-manto.png",
    title: "مانتو پاییزی",
    basePrice: 40000,
    category: "زنانه",
    options: ["خشکشویی", "اتو", "لکه‌گیری"],
  },
  {
    id: 7,
    image: "/images/chador.png",
    title: "چادر",
    basePrice: 25000,
    category: "زنانه",
    options: ["شستشو", "اتو"],
  },
  {
    id: 8,
    image: "/images/skirt.png",
    title: "دامن",
    basePrice: 22000,
    category: "زنانه",
    options: ["شستشو", "اتو"],
  },
  {
    id: 9,
    image: "/images/evening-dress.png",
    title: "لباس شب",
    basePrice: 60000,
    category: "زنانه",
    options: ["خشکشویی ویژه", "اتو", "لکه‌گیری"],
  },
  {
    id: 10,
    image: "/images/headscarf.png",
    title: "روسری",
    basePrice: 15000,
    category: "زنانه",
    options: ["شستشو", "اتو"],
  },
  {
    id: 11,
    image: "/images/blouse.png",
    title: "بلوز",
    basePrice: 25000,
    category: "زنانه",
    options: ["شستشو", "اتو", "خشکشویی"],
  },
  {
    id: 12,
    image: "/images/overall.png",
    title: "اورال",
    basePrice: 40000,
    category: "زنانه",
    options: ["خشکشویی", "اتو"],
  },
  {
    id: 13,
    image: "/images/sarafan.png",
    title: "سارافون",
    basePrice: 30000,
    category: "زنانه",
    options: ["شستشو", "اتو", "خشکشویی"],
  },
  {
    id: 14,
    image: "/images/long-skirt.png",
    title: "دامن بلند",
    basePrice: 28000,
    category: "زنانه",
    options: ["شستشو", "اتو"],
  },
  {
    id: 15,
    image: "/images/plisse.png",
    title: "دامن پلیسه",
    basePrice: 32000,
    category: "زنانه",
    options: ["شستشو ویژه", "اتو", "خشکشویی"],
  },
  {
    id: 16,
    image: "/images/wedding-dress.png",
    title: "لباس عروس",
    basePrice: 120000,
    category: "زنانه",
    options: ["خشکشویی ویژه", "اتو دستی", "بسته‌بندی"],
  },
  {
    id: 17,
    image: "/images/tights.png",
    title: "جوراب شلواری",
    basePrice: 10000,
    category: "زنانه",
    options: ["شستشو ملایم", "خشکشویی"],
  },
];

export default function Women() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {womenData.map((item) => (
        <Card key={item.id} {...item} />
      ))}
    </div>
  );
}
