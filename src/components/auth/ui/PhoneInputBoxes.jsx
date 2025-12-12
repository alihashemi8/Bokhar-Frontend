import { useRef } from "react";

export default function PhoneInputBoxes({ value, onChange }) {
  const inputsRef = useRef([]);

  // شماره باید همیشه با "09" شروع شود
  const normalized = value.startsWith("09") ? value.slice(2) : value;
  const digits = normalized.split("");

  // فقط 9 رقم بعد از 09
  const fullDigits = Array.from({ length: 9 }, (_, i) => digits[i] || "");

  const handleChange = (index, val) => {
    if (!/^\d?$/.test(val)) return;

    const newDigits = [...fullDigits];
    newDigits[index] = val;
    onChange("09" + newDigits.join(""));

    if (val && index < 8) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (fullDigits[index] === "" && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div dir="ltr" className="flex justify-center items-center gap-1 max-w-xs mx-auto">

      <div className="flex gap-1">
        <div className="w-6 h-10 border-b-2 border-gray-400 flex items-center justify-center text-gray-600 font-semibold">
          0
        </div>
        <div className="w-6 h-10 border-b-2 border-gray-400 flex items-center justify-center text-gray-600 font-semibold">
          9
        </div>
      </div>

      {/* 9 رقم ورودی */}
      {fullDigits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-6 h-10 text-center border-b-2 border-gray-400 focus:border-blue-500 outline-none bg-transparent text-gray-800 dark:text-gray-100"
        />
      ))}
    </div>
  );
}
