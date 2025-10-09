import { useState } from "react";
import { useCart } from "../context/CartContext";
import Factor from "../components/Factor";
import Pay from "../components/Payment";
import MapSelector from "../components/MapSelector"; // نسخه حرفه‌ای UX/UI

export default function Order() {
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useCart();
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [location, setLocation] = useState(null);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.totalPrice * item.qty,
    0
  );
  const total = subtotal - discountAmount;

  const applyDiscount = () => {
    if (discountCode === "BAKHAR10") setDiscountAmount(subtotal * 0.1);
    else {
      setDiscountAmount(0);
      alert("کد تخفیف معتبر نیست");
    }
  };

  const handlePayment = () => {
    if (!location) {
      return alert("لطفاً ابتدا مکان خود را روی نقشه انتخاب کنید");
    }
    // اینجا می‌تونی location + سفارش رو به backend ارسال کنی
    alert(`پرداخت ${total.toLocaleString()} تومان آغاز شد`);
    console.log("سفارش با آدرس:", location);
  };

  const handleLocation = (data) => {
    // data شامل {coords: {lat, lng}, address, description}
    setLocation(data);
    console.log("کاربر این مکان را انتخاب کرد:", data);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-10 flex flex-col gap-8">
        {/* عنوان */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center">
          فاکتور خرید شما
        </h1>

        {/* فاکتور */}
        <Factor
          cartItems={cartItems}
          increaseQty={increaseQty}
          decreaseQty={decreaseQty}
          removeFromCart={removeFromCart}
        />

        {/* انتخاب آدرس روی نقشه */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">انتخاب آدرس روی نقشه</h2>
          <MapSelector onLocationSelect={handleLocation} />
        </div>

        {/* پرداخت و کد تخفیف */}
        <Pay
          subtotal={subtotal}
          total={total}
          discountAmount={discountAmount}
          discountCode={discountCode}
          setDiscountCode={setDiscountCode}
          applyDiscount={applyDiscount}
          handlePayment={handlePayment}
        />
      </div>
    </div>
  );
}
