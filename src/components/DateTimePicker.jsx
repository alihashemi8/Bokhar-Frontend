// DateTimeRangePicker.jsx
import { useState, useRef, useEffect } from "react";
import jalaali from "jalaali-js";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function DateTimeRangePicker({ onChange }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [delivery, setDelivery] = useState({ date: null, times: [] });
  const [pickup, setPickup] = useState({ date: null, times: [] });

  const times = [];
  for (let hour = 8; hour <= 20; hour += 2) {
    times.push({ start: hour, end: hour + 2 });
  }

  const getWeekDays = (startDate) => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      if (d >= today) days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeekStart);

  const handlePrevWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    const today = new Date();
    if (newStart < today) newStart.setTime(today.getTime());
    setCurrentWeekStart(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const formatJalali = (date) => {
    const j = jalaali.toJalaali(date);
    return `${j.jy}/${j.jm.toString().padStart(2,"0")}/${j.jd.toString().padStart(2,"0")}`;
  };

  const toggleDeliveryTime = (startHour) => {
    const newTimes = delivery.times.includes(startHour)
      ? delivery.times.filter(h => h !== startHour)
      : [...delivery.times, startHour];
    const newDelivery = { ...delivery, times: newTimes };
    setDelivery(newDelivery);

    // اگر pickup قبل از delivery بود، ریست شود
    if (pickup.date && pickup.date < newDelivery.date) {
      setPickup({ date: null, times: [] });
    }

    onChange && onChange({ delivery: newDelivery, pickup });
  };

  const togglePickupTime = (startHour) => {
    const newTimes = pickup.times.includes(startHour)
      ? pickup.times.filter(h => h !== startHour)
      : [...pickup.times, startHour];
    const newPickup = { ...pickup, times: newTimes };
    setPickup(newPickup);
    onChange && onChange({ delivery, pickup: newPickup });
  };

  // فیلتر روزهای pickup
  const filteredPickupDays = weekDays.filter(d => !delivery.date || d >= delivery.date);

  // فیلتر زمان‌های pickup با حداقل فاصله 6 ساعت و حداکثر 20
  const filteredPickupTimes = times.filter(({ start }) => {
    if (!delivery.times.length) return true;
    const minStart = Math.min(...delivery.times) + 6; // فاصله حداقل 6 ساعت
    return start >= minStart && start <= 18;
  });

  // ری‌یوژر smooth-scroll
  const scrollRefDelivery = useRef(null);
  const scrollRefPickup = useRef(null);

  useEffect(() => {
    const refs = [scrollRefDelivery.current, scrollRefPickup.current];
    refs.forEach(ref => {
      if (!ref) return;
      let isDown = false;
      let startX;
      let scrollLeft;

      const mouseDown = (e) => {
        isDown = true;
        startX = e.pageX - ref.offsetLeft;
        scrollLeft = ref.scrollLeft;
      };
      const mouseLeave = () => isDown = false;
      const mouseUp = () => isDown = false;
      const mouseMove = (e) => {
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - ref.offsetLeft;
        const walk = (x - startX) * 2;
        ref.scrollLeft = scrollLeft - walk;
      };

      ref.addEventListener('mousedown', mouseDown);
      ref.addEventListener('mouseleave', mouseLeave);
      ref.addEventListener('mouseup', mouseUp);
      ref.addEventListener('mousemove', mouseMove);

      return () => {
        ref.removeEventListener('mousedown', mouseDown);
        ref.removeEventListener('mouseleave', mouseLeave);
        ref.removeEventListener('mouseup', mouseUp);
        ref.removeEventListener('mousemove', mouseMove);
      };
    });
  }, []);

  const timeButtonClasses = (selected) =>
    `flex-none px-3 py-1 rounded border ${
      selected
        ? "bg-blue-500 text-white"
        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
    }`;

  return (
    <div className="flex flex-col gap-6">
      {/* هفته */}
      <div className="flex items-center justify-between mb-2 gap-2">
        <button
          onClick={handlePrevWeek}
          className="flex items-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          <ArrowRightIcon className="w-5 h-5" />
          هفته قبل
        </button>
        <span className="font-medium text-center">
          هفته {formatJalali(weekDays[0])} تا {formatJalali(weekDays[weekDays.length-1])}
        </span>
        <button
          onClick={handleNextWeek}
          className="flex items-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          هفته بعد
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
      </div>

      {/* تحویل دادن */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg text-center font-bold">زمان تحویل دادن</h2>
        <div
          ref={scrollRefDelivery}
          className="flex gap-2 overflow-x-auto cursor-grab sm:justify-center sm:flex-wrap"
        >
          {weekDays.map(d => (
            <button
              key={d.toDateString()}
              onClick={() => setDelivery({ ...delivery, date: d })}
              className={`flex-none px-3 py-1 rounded border text-center text-sm sm:text-base whitespace-nowrap ${
                delivery.date?.toDateString() === d.toDateString()
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              }`}
            >
              {d.toLocaleDateString("fa-IR", { weekday: "short" })}<br/>
              {formatJalali(d)}
            </button>
          ))}
        </div>
        <div
          ref={scrollRefDelivery}
          className="flex gap-2 overflow-x-auto cursor-grab sm:justify-center sm:flex-wrap"
        >
          {times.map(({ start, end }) => (
            <button
              key={start}
              onClick={() => toggleDeliveryTime(start)}
              className={timeButtonClasses(delivery.times.includes(start))}
            >
              {start}-{end}
            </button>
          ))}
        </div>
      </div>

      {/* تحویل گرفتن */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg text-center font-bold">زمان تحویل گرفتن</h2>
        <div
          ref={scrollRefPickup}
          className="flex gap-2 overflow-x-auto cursor-grab sm:justify-center sm:flex-wrap"
        >
          {filteredPickupDays.map(d => (
            <button
              key={d.toDateString()}
              onClick={() => setPickup({ ...pickup, date: d })}
              className={`flex-none px-3 py-1 rounded border text-center text-sm sm:text-base whitespace-nowrap ${
                pickup.date?.toDateString() === d.toDateString()
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              }`}
            >
              {d.toLocaleDateString("fa-IR", { weekday: "short" })}<br/>
              {formatJalali(d)}
            </button>
          ))}
        </div>
        <div
          ref={scrollRefPickup}
          className="flex gap-2 overflow-x-auto cursor-grab sm:justify-center sm:flex-wrap"
        >
          {filteredPickupTimes.map(({ start, end }) => (
            <button
              key={start}
              onClick={() => togglePickupTime(start)}
              className={timeButtonClasses(pickup.times.includes(start))}
            >
              {start}-{end}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
