import { useReducer, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Factor from "../components/orders/Factor";
import DateTimeRangePicker from "../components/orders/time/DateTimeRangePicker";
import MapSelector from "../components/orders/map/MapSelector";
import Payment from "../components/orders/Payment";
import StepProgress from "../components/orders/StepProgress";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// ---- حالت اولیه ----
const initialState = {
  step: Number(localStorage.getItem("orderStep")) || 1,
  maxStep: Number(localStorage.getItem("orderMaxStep")) || 1,
  orderData: localStorage.getItem("orderData")
    ? JSON.parse(localStorage.getItem("orderData"))
    : {
        cartItems: [],
        datetime: null,
        location: null,
        discountCode: "",
        discountAmount: 0,
      },
  factorTotal: 0,
};

// ---- reducer ----
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

  // ---- ذخیره در localStorage ----
  useEffect(() => {
    localStorage.setItem("orderStep", step);
    if (step > maxStep) {
      dispatch({ type: "SET_MAX_STEP", payload: step });
      localStorage.setItem("orderMaxStep", step);
    }
  }, [step, maxStep]);

  useEffect(() => {
    localStorage.setItem("orderData", JSON.stringify(orderData));
  }, [orderData]);

  // ---- اسکرول به بالا هنگام تغییر مرحله ----
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // ---- کنترل مراحل ----
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
        toast.error("لطفاً زمان تحویل دادن و تحویل گرفتن را کامل انتخاب کنید.");
        return;
      }
    }

    if (step === 3) {
      const { location } = orderData;
      if (!location || !location.coords || !location.plaque || !location.unit) {
        toast.error("لطفاً موقعیت مکانی را کامل انتخاب کنید.");
        return;
      }
    }

    if (step < 4) dispatch({ type: "SET_STEP", payload: step + 1 });
  };

  const handleBack = () =>
    step > 1 && dispatch({ type: "SET_STEP", payload: step - 1 });

  // ---- ارسال سفارش ----
  const submitOrder = async () => {
    try {
      const total = factorTotal - (orderData.discountAmount || 0);
      const payload = { ...orderData, subtotal: factorTotal, total };
      const response = await axios.post(`${API_URL}/orders/`, payload);

      toast.success("سفارش با موفقیت ثبت شد ✅");
      console.log("✅ پاسخ سرور:", response.data);

      ["orderData", "orderStep", "orderMaxStep"].forEach(localStorage.removeItem);
      dispatch({ type: "RESET_ORDER" });
    } catch (error) {
      console.error("❌ خطا در ثبت سفارش:", error);
      toast.error("خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.");
    }
  };

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
      dispatch({ type: "SET_STEP", payload: clickedStep });
    }
  };

  // ---- انیمیشن برای تغییر مرحله ----
  const fadeVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster position="top-center" />

      {/* نوار مراحل */}
      <StepProgress
        steps={steps}
        step={step}
        maxStep={maxStep}
        onStepClick={handleStepClick}
      />

      {/* محتوای مرحله‌ها با انیمیشن */}
      <div className="min-h-[350px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <Factor
                onTotalChange={(value) =>
                  dispatch({ type: "SET_FACTOR_TOTAL", payload: value })
                }
              />
            )}
            {step === 2 && (
              <DateTimeRangePicker
                onChange={(datetime) =>
                  dispatch({ type: "SET_ORDER_DATA", payload: { datetime } })
                }
                value={orderData.datetime}
              />
            )}
            {step === 3 && (
              <MapSelector
                initialPosition={orderData.location?.coords || undefined}
                initialAddress={orderData.location?.address || ""}
                onLocationSelect={(location) =>
                  dispatch({ type: "SET_ORDER_DATA", payload: { location } })
                }
              />
            )}
            {step === 4 && (
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
                  const rate = codes[orderData.discountCode.toUpperCase()];
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
                : "bg-sky-200 text-gray-800 hover:bg-sky-300 shadow-2xl shadow-pink-300 border border-sky-300"
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
