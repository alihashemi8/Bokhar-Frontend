import { useState, useEffect } from "react";
import MobileModal from "../../basemodal/MobileModal";

export default function AddressModal({
  isOpen,
  onClose,
  onSubmit,
  plaque,
  setPlaque,
  unit,
  setUnit,
  address,
  title,
  setTitle,
}) {
  const [description, setDescription] = useState("");
  const [localPlaque, setLocalPlaque] = useState(plaque || "");
  const [localUnit, setLocalUnit] = useState(unit || "");
  const [localTitle, setLocalTitle] = useState(title || "");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalPlaque(plaque || "");
      setLocalUnit(unit || "");
      setLocalTitle(title || "");
      setDescription("");

      const id = setTimeout(() => setReady(true), 10);
      return () => {
        clearTimeout(id);
        setReady(false);
      };
    } else {
      setReady(false);
    }
  }, [isOpen, plaque, unit, title]);

  const isPlaqueValid = /^\d+$/.test(localPlaque);
  const isUnitValid = /^\d+$/.test(localUnit);
  const isFormValid = isPlaqueValid && isUnitValid;

  const handleSubmit = () => {
    if (!isFormValid) return;
    onSubmit({
      plaque: localPlaque,
      unit: localUnit,
      title: localTitle,
      description,
    });
    onClose();
  };

  if (!ready) return null;

  const inputBaseClasses =
    "border rounded-xl px-3 py-2 shadow-md font-bold focus:outline-none focus:ring-2 transition-all duration-300";

  return (
    <MobileModal isOpen={isOpen} onClose={onClose} title="📍 اطلاعات تکمیلی">
      {address && <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">{address}</p>}

      <div className="flex gap-4 justify-center mb-4">
        <input
          type="number"
          placeholder="پلاک"
          value={localPlaque}
          onChange={(e) => setLocalPlaque(e.target.value)}
          className={`${inputBaseClasses} w-[45%] bg-white/80 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
        />
        <input
          type="number"
          placeholder="واحد"
          value={localUnit}
          onChange={(e) => setLocalUnit(e.target.value)}
          className={`${inputBaseClasses} w-[45%] bg-white/80 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
        />
      </div>

      <div className="flex flex-col mb-4">
        <label className="text-xs text-gray-600 dark:text-gray-400 mb-1">عنوان آدرس</label>
        <input
          placeholder="مثلاً خانه، محل کار"
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          className={`${inputBaseClasses} bg-white/80 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
        />
      </div>

      <div className="flex flex-col mb-4">
        <label className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          توضیحات اضافی (اختیاری)
        </label>
        <textarea
          placeholder="مثلاً زنگ خراب است، طبقه دوم..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`${inputBaseClasses} bg-white/80 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 resize-none`}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isFormValid}
        className={`block mt-6 px-6 py-2 rounded-xl mx-auto text-gray-800 dark:text-white transition-all duration-300 font-bold ${
          isFormValid
            ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800 shadow-md shadow-indigo-300 hover:scale-105"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        ثبت اطلاعات
      </button>
    </MobileModal>
  );
}
