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
  const [isMobile, setIsMobile] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [description, setDescription] = useState("");

  /* ---------------- open / close ---------------- */
  useEffect(() => {
    if (open) setShow(true);
  }, [open]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 250);
  };

  /* ---------------- detect mobile ---------------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ---------------- lock scroll ---------------- */
  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [show]);

  /* ---------------- drag to close ---------------- */
  const handleDragStart = (e) => {
    if (!isMobile) return;

    const startY = e.touches[0].clientY;

    const move = (ev) => {
      const diff = ev.touches[0].clientY - startY;
      setDragY(Math.max(0, diff));
    };

    const end = () => {
      if (dragY > 120) handleClose();
      setDragY(0);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };

    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", end);
  };

  /* ---------------- validation ---------------- */
  const isPlaqueValid = /^\d+$/.test(plaque);
  const isUnitValid = /^\d+$/.test(unit);
  const isFormValid = isPlaqueValid && isUnitValid;

  const handleSubmit = () => {
    if (!isFormValid) return;
    onSubmit({ plaque, unit, title, description });
  };

  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      dir="rtl"
      className="fixed inset-0 bg-black/40 z-[9999] flex justify-center md:items-center backdrop-blur-[1px]"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleDragStart}
        style={{
          transform: `translateY(${dragY}px)`,
          transition: dragY === 0 ? "transform 0.25s ease-out" : "none",
        }}
        className={`
          bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200
          rounded-t-[32px] md:rounded-2xl
          w-full md:w-[380px]
          max-h-[90vh]
          mt-auto
          overflow-y-auto
          p-4
          shadow-[0_-8px_20px_rgba(0,0,0,0.15)]
          ${isMobile ? "animate-slide-up-ios" : "animate-fade-in"}
        `}
      >
        {/* Drag Handle */}
        <div className="w-12 h-1.5 bg-gray-300/70 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold text-pink-500">
              📍 اطلاعات تکمیلی
            </h3>
            <p className="text-xs text-gray-600 mt-1">{address}</p>
          </div>

          {!isMobile && (
            <button onClick={handleClose}>
              <X size={22} className="text-gray-500" />
            </button>
          )}
        </div>

        {/* Inputs */}
        <div className="flex gap-4 justify-center">
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

        {/* Title */}
        <div className="flex flex-col mt-6">
          <label className="text-xs text-gray-600 mb-1">
            عنوان آدرس
          </label>
          <input
            placeholder="مثلاً خانه، محل کار"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-xl px-3 py-2 bg-white"
          />
        </div>

        {/* Extra Description */}
        <div className="flex flex-col mt-4">
          <label className="text-xs text-gray-600 mb-1">
            توضیحات اضافی (اختیاری)
          </label>
          <textarea
            placeholder="مثلاً زنگ خراب است، طبقه دوم..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="border rounded-xl px-3 py-2 bg-white resize-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`block mt-6 px-6 py-2 rounded-xl mx-auto text-white transition ${
            isFormValid
              ? "bg-pink-500 hover:bg-pink-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          ثبت اطلاعات
        </button>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
