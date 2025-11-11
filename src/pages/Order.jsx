import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Factor from "../components/orders/Factor";
import DateTimeRangePicker from "../components/orders/time/DateTimeRangePicker";
import MapSelector from "../components/orders/map/MapSelector";
import Payment from "../components/orders/Payment";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function Order() {
  // ---- مرحله فعلی ----
  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem("orderStep");
    return savedStep ? Number(savedStep) : 1;
  });

  // ---- آخرین مرحله‌ای که کاربر بهش رسیده ----
  const [maxStep, setMaxStep] = useState(() => {
    const savedMax = localStorage.getItem("orderMaxStep");
    return savedMax ? Number(savedMax) : 1;
  });

  // ---- داده‌های سفارش ----
  const [orderData, setOrderData] = useState(() => {
    const savedData = localStorage.getItem("orderData");
    return savedData
      ? JSON.parse(savedData)
      : {
          cartItems: [],
          datetime: null,
          location: null,
          discountCode: "",
          discountAmount: 0,
        };
  });

  // ---- ذخیره در localStorage ----
  useEffect(() => {
    localStorage.setItem("orderStep", step);
    if (step > maxStep) {
      setMaxStep(step);
      localStorage.setItem("orderMaxStep", step);
    }
  }, [step]);

  useEffect(() => {
    localStorage.setItem("orderData", JSON.stringify(orderData));
  }, [orderData]);

  // ---- کنترل مرحله‌ها ----
  const handleNext = () => {
    if (step === 2) {
      const { datetime } = orderData;
      if (
        !datetime ||
        !datetime.delivery?.date ||
        !datetime.delivery?.time ||
        !datetime.pickup?.date ||
        !datetime.pickup?.time
      ) {
        alert("لطفاً زمان تحویل دادن و تحویل گرفتن را کامل انتخاب کنید.");
        return;
      }
    }

    if (step === 3) {
      const { location } = orderData;
      if (!location || !location.coords || !location.plaque || !location.unit) {
        alert("لطفاً موقعیت مکانی را کامل انتخاب کنید.");
        return;
      }
    }

    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => step > 1 && setStep(step - 1);

  // ---- محاسبات قیمت ----
  const subtotal = orderData.cartItems.reduce(
    (sum, i) => sum + i.totalPrice * i.qty,
    0
  );
  const total = subtotal - (orderData.discountAmount || 0);

  // ---- ارسال سفارش ----
  const submitOrder = async () => {
    try {
      const payload = { ...orderData, subtotal, total };
      const response = await axios.post(`${API_URL}/orders/`, payload);

      alert("سفارش با موفقیت ثبت شد ✅");
      console.log("✅ پاسخ سرور:", response.data);

      localStorage.removeItem("orderData");
      localStorage.removeItem("orderStep");
      localStorage.removeItem("orderMaxStep");

      setStep(1);
      setMaxStep(1);
      setOrderData({
        cartItems: [],
        datetime: null,
        location: null,
        discountCode: "",
        discountAmount: 0,
      });
    } catch (error) {
      console.error("❌ خطا در ثبت سفارش:", error);
      alert("خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.");
    }
  };

  // ---- جلوگیری از حلقه رندر ----
  const handleDatetimeChange = useCallback((datetime) => {
    setOrderData((prev) => ({ ...prev, datetime }));
  }, []);

  const handleLocationChange = useCallback((location) => {
    setOrderData((prev) => ({ ...prev, location }));
  }, []);

  // ---- مراحل ----
  const steps = [
    { id: 1, label: "فاکتور" },
    { id: 2, label: "زمان" },
    { id: 3, label: "مکان" },
    { id: 4, label: "پرداخت" },
  ];

  // ---- کلیک روی مراحل ----
  const handleStepClick = (clickedStep) => {
    if (clickedStep <= maxStep) {
      setStep(clickedStep);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
{/* نوار مراحل */}
<div className="flex items-center justify-between relative md:mt-15.5 mb-8">
  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10"></div>
  {steps.map((item) => {
    const isClickable = item.id <= maxStep;
    const isActive = step === item.id;
    const isCompleted = maxStep >= item.id; // تا این مرحله رسیده
    const isReached = item.id <= maxStep && item.id !== step; // مراحل طی‌شده ولی فعلی نیست

    return (
      <div
        key={item.id}
        className={`flex flex-col items-center w-full transition-all ${
          isClickable
            ? "cursor-pointer hover:opacity-90"
            : "cursor-not-allowed opacity-60"
        }`}
        onClick={() => isClickable && handleStepClick(item.id)}
      >
        <div
          className={`w-9 h-9 flex items-center justify-center rounded-full border-2 transition-all duration-300
            ${
              isActive
                ? "bg-purple-600 text-white border-purple-600"
                : isReached
                ? "bg-purple-100 text-purple-700 border-purple-400"
                : item.id < step
                ? "bg-green-500 text-white border-green-500"
                : "bg-white border-gray-300 text-gray-400"
            }`}
        >
          {maxStep >= item.id ? "✓" : item.id}
        </div>
        <span
          className={`mt-2 text-sm font-medium ${
            isActive
              ? "text-purple-700"
              : isReached
              ? "text-purple-500"
              : item.id <= maxStep
              ? "text-gray-700"
              : "text-gray-400"
          }`}
        >
          {item.label}
        </span>
      </div>
    );
  })}
</div>


      {/* محتوای مرحله‌ها */}
      <div className="min-h-[350px]">
        {step === 1 && <Factor />}
        {step === 2 && (
          <DateTimeRangePicker
            onChange={handleDatetimeChange}
            value={orderData.datetime}
          />
        )}
        {step === 3 && (
          <MapSelector
            initialPosition={orderData.location?.coords || undefined}
            initialAddress={orderData.location?.address || ""}
            onLocationSelect={handleLocationChange}
          />
        )}
        {step === 4 && (
          <Payment
            subtotal={subtotal}
            total={total}
            discountAmount={orderData.discountAmount}
            discountCode={orderData.discountCode}
            setDiscountCode={(code) =>
              setOrderData((prev) => ({ ...prev, discountCode: code }))
            }
            applyDiscount={() => {
              if (orderData.discountCode === "OFF10") {
                const discount = 0.1 * subtotal;
                setOrderData((prev) => ({ ...prev, discountAmount: discount }));
                return true;
              }
              return false;
            }}
            handlePayment={submitOrder}
          />
        )}
      </div>

      {/* کنترل مرحله‌ها */}
      <div className="flex justify-center gap-3 mt-8 mb-20 md:mb-0">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
          >
            بازگشت
          </button>
        )}

        {step < 4 && (
          <button
            onClick={handleNext}
            className={`px-4 py-2 rounded-xl transition ${
              step === 3 &&
              (!orderData.location?.coords ||
                !orderData.location?.plaque ||
                !orderData.location?.unit)
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {step === 1 && "انتخاب زمان تحویل"}
            {step === 2 && "انتخاب مکان"}
            {step === 3 && "پرداخت"}
          </button>
        )}

        {step === 4 && (
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            onClick={submitOrder}
          >
            ثبت نهایی سفارش
          </button>
        )}
      </div>
    </div>
  );
}
