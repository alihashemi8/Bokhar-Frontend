import React, { useState, useEffect } from "react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimeSelector from "./TimeSelector";
import ModalPicker from "./ModalPicker";

export default function DateTimeRangePicker({
  value,
  onChange,
  onComplete,
  onGoLocation,
}) {
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [pickupDate, setPickupDate] = useState(null);
  const [pickupTime, setPickupTime] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  /* ---------- init ---------- */
  useEffect(() => {
    if (!value) return;
    try {
      if (value.delivery?.date)
        setDeliveryDate(
          new DateObject({
            date: value.delivery.date,
            calendar: persian,
            locale: persian_fa,
          })
        );
      if (value.pickup?.date)
        setPickupDate(
          new DateObject({
            date: value.pickup.date,
            calendar: persian,
            locale: persian_fa,
          })
        );
      if (value.delivery?.time) setDeliveryTime(value.delivery.time);
      if (value.pickup?.time) setPickupTime(value.pickup.time);
    } catch (e) {
      console.warn("❌ خطا در مقداردهی اولیه:", e);
    }
  }, [value]);

  /* ---------- pickup min date ---------- */
  const pickupMinDate = deliveryDate
    ? new DateObject(deliveryDate).add(2, "days")
    : null;

  /* ---------- sync ---------- */
  const triggerOnChange = (state = {}) => {
    if (!onChange) return;

    const dDate = state.deliveryDate ?? deliveryDate;
    const pDate = state.pickupDate ?? pickupDate;

    onChange({
      delivery: {
        date: dDate ? new DateObject(dDate).format("YYYY-MM-DD") : null,
        time: state.deliveryTime ?? deliveryTime ?? null,
      },
      pickup: {
        date: pDate ? new DateObject(pDate).format("YYYY-MM-DD") : null,
        time: state.pickupTime ?? pickupTime ?? null,
      },
    });
  };

  /* ---------- handlers ---------- */
  const handleDeliveryDateChange = (date) => {
    setDeliveryDate(date);
    triggerOnChange({ deliveryDate: date });

    if (pickupDate) {
      const min = new DateObject(date).add(2, "days");
      if (pickupDate.toJulianDay() < min.toJulianDay()) {
        setPickupDate(null);
        setPickupTime(null);
      }
    }
  };

  const handleDeliveryTimeChange = (time) => {
    setDeliveryTime(time);
    triggerOnChange({ deliveryTime: time });
  };

  const handlePickupDateChange = (date) => {
    setPickupDate(date);
    triggerOnChange({ pickupDate: date });
  };

  const handlePickupTimeChange = (time) => {
    setPickupTime(time);
    triggerOnChange({ pickupTime: time });
  };

  const handleConfirm = (type) => {
    if (type === "delivery") setActiveModal("pickup");
    else {
      setActiveModal(null);
      onComplete?.();
    }
  };

  const formatSafe = (date) => {
    if (!date) return "";
    try {
      return date.format("dddd DD MMMM");
    } catch {
      return "";
    }
  };

  const isComplete =
    deliveryDate && deliveryTime && pickupDate && pickupTime;

  return (
    <div
      dir="rtl"
      className="
        w-full max-w-4xl mx-auto rounded-2xl p-6 shadow-md border
        bg-gradient-to-br
        from-sky-50 via-sky-100 to-sky-200
        dark:from-sky-800 dark:via-sky-900 dark:to-sky-950
        border-sky-300 dark:border-sky-700
        text-gray-900 dark:text-gray-100
      "
    >
      <h2 className="text-xl font-semibold text-center mb-6">
        انتخاب بازه زمانی
      </h2>

      {/* ---------- desktop ---------- */}
      <div className="hidden md:block space-y-10">
        <section>
          <h3 className="mb-2 font-semibold">📦 تحویل دادن</h3>
          <TimeSelector
            selectedDate={deliveryDate}
            setSelectedDate={handleDeliveryDateChange}
            selectedTime={deliveryTime}
            setSelectedTime={handleDeliveryTimeChange}
          />
        </section>

        <section>
          <h3 className="mb-2 font-semibold">🕒 تحویل گرفتن</h3>
          <TimeSelector
            selectedDate={pickupDate}
            setSelectedDate={handlePickupDateChange}
            selectedTime={pickupTime}
            setSelectedTime={handlePickupTimeChange}
            minDate={pickupMinDate}
          />
        </section>

        <button
          disabled={!isComplete}
          onClick={() => onGoLocation?.()}
          className={`
            mx-auto block px-6 py-3 rounded-xl mt-6 font-bold transition-all
            ${
              isComplete
                ? `
                  bg-gradient-to-r
                  from-sky-100 to-sky-200
                  dark:from-purple-700 dark:to-purple-800
                  text-gray-800 dark:text-white/90
                  shadow-md shadow-indigo-300
                `
                : `
                  bg-gray-300 dark:bg-gray-700
                  text-gray-500 dark:text-gray-400
                  cursor-not-allowed
                `
            }
          `}
        >
          انتخاب موقعیت مکانی
        </button>
      </div>

      {/* ---------- mobile ---------- */}
      <div className="md:hidden">
        <button
          onClick={() => setActiveModal("delivery")}
          className="
            w-full py-3 rounded-xl font-bold transition-all
            bg-gradient-to-r
            from-sky-100 to-sky-200
            dark:from-purple-700 dark:to-purple-800
            text-gray-800 dark:text-white/90
            shadow-md shadow-indigo-300
          "
        >
          انتخاب زمان تحویل و دریافت
        </button>
      </div>

      {/* ---------- modals ---------- */}
      {activeModal === "delivery" && (
        <ModalPicker
          type="delivery"
          onClose={() => setActiveModal(null)}
          onConfirm={handleConfirm}
          selectedDate={deliveryDate}
          setSelectedDate={handleDeliveryDateChange}
          selectedTime={deliveryTime}
          setSelectedTime={handleDeliveryTimeChange}
        />
      )}

      {activeModal === "pickup" && (
        <ModalPicker
          type="pickup"
          onClose={() => setActiveModal(null)}
          onConfirm={handleConfirm}
          selectedDate={pickupDate}
          setSelectedDate={handlePickupDateChange}
          selectedTime={pickupTime}
          setSelectedTime={handlePickupTimeChange}
          minDate={pickupMinDate}
        />
      )}

      {/* ---------- preview ---------- */}
      {(deliveryDate || pickupDate) && (
        <div className="mt-6 text-center space-y-2 text-sm">
          {deliveryDate && deliveryTime && (
            <p>📦 {formatSafe(deliveryDate)} – {deliveryTime}</p>
          )}
          {pickupDate && pickupTime && (
            <p>🕒 {formatSafe(pickupDate)} – {pickupTime}</p>
          )}
        </div>
      )}
    </div>
  );
}
