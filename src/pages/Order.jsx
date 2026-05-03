import { useReducer, useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import Factor from "../components/orders/Factor";
import DateTimeRangePicker from "../components/orders/time/DateTimeRangePicker";
import MapSelector from "../components/orders/map/MapSelector.jsx";
import Payment from "../components/orders/Payment";
import StepProgress from "../components/orders/StepProgress";
import ModalPicker from "../components/orders/time/ModalPicker";

import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

// -------------------- constants --------------------
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const DISCOUNT_CODES = {
  OFF10: 0.1,
  OFF20: 0.2,
};

const initialState = {
  step: Number(localStorage.getItem("orderStep")) || 1,
  maxStep: Number(localStorage.getItem("orderMaxStep")) || 1,
  orderData: localStorage.getItem("orderData")
    ? JSON.parse(localStorage.getItem("orderData"))
    : {
        cartItems: [],
        datetime: { delivery: {}, pickup: {} },
        location: null,
        discountCode: "",
        discountAmount: 0,
      },
  factorTotal: 0,
};

// -------------------- reducer --------------------
function reducer(state, action) {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "SET_MAX_STEP":
      return { ...state, maxStep: action.payload };
    case "SET_ORDER_DATA":
      return { ...state, orderData: { ...state.orderData, ...action.payload } };
    case "SET_FACTOR_TOTAL":
      return { ...state, factorTotal: action.payload };
    case "RESET_ORDER":
      return { ...initialState, step: 1, maxStep: 1 };
    default:
      return state;
  }
}

// -------------------- main component --------------------
export default function Order() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { step, maxStep, orderData, factorTotal } = state;

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  const [modalType, setModalType] = useState("delivery");

  // -------------------- helpers --------------------
  const getDateObj = (dateStr) =>
    dateStr
      ? new DateObject({ date: dateStr, calendar: persian, locale: persian_fa })
      : null;

  const selectedDateObj =
    modalType === "delivery"
      ? getDateObj(orderData.datetime.delivery?.date)
      : getDateObj(orderData.datetime.pickup?.date);

  const minPickupDate =
    modalType === "pickup" && orderData.datetime.delivery?.date
      ? getDateObj(orderData.datetime.delivery.date).add(2, "days")
      : null;

  // ✅ ترتیب یکسان برای موبایل و دسکتاپ
  const stepMap = { 1: "factor", 2: "location", 3: "time", 4: "payment" };
  const stepLabels = ["فاکتور", "مکان", "زمان", "پرداخت"];

  const stepType = (s) => stepMap[s] || null;

  // -------------------- effects --------------------
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("orderData", JSON.stringify(orderData));
  }, [orderData]);

  useEffect(() => {
    localStorage.setItem("orderStep", step);
    localStorage.setItem("orderMaxStep", maxStep);
  }, [step, maxStep]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // -------------------- modal handlers --------------------
  const handleModalChange = useCallback(
    (type, value) => {
      const datetime = { ...orderData.datetime };
      if (modalType === "delivery") {
        datetime.delivery[type] = value;
      } else {
        datetime.pickup[type] = value;
      }
      dispatch({ type: "SET_ORDER_DATA", payload: { datetime } });
    },
    [modalType, orderData.datetime],
  );

  const handleModalConfirm = useCallback(() => {
    const dt = orderData.datetime;

    if (modalType === "delivery") {
      if (!dt.delivery?.date || !dt.delivery?.time) {
        toast.error("لطفاً زمان تحویل دادن را کامل انتخاب کنید.");
        return;
      }
      setModalType("pickup");
      return;
    }

    if (modalType === "pickup") {
      if (!dt.pickup?.date || !dt.pickup?.time) {
        toast.error("لطفاً زمان تحویل گرفتن را کامل انتخاب کنید.");
        return;
      }

      // ✅ بعد از زمان (مرحله ۳) برو به پرداخت (مرحله ۴)
      const nextStep = 4;
      dispatch({ type: "SET_STEP", payload: nextStep });
      if (nextStep > maxStep) dispatch({ type: "SET_MAX_STEP", payload: nextStep });
    }
  }, [modalType, orderData.datetime, maxStep]);

  // -------------------- step handlers --------------------
  const handleNext = useCallback(() => {
    const currentType = stepType(step);

    if (currentType === "location") {
      const { location } = orderData;
      if (!location?.coords || !location?.plaque || !location?.unit) {
        toast.error("لطفاً موقعیت مکانی را کامل انتخاب کنید.");
        return;
      }
    }

    if (currentType === "time") {
      const { delivery, pickup } = orderData.datetime;
      if (
        !delivery?.date ||
        !delivery?.time ||
        !pickup?.date ||
        !pickup?.time
      ) {
        toast.error("لطفاً زمان تحویل دادن و تحویل گرفتن را کامل انتخاب کنید.");
        return;
      }
    }

    const stepsCount = Object.keys(stepMap).length;
    if (step < stepsCount) {
      const nextStep = step + 1;
      dispatch({ type: "SET_STEP", payload: nextStep });
      if (nextStep > maxStep)
        dispatch({ type: "SET_MAX_STEP", payload: nextStep });
    }
  }, [step, maxStep, orderData, stepMap]);

  const handleBack = useCallback(() => {
    if (step > 1) {
      // اگر از مرحله زمان (۳) برمی‌گردیم، ریست کردن modalType
      if (step === 3) {
        setModalType("delivery");
      }
      dispatch({ type: "SET_STEP", payload: step - 1 });
    }
  }, [step]);

  const handleStepClick = useCallback(
    (clickedStep) => {
      if (clickedStep <= maxStep)
        dispatch({ type: "SET_STEP", payload: clickedStep });
    },
    [maxStep],
  );

  const submitOrder = useCallback(async () => {
    try {
      const total = factorTotal - (orderData.discountAmount || 0);
      await axios.post(`${API_URL}/orders/`, {
        ...orderData,
        subtotal: factorTotal,
        total,
      });
      toast.success("سفارش با موفقیت ثبت شد ✅");
      ["orderData", "orderStep", "orderMaxStep"].forEach((key) =>
        localStorage.removeItem(key),
      );
      dispatch({ type: "RESET_ORDER" });
    } catch (err) {
      console.error(err);
      toast.error("خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.");
    }
  }, [orderData, factorTotal]);

  // -------------------- render --------------------
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster position="top-center" />
      <StepProgress
        steps={stepLabels.map((label, idx) => ({ id: idx + 1, label }))}
        step={step}
        maxStep={maxStep}
        onStepClick={handleStepClick}
      />

      <div className="min-h-[350px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
          >
            {/* مرحله ۱: فاکتور */}
            {stepType(step) === "factor" && (
              <Factor
                onTotalChange={(value) =>
                  dispatch({ type: "SET_FACTOR_TOTAL", payload: value })
                }
                // ✅ از فاکتور به مکان (مرحله ۲)
                goToTimeStep={() => {
                  const nextStep = 2;
                  dispatch({ type: "SET_STEP", payload: nextStep });
                  if (nextStep > maxStep)
                    dispatch({ type: "SET_MAX_STEP", payload: nextStep });
                }}
              />
            )}

            {/* مرحله ۲: مکان (موبایل و دسکتاپ) */}
            {stepType(step) === "location" && (
              <MapSelector
                initialPosition={orderData.location?.coords}
                initialAddress={orderData.location?.address || ""}
                onLocationSelect={(location) =>
                  dispatch({ type: "SET_ORDER_DATA", payload: { location } })
                }
                goToNextStep={handleNext} // می‌ره به مرحله ۳ (زمان)
              />
            )}

            {/* مرحله ۳: زمان */}
            {stepType(step) === "time" && (
              <>
                {/* دسکتاپ: نمایش اینلاین */}
                {!isMobile && (
                  <DateTimeRangePicker
                    value={orderData.datetime}
                    onChange={(v) =>
                      dispatch({ type: "SET_ORDER_DATA", payload: { datetime: v } })
                    }
                    onGoNext={handleNext} // می‌ره به مرحله ۴ (پرداخت)
                  />
                )}
                
                {/* موبایل: نمایش مودال/کامپوننت انتخابگر زمان */}
                {isMobile && (
                  <div className="mt-6">
                    <div className="text-center mb-4 text-gray-600 dark:text-gray-300">
                      لطفاً زمان تحویل و تحویل گرفتن را انتخاب کنید
                    </div>
                    <ModalPicker
                      type={modalType}
                      isOpen={true}
                      selectedDate={selectedDateObj}
                      setSelectedDate={(d) =>
                        handleModalChange("date", d?.format("YYYY-MM-DD") || null)
                      }
                      selectedTime={
                        modalType === "delivery"
                          ? orderData.datetime.delivery?.time || null
                          : orderData.datetime.pickup?.time || null
                      }
                      setSelectedTime={(t) => handleModalChange("time", t)}
                      minDate={minPickupDate}
                      onConfirm={handleModalConfirm}
                      onClose={() => handleBack()} // بستن = برگشت به مرحله ۲ (مکان)
                    />
                  </div>
                )}
              </>
            )}

            {/* مرحله ۴: پرداخت */}
            {stepType(step) === "payment" && (
              <Payment
                subtotal={factorTotal}
                total={factorTotal - (orderData.discountAmount || 0)}
                discountAmount={orderData.discountAmount}
                discountCode={orderData.discountCode}
                datetime={orderData.datetime}
                location={orderData.location}
                // ✅ بازگشت به زمان (مرحله ۳) - یکسان برای موبایل و دسکتاپ
                goToTimeStep={() => 
                  dispatch({ type: "SET_STEP", payload: 3 })
                }
                // ✅ بازگشت به مکان (مرحله ۲) - یکسان برای موبایل و دسکتاپ
                goToLocationStep={() => 
                  dispatch({ type: "SET_STEP", payload: 2 })
                }
                setDiscountCode={(code) =>
                  dispatch({
                    type: "SET_ORDER_DATA",
                    payload: { discountCode: code },
                  })
                }
                applyDiscount={() => {
                  const rate =
                    DISCOUNT_CODES[orderData.discountCode?.toUpperCase()];
                  if (rate) {
                    dispatch({
                      type: "SET_ORDER_DATA",
                      payload: { discountAmount: rate * factorTotal },
                    });
                    toast.success("تخفیف اعمال شد 🎉");
                    return true;
                  }
                  toast.error("کد تخفیف نامعتبر است ❌");
                  return false;
                }}
                handlePayment={submitOrder}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
