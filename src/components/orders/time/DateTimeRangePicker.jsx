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

  /* =======================
     مقداردهی اولیه
  ======================= */
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

  /* =======================
     ✅ کنترل Back موبایل
  ======================= */
  useEffect(() => {
    if (!activeModal) return;

    const handleBack = () => {
      setActiveModal(null);
    };

    // یک history جعلی اضافه می‌کنیم
    window.history.pushState({ modal: true }, "");
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [activeModal]);

  /* =======================
     min date پیک‌آپ
  ======================= */
  const pickupMinDate = deliveryDate
    ? new DateObject(deliveryDate).add(2, "days")
    : null;

  /* =======================
     sync با parent
  ======================= */
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

  /* =======================
     handlers
  ======================= */
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
    if (type === "delivery") {
      setActiveModal("pickup");
    } else {
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

  return (
    <div
      dir="rtl"
      className="w-full max-w-4xl mx-auto bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 rounded-2xl p-6 shadow-md border border-pink-200"
    >
      <h2 className="text-xl font-semibold text-center mb-6">
        انتخاب بازه زمانی
      </h2>

      {/* دسکتاپ */}
      <div className="hidden md:block space-y-10">
        <section>
          <h3 className="mb-2">📦 تحویل دادن</h3>
          <TimeSelector
            selectedDate={deliveryDate}
            setSelectedDate={handleDeliveryDateChange}
            selectedTime={deliveryTime}
            setSelectedTime={handleDeliveryTimeChange}
          />
        </section>

        <section>
          <h3 className="mb-2">🕒 تحویل گرفتن</h3>
          <TimeSelector
            selectedDate={pickupDate}
            setSelectedDate={handlePickupDateChange}
            selectedTime={pickupTime}
            setSelectedTime={handlePickupTimeChange}
            minDate={pickupMinDate}
          />
        </section>

        <button
          disabled={
            !(deliveryDate && deliveryTime && pickupDate && pickupTime)
          }
          onClick={() => onGoLocation?.()}
          className={`mx-auto block px-6 py-3 rounded-xl mt-6 ${
            deliveryDate && deliveryTime && pickupDate && pickupTime
              ? "bg-pink-500 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          انتخاب موقعیت مکانی
        </button>
      </div>

      {/* موبایل */}
      <div className="md:hidden">
        <button
          onClick={() => setActiveModal("delivery")}
          className="w-full bg-pink-500 text-white py-3 rounded-xl"
        >
          انتخاب زمان تحویل و دریافت
        </button>
      </div>

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

      {(deliveryDate || pickupDate) && (
        <div className="mt-6 text-center space-y-2 text-sm">
          {deliveryDate && deliveryTime && (
            <p>
              📦 {formatSafe(deliveryDate)} – {deliveryTime}
            </p>
          )}
          {pickupDate && pickupTime && (
            <p>
              🕒 {formatSafe(pickupDate)} – {pickupTime}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
