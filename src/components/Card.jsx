import { useState, useEffect } from "react";

export default function Card({ image, title, basePrice, options }) {
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const defaults = {};
    options.forEach((opt) => {
      if (opt.type === "select") {
        defaults[opt.key] = opt.choices[0].value;
      }
    });
    return defaults;
  });

  const [added, setAdded] = useState(false);

  const toggleOption = (key) => {
    setSelectedOptions((prev) => {
      const newState = { ...prev };
      if (prev[key]) {
        delete newState[key];
      } else {
        newState[key] = true;
      }

      if (key === "wash") {
        if (newState["wash"]) {
          newState["iron"] = true;
        }
      }

      return newState;
    });
  };

  const handleSelectChange = (key, value) => {
    setSelectedOptions((prev) => ({ ...prev, [key]: value }));
  };

  const totalPrice =
    basePrice +
    options.reduce((sum, opt) => {
      if (opt.type === "checkbox" && selectedOptions[opt.key]) {
        return sum + opt.price;
      }
      if (opt.type === "select" && selectedOptions[opt.key]) {
        const choice = opt.choices.find(
          (c) => c.value === selectedOptions[opt.key]
        );
        return sum + (choice?.price || 0);
      }
      return sum;
    }, 0);

  const addToCart = () => setAdded((prev) => !prev);

  return (
    <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col">
      {/* تصویر */}
      <div className="w-full h-56 flex items-center justify-center bg-gray-300 dark:bg-gray-700">
        <img
          src={image}
          alt={title}
          className="max-h-full max-w-full object-contain p-2"
        />
      </div>

      {/* محتوا */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold mb-4 text-center">{title}</h3>

        {/* چک‌باکس‌ها */}
        <div className="flex flex-col items-start gap-2 mb-4 flex-1">
          {options
            .filter((opt) => opt.type === "checkbox")
            .map((opt) => (
              <label
                key={opt.key}
                className="flex items-center gap-2 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={!!selectedOptions[opt.key]}
                  onChange={() => toggleOption(opt.key)}
                  className="w-4 h-4 accent-amber-500"
                />
                {opt.label} (+{opt.price.toLocaleString()} تومان)
              </label>
            ))}
        </div>

        {/* select‌ها */}
        <div className="flex flex-col gap-2 mb-4">
          {options
            .filter((opt) => opt.type === "select")
            .map((opt) => (
              <div key={opt.key} className="flex flex-col items-start">
                <label className="text-sm mb-1">{opt.label}</label>
                <select
                  value={selectedOptions[opt.key]}
                  onChange={(e) => handleSelectChange(opt.key, e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {opt.choices.map((choice) => (
                    <option key={choice.value} value={choice.value}>
                      {choice.label}{" "}
                      {choice.price > 0
                        ? `(+${choice.price.toLocaleString()})`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>
            ))}
        </div>

        {/* footer ثابت */}
        <div className="mt-auto">
          <p className="text-lg font-semibold text-center text-amber-500 mb-2">
            {totalPrice.toLocaleString()} تومان
          </p>
          <button
            onClick={addToCart}
            className={`w-full font-medium py-2 rounded-lg transition
            ${added ? "bg-amber-500 text-white" : "bg-gray-500 text-white hover:bg-gray-600"}`}
          >
            {added ? "افزوده شد" : "افزودن به سبد"}
          </button>
        </div>
      </div>
    </div>
  );
}
