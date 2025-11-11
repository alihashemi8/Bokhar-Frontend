import React from "react";

export default function StepProgress({ steps, step, maxStep, onStepClick }) {
  return (
    <div className="flex items-center justify-between relative md:mt-15.5 mb-8">
      {/* خط پیشرفت زمینه */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10"></div>

      {/* بخش هر مرحله */}
      {steps.map((item) => {
        const isClickable = item.id <= maxStep;
        const isActive = step === item.id;
        const isReached = item.id < maxStep && !isActive;
        const isCompleted = maxStep >= item.id;

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
              className={`w-9 h-9 flex items-center justify-center rounded-full border-2 transition-all duration-300
                ${
                  isActive
                    ? "bg-purple-600 text-white border-purple-600"
                    : isReached
                    ? "bg-purple-100 text-purple-700 border-purple-400"
                    : isCompleted
                    ? "bg-purple-100 text-purple-700 border-purple-600"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
            >
              {isCompleted ? "✓" : item.id}
            </div>

            {/* برچسب مرحله */}
            <span
              className={`mt-2 text-sm font-medium ${
                isActive
                  ? "text-purple-700"
                  : isReached
                  ? "text-purple-500"
                  : isCompleted
                  ? "text-gray-800"
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
