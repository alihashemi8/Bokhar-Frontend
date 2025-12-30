import { Package, CheckCircle } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const orderSteps = [
  { label: "در راه خشکشویی", emoji: "🚚" },
  { label: "در صف شستشو", emoji: "🫧" },
  { label: "آماده تحویل", emoji: "📦" },
  { label: "تحویل داده شد", emoji: "✅" },
];

export default function OrderTracking() {
  const navigate = useNavigate();

  const orders = [
    { id: 2458, currentStep: 1 },
    { id: 2461, currentStep: 3 },
    { id: 2462, currentStep: 0 },
  ];

  return (
    <div dir="rtl" className="min-h-screen p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow p-4 md:max-w-3xl md:mx-auto md:mt-15 mb-20 md:mb-0">

        {/* Header */}
<div className="flex items-center gap-3 mb-6">
  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
    <Package className="text-orange-600" size={22} />
  </div>

  <div>
    <p className="text-lg font-semibold">پیگیری سفارش‌ها</p>
    <p className="text-sm text-gray-500">وضعیت سفارش‌های شما</p>
  </div>

  {/* Back Button */}
  <button
    onClick={() => navigate("/customer-dashboard")}
    className="ms-auto w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
  >
    <ArrowRight size={20} className="text-gray-700" />
  </button>
</div>


        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-gray-50 border rounded-2xl p-4">
              <div className="flex justify-between items-center mb-4">
                <p className="font-medium text-gray-800">سفارش #{order.id}</p>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-2">
                {orderSteps.map((step, idx) => {
                  const isCompleted = idx < order.currentStep;
                  const isCurrent = idx === order.currentStep;

                  return (
                    <div key={idx} className="flex-1 flex items-center">
                      {/* Circle */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                          ${
                            isCompleted
                              ? "bg-green-600 text-white"
                              : isCurrent
                              ? "border-2 border-green-600 text-green-600 animate-pulse"
                              : "bg-gray-300 text-gray-500"
                          }`}
                      >
                        {isCompleted ? <CheckCircle size={18} /> : step.emoji}
                      </div>

                      {/* Line */}
                      {idx < orderSteps.length - 1 && (
                        <div
                          className={`flex-1 h-1 rounded ${
                            idx < order.currentStep
                              ? "bg-green-600"
                              : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step Labels */}
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                {orderSteps.map((step, idx) => (
                  <span key={idx} className="text-center flex-1">
                    {step.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
