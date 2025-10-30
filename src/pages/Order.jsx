import { useState } from "react";
import { useCart } from "../context/CartContext";
import Factor from "../components/Factor";
import Pay from "../components/Payment";
import DateTimeRangePicker from "../components/DateTimePicker";

export default function Order() {
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useCart();
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [pickup, setPickup] = useState({ date: null, time: null });
  const [delivery, setDelivery] = useState({ date: null, time: null });

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
    if (!pickup.date || !pickup.time || !delivery.date || !delivery.time) {
      return alert("لطفاً زمان تحویل گرفتن و تحویل دادن را انتخاب کنید");
    }
    // ارسال سفارش + زمان‌ها به backend
    alert(`پرداخت ${total.toLocaleString()} تومان آغاز شد`);
    console.log("سفارش با زمان‌ها:", { pickup, delivery });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 md:p-10">
      <div className="max-w-6xl mb-12 mt-10 mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-10 flex flex-col gap-8">
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

        {/* انتخاب زمان تحویل دادن و تحویل گرفتن */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl text-center font-bold">انتخاب زمان تحویل دادن و گرفتن</h2>
          <DateTimeRangePicker
            onChange={({ delivery: newDelivery, pickup: newPickup }) => {
              setDelivery(newDelivery);
              setPickup(newPickup);
            }}
          />
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
