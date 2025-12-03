import React, { useState, useEffect, useCallback } from "react";
import TimeSelector from "./TimeSelector";
import ModalPicker from "./ModalPicker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function DateTimeRangePicker({ value, onChange }) {
  const [pickupDate, setPickupDate] = useState(null);
  const [pickupTime, setPickupTime] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  // 🟣 مقداردهی اولیه از props فقط یک‌بار هنگام mount
  useEffect(() => {
    if (!value) return;
    try {
      if (value.pickup?.date)
        setPickupDate(
          new DateObject({
            date: value.pickup.date,
            calendar: persian,
            locale: persian_fa,
          })
        );
      if (value.delivery?.date)
        setDeliveryDate(
          new DateObject({
            date: value.delivery.date,
            calendar: persian,
            locale: persian_fa,
          })
        );
      if (value.pickup?.times?.[0]) setPickupTime(value.pickup.times[0]);
      if (value.delivery?.times?.[0]) setDeliveryTime(value.delivery.times[0]);
    } catch (e) {
      console.warn("❌ خطا در مقداردهی اولیه تاریخ:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ فقط یک‌بار اجرا شود، نه در هر تغییر value

  // 🟣 ارسال تغییرات به والد (به صورت پایدار)
  const updateParent = useCallback(() => {
    if (!onChange) return;
    onChange({
      pickup: {
        date: pickupDate
          ? new DateObject(pickupDate).format("YYYY-MM-DD")
          : null,
        time: pickupTime || null,
      },
      delivery: {
        date: deliveryDate
          ? new DateObject(deliveryDate).format("YYYY-MM-DD")
          : null,
        time: deliveryTime || null,
      },
    });
  }, [pickupDate, pickupTime, deliveryDate, deliveryTime, onChange]);

  useEffect(() => {
    updateParent();
  }, [updateParent]);

  // 🟣 کنترل مودال‌ها
  const handleConfirm = (type) => {
    if (type === "delivery") setActiveModal("pickup");
    else setActiveModal(null);
  };

  // ✅ تابع امن برای فرمت تاریخ
  const formatSafe = (date) => {
    if (!date) return "";
    try {
      const d =
        date instanceof DateObject
          ? date
          : new DateObject({ date, calendar: persian, locale: persian_fa });
      return d.format("dddd DD MMMM");
    } catch {
      return "";
    }
  };

  return (
    <div
      dir="rtl"
      className="w-full max-w-4xl mx-auto bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 rounded-2xl shadow-md shadow-pink-300 border border-pink-200 p-6 "
    >
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
        انتخاب بازه‌های زمانی
      </h2>

      {/* 💻 دسکتاپ */}
      <div className="hidden md:block space-y-10">
        <section>
          <h3 className="text-md font-medium text-gray-700 mb-2">
            📦 تحویل دادن به مشتری
          </h3>
          <TimeSelector
            selectedDate={deliveryDate}
            setSelectedDate={setDeliveryDate}
            selectedTime={deliveryTime}
            setSelectedTime={setDeliveryTime}
          />
        </section>

        <section>
          <h3 className="text-md font-medium text-gray-700 mb-2">
            🕒 تحویل گرفتن از فروشنده
          </h3>
          <TimeSelector
            selectedDate={pickupDate}
            setSelectedDate={setPickupDate}
            selectedTime={pickupTime}
            setSelectedTime={setPickupTime}
          />
        </section>
      </div>

{/* 📱 موبایل */}
<div className="md:hidden flex flex-col gap-2 mt-2">
  <button
    onClick={() => setActiveModal("delivery")}
    className="block bg-pink-500 text-white px-5 py-2 rounded-xl mx-auto"
  >
    انتخاب زمان تحویل
  </button>
</div>


      {/* 📱 مودال انتخاب */}
      {activeModal && (
        <ModalPicker
          type={activeModal}
          onClose={() => setActiveModal(null)}
          onConfirm={handleConfirm}
          selectedDate={activeModal === "pickup" ? pickupDate : deliveryDate}
          setSelectedDate={
            activeModal === "pickup" ? setPickupDate : setDeliveryDate
          }
          selectedTime={activeModal === "pickup" ? pickupTime : deliveryTime}
          setSelectedTime={
            activeModal === "pickup" ? setPickupTime : setDeliveryTime
          }
        />
      )}

      {/* ✅ خلاصه انتخاب */}
      {(pickupDate || deliveryDate) && (
        <div className="mt-5 text-center text-gray-700 space-y-2">
          {deliveryDate && deliveryTime && (
            <p>
              📦 تحویل دادن:{" "}
              <span className="text-pink-500 font-semibold">
                {formatSafe(deliveryDate)}
              </span>{" "}
              ساعت{" "}
              <span className="text-pink-500  font-semibold">
                {deliveryTime}
              </span>
            </p>
          )}
          {pickupDate && pickupTime && (
            <p>
              🕒 تحویل گرفتن:{" "}
              <span className="text-pink-500 font-semibold">
                {formatSafe(pickupDate)}
              </span>{" "}
              ساعت{" "}
              <span className="text-pink-500 font-semibold">
                {pickupTime}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
