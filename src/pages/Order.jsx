import { useState } from "react";
import Factor from "../components/orders/Factor";
import DateTimeRangePicker from "../components/orders/DateTimePicker";
import MapSelector from "../components/orders/map/MapSelector";
import Payment from "../components/orders/Payment";

export default function Order() {
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({
    cartItems: [],
    datetime: null,
    location: null,
    discountCode: "",
    discountAmount: 0,
  });

  const steps = [
    { id: 1, label: "فاکتور" },
    { id: 2, label: "زمان" },
    { id: 3, label: "مکان" },
    { id: 4, label: "پرداخت" },
  ];

  const handleNext = () => {
    if (step === 2) {
      const { datetime } = orderData;
      if (
        !datetime ||
        !datetime.delivery?.date ||
        !datetime.delivery?.times?.length ||
        !datetime.pickup?.date ||
        !datetime.pickup?.times?.length
      ) {
        alert("لطفاً زمان تحویل دادن و تحویل گرفتن را کامل انتخاب کنید.");
        return;
      }
    }

    if (step === 3) {
      const { location } = orderData;
      if (
        !location ||
        !location.coords ||
        !location.plaque ||
        !location.unit
      ) {
        alert(
          "لطفاً موقعیت مکانی خود را روی نقشه انتخاب کرده و فیلدهای ستاره‌دار را پر کنید."
        );
        return;
      }
    }

    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const subtotal = orderData.cartItems.reduce(
    (sum, i) => sum + i.totalPrice * i.qty,
    0
  );
  const total = subtotal - (orderData.discountAmount || 0);

  const isStep3Disabled =
    step === 3 &&
    (!orderData.location?.coords ||
      !orderData.location?.plaque ||
      !orderData.location?.unit);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between relative md:mt-15.5 mb-8">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10"></div>
        {steps.map((item) => (
          <div key={item.id} className="flex flex-col items-center w-full">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300
                ${
                  step === item.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : step > item.id
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
            >
              {step > item.id ? "✓" : item.id}
            </div>
            <span
              className={`mt-2 text-sm ${
                step >= item.id ? "text-gray-800" : "text-gray-400"
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* محتوا */}
      <div className="min-h-[350px]">
        {step === 1 && <Factor />}

        {step === 2 && (
          <DateTimeRangePicker
            onChange={(value) =>
              setOrderData((prev) => ({ ...prev, datetime: value }))
            }
          />
        )}

        {step === 3 && (
          <MapSelector
            initialPosition={orderData.location?.coords || undefined}
            initialAddress={orderData.location?.address || ""}
            onLocationSelect={(location) => {
              setOrderData((prev) => {
                const prevLoc = prev.location;
                if (
                  prevLoc?.coords?.lat === location.coords.lat &&
                  prevLoc?.coords?.lng === location.coords.lng &&
                  prevLoc?.title === location.title &&
                  prevLoc?.plaque === location.plaque &&
                  prevLoc?.unit === location.unit
                ) {
                  return prev;
                }
                return { ...prev, location };
              });
            }}
          />
        )}

        {step === 4 && (
          <Payment
            subtotal={subtotal}
            total={total}
            discountAmount={orderData.discountAmount}
            discountCode={orderData.discountCode}
            setDiscountCode={(code) =>
              setOrderData({ ...orderData, discountCode: code })
            }
            applyDiscount={() => {
              if (orderData.discountCode === "OFF10") {
                const discount = 0.1 * subtotal;
                setOrderData({ ...orderData, discountAmount: discount });
                return true;
              }
              return false;
            }}
            handlePayment={() => alert("در حال اتصال به درگاه پرداخت...")}
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
              isStep3Disabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={isStep3Disabled}
          >
            {step === 1 && "انتخاب زمان تحویل"}
            {step === 2 && "انتخاب مکان"}
            {step === 3 && "پرداخت"}
          </button>
        )}

        {step === 4 && (
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            onClick={() => alert("سفارش با موفقیت ثبت شد ✅")}
          >
            ثبت نهایی سفارش
          </button>
        )}
      </div>
    </div>
  );
}
