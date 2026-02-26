import { motion, useScroll, useTransform } from "framer-motion";
import bubble7 from "../assets/bubble7.png";
import bubble11 from "../assets/bubble11.png";
import bubble12 from "../assets/bubble12.png";
import bubble13 from "../assets/bubble13.png";
import bubble14 from "../assets/bubble14.png";
import bubble15 from "../assets/bubble15.png";
import iron1 from "../assets/iron1.png";
import iron2 from "../assets/iron2.png";
import Group from "../assets/Group.png";
export default function Landing() {
  const { scrollY } = useScroll();

  const bubbles = [
    {
      img: bubble11,
      y: useTransform(scrollY, [0, 800], [0, 250]),
      x: useTransform(scrollY, [0, 800], [-200, -50]),
      rotate: useTransform(scrollY, [0, 800], [0, 180]),
      className: "top-10 right-10 w-16 sm:w-20 md:w-24 opacity-70",
    },
    {
      img: bubble12,
      y: useTransform(scrollY, [0, 800], [0, -200]),
      x: useTransform(scrollY, [0, 800], [50, 150]),
      rotate: useTransform(scrollY, [0, 800], [0, -220]),
      className: "bottom-20 left-10 sm:left-20 w-20 sm:w-24 md:w-28 opacity-60",
    },
    {
      img: bubble13,
      y: useTransform(scrollY, [0, 800], [0, 200]),
      x: useTransform(scrollY, [0, 800], [0, 220]),
      rotate: useTransform(scrollY, [0, 800], [0, 300]),
      className: "top-1/3 left-10 sm:left-1/4 w-16 sm:w-20 md:w-24 opacity-50",
    },
    {
      img: bubble14,
      y: useTransform(scrollY, [0, 800], [0, -180]),
      x: useTransform(scrollY, [0, 800], [-150, 100]),
      rotate: useTransform(scrollY, [0, 800], [0, 260]),
      className: "top-40 right-10 sm:right-1/3 w-14 sm:w-16 md:w-20 opacity-40",
    },
    {
      img: bubble15,
      y: useTransform(scrollY, [0, 800], [0, 300]),
      x: useTransform(scrollY, [0, 800], [150, -100]),
      rotate: useTransform(scrollY, [0, 800], [0, -300]),
      className:
        "bottom-10 right-10 sm:right-1/4 w-20 sm:w-28 md:w-32 opacity-50",
    },
    {
      img: bubble7,
      y: useTransform(scrollY, [0, 800], [0, 350]),
      x: useTransform(scrollY, [0, 800], [100, -50]),
      rotate: useTransform(scrollY, [0, 800], [0, 200]),
      className:
        "bottom-20 left-20 sm:left-1/3 w-20 sm:w-28 md:w-32 opacity-50",
    },
    {
      img: bubble11,
      y: useTransform(scrollY, [0, 800], [0, -250]),
      x: useTransform(scrollY, [0, 800], [-100, 50]),
      rotate: useTransform(scrollY, [0, 800], [0, 150]),
      className: "top-20 left-5 sm:left-1/4 w-16 sm:w-20 md:w-24 opacity-60",
    },
    {
      img: bubble12,
      y: useTransform(scrollY, [0, 800], [0, 300]),
      x: useTransform(scrollY, [0, 800], [120, -150]),
      rotate: useTransform(scrollY, [0, 800], [0, -180]),
      className:
        "bottom-10 right-10 sm:right-1/3 w-20 sm:w-24 md:w-28 opacity-55",
    },
    {
      img: bubble13,
      y: useTransform(scrollY, [0, 800], [0, 200]),
      x: useTransform(scrollY, [0, 800], [-80, 180]),
      rotate: useTransform(scrollY, [0, 800], [0, 270]),
      className: "top-1/2 left-30 sm:left-1/2 w-16 sm:w-20 md:w-24 opacity-50",
    },
    {
      img: bubble14,
      y: useTransform(scrollY, [0, 800], [0, -150]),
      x: useTransform(scrollY, [0, 800], [200, -100]),
      rotate: useTransform(scrollY, [0, 800], [0, 320]),
      className:
        "bottom-1/4 left-5 sm:left-1/4 w-14 sm:w-16 md:w-20 opacity-40",
    },
  ];

  return (
    <div className="relative min-h-[200vh] bg-gradient-to-br from-pink-50 to-blue-500 overflow-hidden">
      {/* حباب‌ها */}
      {bubbles.map((bubble, index) => (
        <motion.img
          key={index}
          src={bubble.img}
          style={{ y: bubble.y, x: bubble.x, rotate: bubble.rotate }}
          className={`absolute pointer-events-none ${bubble.className}`}
          alt=""
        />
      ))}

      <div className="flex items-start justify-between px-4 sm:px-6 md:px-10 mt-0 flex-nowrap">
        {/* تصاویر سمت چپ */}
        <div className="flex gap-3 sm:gap-6 flex-shrink-0 z-50 mt-0">
          <img
            src={iron2}
            alt="iron"
            className="w-20 sm:w-28 md:w-36 lg:w-44 xl:w-52 h-[100%] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] max-w-full object-contain object-top"
          />
          <img
            src={iron1}
            alt="iron"
            className="w-20 sm:w-28 md:w-36 lg:w-44 xl:w-52 h-[100%] sm:h-[220px] md:h-[270px] lg:h-[320px] xl:h-[380px] max-w-full object-contain object-top"
          />
        </div>

        {/* هدر سمت راست */}
        <h1
          className="font-extrabold text-gray-800 mt-16 sm:mt-20 md:mt-24 md:mr-10 ml-4 z-10 flex-shrink whitespace-nowrap"
          style={{ fontSize: "clamp(1.3rem, 5vw, 3rem)" }}
        >
          خشکشویی افشار
        </h1>
      </div>

      {/* دکمه‌ها */}
      <div className="flex flex-col items-end gap-1 sm:gap-3 pr-6 sm:pr-10 md:pr-20 mt-5 sm:mt-0 relative z-10">
        <button className=" px-10 py-3 sm:px-14 sm:py-6 md:px-18 md:py-7 rounded-full bg-purple-50 text-[#202374] text-md sm:text-lg md:text-2xl font-semibold hover:bg-white transition duration-300 shadow-lg cursor-pointer">
          ثبت سفارش
        </button>

        <button className="px-8 py-3 sm:px-12 sm:py-5 md:px-16 md:py-6 rounded-full bg-[#D2D9ED] hover:bg-[#e5e8f0] text-[#6B7EB7] font-semibold border border-[#2949A9] transition duration-300 shadow-md">
          تماس با ما
        </button>
      </div>

    </div>
  );
}
