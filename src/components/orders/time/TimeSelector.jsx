import React, { useState, useEffect } from "react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function TimeSelector({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  minDate,
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const toDateObj = (date) =>
    date instanceof DateObject
      ? date
      : new DateObject({ date, calendar: persian, locale: persian_fa });

  const baseDate = minDate
    ? toDateObj(minDate)
    : new DateObject({ calendar: persian, locale: persian_fa });

  useEffect(() => {
    setWeekOffset(0);
  }, [minDate]);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(t);
  }, [weekOffset]);

  const days = Array.from({ length: 7 }, (_, i) =>
    new DateObject(baseDate).add(weekOffset * 7 + i, "days")
  );

  const minDateObj = minDate ? toDateObj(minDate) : null;

  const timeSlots = ["۹ تا ۱۳", "۱۳ تا ۱۷", "۱۷ تا ۲۳"];

  return (
    <div>
      {/* navigator */}
      <div className="flex justify-between items-center mb-3">
        <button
          disabled={weekOffset === 0}
          onClick={() => setWeekOffset((p) => Math.max(0, p - 1))}
          className="text-pink-500 disabled:text-gray-300"
        >
         →  هفته قبل
        </button>

        <span className="font-medium text-gray-700">
          هفته {weekOffset + 1}
        </span>

        <button
          onClick={() => setWeekOffset((p) => p + 1)}
          className="text-pink-500"
        >
          هفته بعد ←
        </button>
      </div>

      <div className="flex md:grid md:grid-cols-7 gap-1 overflow-x-auto scrollbar-hide">
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-24 w-20 bg-pink-100/60 animate-pulse rounded-xl flex-shrink-0"
              />
            ))
          : days.map((day, idx) => {
              const d = toDateObj(day);

              const isDisabled =
                minDateObj &&
                d.toJulianDay() < minDateObj.toJulianDay();

              const isSelected =
                selectedDate &&
                toDateObj(selectedDate).format("YYYY/MM/DD") ===
                  d.format("YYYY/MM/DD");

              return (
                <div
                  key={idx}
                  onClick={() => !isDisabled && setSelectedDate(d)}
                  className={`w-20 h-24 my-3 mx-0.5 rounded-2xl border flex flex-col justify-center text-center transition ${
                    isDisabled
                      ? "opacity-40 cursor-not-allowed"
                      : isSelected
                      ? "bg-pink-50 border-pink-600 shadow-md scale-105"
                      : "border-pink-400 hover:bg-pink-50 cursor-pointer"
                  }`}
                >
                  <p className="text-sm text-pink-500">
                    {d.weekDay.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {d.day}
                  </p>
                  <p className="text-xs text-gray-500">
                    {d.month.name}
                  </p>
                </div>
              );
            })}
      </div>

      {selectedDate && (
        <div className="mt-4 flex justify-center gap-3 flex-wrap">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedTime(slot)}
              className={`px-5 py-3 rounded-xl border transition ${
                selectedTime === slot
                  ? "bg-pink-500 text-white border-pink-600 scale-105"
                  : "bg-sky-50 border-pink-400 hover:bg-pink-100"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
