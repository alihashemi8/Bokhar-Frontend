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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

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

export default function Order() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { step, maxStep, orderData, factorTotal } = state;

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("delivery");

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

  const stepType = useCallback(
    (s) => {
      if (isMobile) {
        if (s === 1) return "factor";
        if (s === 2) return "location";
        if (s === 3) return "payment";
      } else {
        if (s === 1) return "factor";
        if (s === 2) return "time";
        if (s === 3) return "location";
        if (s === 4) return "payment";
      }
      return null;
    },
    [isMobile]
  );

  const steps = isMobile
    ? [
        { id: 1, label: "فاکتور" },
        { id: 2, label: "مکان" },
        { id: 3, label: "پرداخت" },
      ]
    : [
        { id: 1, label: "فاکتور" },
        { id: 2, label: "زمان" },
        { id: 3, label: "مکان" },
        { id: 4, label: "پرداخت" },
      ];

  const handleNext = useCallback(() => {
    const currentType = stepType(step);

    if (currentType === "time") {
      const { datetime } = orderData;
      if (
        !datetime?.delivery?.date ||
        !datetime?.delivery?.time ||
        !datetime?.pickup?.date ||
        !datetime?.pickup?.time
      ) {
        toast.error("لطفاً زمان تحویل دادن و تحویل گرفتن را کامل انتخاب کنید.");
        return;
      }
    }

    if (currentType === "location") {
      const { location } = orderData;
      if (!location?.coords || !location?.plaque || !location?.unit) {
        toast.error("لطفاً موقعیت مکانی را کامل انتخاب کنید.");
        return;
      }
    }

    const stepsCount = isMobile ? 3 : 4;
    if (step < stepsCount) {
      const nextStep = step + 1;
      dispatch({ type: "SET_STEP", payload: nextStep });
      if (nextStep > maxStep) dispatch({ type: "SET_MAX_STEP", payload: nextStep });
    }
  }, [step, maxStep, orderData, isMobile, stepType]);

  const handleBack = useCallback(() => {
    if (step > 1) dispatch({ type: "SET_STEP", payload: step - 1 });
  }, [step]);

  const handleStepClick = useCallback(
    (clickedStep) => {
      if (clickedStep <= maxStep) dispatch({ type: "SET_STEP", payload: clickedStep });
    },
    [maxStep]
  );

  const submitOrder = useCallback(async () => {
    try {
      const total = factorTotal - (orderData.discountAmount || 0);
      const payload = { ...orderData, subtotal: factorTotal, total };
      await axios.post(`${API_URL}/orders/`, payload);

      toast.success("سفارش با موفقیت ثبت شد ✅");
      ["orderData", "orderStep", "orderMaxStep"].forEach(localStorage.removeItem);
      dispatch({ type: "RESET_ORDER" });
    } catch (error) {
      toast.error("خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.");
    }
  }, [orderData, factorTotal]);

  const handleSetModalDate = useCallback(
    (dateObj) => {
      const dateStr = dateObj?.format ? dateObj.format("YYYY-MM-DD") : null;
      if (modalType === "delivery") {
        dispatch({
          type: "SET_ORDER_DATA",
          payload: {
            datetime: {
              ...orderData.datetime,
              delivery: { ...orderData.datetime.delivery, date: dateStr },
            },
          },
        });
      } else {
        dispatch({
          type: "SET_ORDER_DATA",
          payload: {
            datetime: {
              ...orderData.datetime,
              pickup: { ...orderData.datetime.pickup, date: dateStr },
            },
          },
        });
      }
    },
    [modalType, orderData.datetime]
  );

  const handleSetModalTime = useCallback(
    (timeStr) => {
      if (modalType === "delivery") {
        dispatch({
          type: "SET_ORDER_DATA",
          payload: {
            datetime: {
              ...orderData.datetime,
              delivery: { ...orderData.datetime.delivery, time: timeStr },
            },
          },
        });
      } else {
        dispatch({
          type: "SET_ORDER_DATA",
          payload: {
            datetime: {
              ...orderData.datetime,
              pickup: { ...orderData.datetime.pickup, time: timeStr },
            },
          },
        });
      }
    },
    [modalType, orderData.datetime]
  );

  const handleModalConfirm = useCallback(() => {
    const dt = orderData.datetime || {};
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
        toast.error("لطفاً زمان تحویل گرفتن را انتخاب کنید.");
        return;
      }
      setModalOpen(false);
      setModalType("delivery");
      if (step !== 2) dispatch({ type: "SET_STEP", payload: 2 });
    }
  }, [modalType, orderData.datetime, step]);

  const goToLocationStep = useCallback(() => {
    dispatch({ type: "SET_STEP", payload: isMobile ? 2 : 3 });
    if ((isMobile ? 2 : 3) > maxStep) dispatch({ type: "SET_MAX_STEP", payload: isMobile ? 2 : 3 });
  }, [isMobile, maxStep]);

  const isLastStep = step === steps.length;
  const selectedDateStr =
    modalType === "delivery"
      ? orderData.datetime.delivery?.date
      : orderData.datetime.pickup?.date;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster position="top-center" />

      <StepProgress
        steps={steps}
        step={step}
        maxStep={maxStep}
        onStepClick={handleStepClick}
      />

      <div className="min-h-[350px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step + (isMobile ? "-m" : "-d")}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <Factor
                onTotalChange={(value) =>
                  dispatch({ type: "SET_FACTOR_TOTAL", payload: value })
                }
                goToTimeStep={() => {
                  if (!isMobile) dispatch({ type: "SET_STEP", payload: 2 });
                }}
              />
            )}

            {isMobile && step === 1 && (
              <div className="mt-6 text-center">
                <button
                  className="bg-pink-500 text-white w-[100%] px-5 py-2 mb-20 rounded-xl"
                  onClick={() => {
                    setModalType("delivery");
                    setModalOpen(true);
                  }}
                >
                  انتخاب زمان
                </button>

{modalOpen && (
  <ModalPicker
    type={modalType}
    isOpen={modalOpen}
    selectedDate={selectedDateStr}
    setSelectedDate={(dateObj) => {
      handleSetModalDate(dateObj); // ثبت تاریخ
    }}
    selectedTime={
      modalType === "delivery"
        ? orderData.datetime.delivery?.time || null
        : orderData.datetime.pickup?.time || null
    }
    setSelectedTime={(timeStr) => {
      handleSetModalTime(timeStr); // ثبت زمان
    }}
    onConfirm={() => {
      const dt = orderData.datetime || {};
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
          toast.error("لطفاً زمان تحویل گرفتن را انتخاب کنید.");
          return;
        }
        // اینجا قبل از بستن modal حتما orderData با زمان pickup آپدیت می‌شه
        setModalOpen(false);
        setModalType("delivery");
        if (step !== 2) dispatch({ type: "SET_STEP", payload: 2 });
      }
    }}
    onClose={() => {
      setModalOpen(false);
      setModalType("delivery");
    }}
  />
)}

              </div>
            )}

            {!isMobile && step === 2 && (
              <DateTimeRangePicker
                value={orderData.datetime}
                onChange={(v) =>
                  dispatch({ type: "SET_ORDER_DATA", payload: { datetime: v } })
                }
                onGoLocation={goToLocationStep}
              />
            )}

            {stepType(step) === "location" && (
              <MapSelector
                initialPosition={orderData.location?.coords}
                initialAddress={orderData.location?.address || ""}
                onLocationSelect={(location) =>
                  dispatch({ type: "SET_ORDER_DATA", payload: { location } })
                }
                goToNextStep={handleNext}
              />
            )}

            {stepType(step) === "payment" && (
              <Payment
                cartItems={orderData.cartItems}
                subtotal={factorTotal}
                total={factorTotal - (orderData.discountAmount || 0)}
                discountAmount={orderData.discountAmount}
                discountCode={orderData.discountCode}
                setDiscountCode={(code) =>
                  dispatch({
                    type: "SET_ORDER_DATA",
                    payload: { discountCode: code },
                  })
                }
                applyDiscount={() => {
                  const codes = { OFF10: 0.1, OFF20: 0.2 };
                  const rate = codes[orderData.discountCode?.toUpperCase()];
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
