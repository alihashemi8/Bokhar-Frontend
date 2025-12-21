import React from "react";

export default function StepProgress({ steps, step, maxStep, onStepClick }) {
  return (
    <div className="flex items-center justify-between relative mb-8 md:mt-20">
      {/* خط پیشرفت زمینه */}
      <div className="absolute top-1/2 rounded-full"></div>

      {steps.map((item) => {
        const isClickable = item.id <= maxStep;
        const isActive = step === item.id;
        const isCompleted = maxStep >= item.id;
        const isReached = item.id < maxStep && !isActive;

        return (
          <div
            key={item.id}
            className={`flex flex-col items-center w-full transition-all ${
              isClickable
                ? "cursor-pointer hover:opacity-90"
                : "cursor-not-allowed opacity-60"
            }`}
            onClick={() => isClickable && onStepClick(item.id)}
          >
            {/* دایره مرحله */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300
                ${
                  isActive
                    ? "bg-sky-300 text-white border-sky-300 shadow-md"
                    : isCompleted
                    ? "bg-sky-100 text-sky-700 border-sky-200"
                    : "bg-white border-sky-100 text-gray-400"
                }`}
            >
              {isCompleted && !isActive ? "✓" : item.id}
            </div>

            {/* برچسب مرحله */}
            <span
              className={`mt-2 text-sm font-medium ${
                isActive
                  ? "text-sky-600"
                  : isCompleted
                  ? "text-sky-500"
                  : "text-gray-400"
              }`}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
