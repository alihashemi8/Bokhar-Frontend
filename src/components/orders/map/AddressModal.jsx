import { X } from "lucide-react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export default function AddressModal({
  open,
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
  const [show, setShow] = useState(open);

  useEffect(() => {
    if (open) setShow(true);
  }, [open]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 250); // زمان انیمیشن
  };

  const isPlaqueValid = /^\d+$/.test(plaque);
  const isUnitValid = /^\d+$/.test(unit);
  const isFormValid = isPlaqueValid && isUnitValid;

  const handleSubmit = () => {
    if (!isFormValid) return;
    onSubmit({ plaque, unit, title });
  };

  useEffect(() => {
    if (!show) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = originalOverflow; };
  }, [show]);

  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      dir="rtl"
      className="fixed inset-0 bg-black/40 z-50 flex justify-center items-end md:items-start md:justify-center"
      onClick={handleClose} // کلیک بیرون → بستن مودال
    >
      <div
        className="bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200
          rounded-t-3xl md:rounded-xl
          w-full md:w-[380px]
          max-h-[100vh]
          overflow-y-auto
          p-4
          animate-slide-up md:animate-fade-in
          md:mt-[290px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-lg font-semibold text-pink-500">📍 اطلاعات تکمیلی</h3>
            <p className="text-xs text-gray-600 mt-1">{address}</p>
          </div>
          <button onClick={handleClose}>
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        {/* inputs */}
        <div className="flex gap-4 mt-3 justify-center">
          <input
            type="number"
            placeholder="پلاک"
            value={plaque}
            onChange={(e) => setPlaque(e.target.value)}
            className="w-[45%] border rounded-xl px-3 py-2 bg-white"
          />
          <input
            type="number"
            placeholder="واحد"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-[45%] border rounded-xl px-3 py-2 bg-white"
          />
        </div>

        {/* title */}
        <div className="flex flex-col mt-4">
          <label className="text-xs text-gray-600 mb-1">
            برای ذخیره آدرس، عنوان آدرس را بنویسید
          </label>
          <input
            placeholder="عنوان آدرس"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-xl px-3 py-2 bg-white"
          />
        </div>

        {/* submit */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`block w-auto mt-5 p-2 rounded-xl mx-auto text-white transition ${
            isFormValid ? "bg-pink-500 hover:bg-pink-600" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          ثبت اطلاعات
        </button>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
