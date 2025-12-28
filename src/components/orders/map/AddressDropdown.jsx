import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddressDropdown({
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
  fullScreen = false,
  description,
  setDescription,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="dropdown"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`absolute inset-0 z-[600] ${
            fullScreen
              ? "w-[75%] m-auto -top-1"
              : "bg-white p-4 rounded-xl shadow-2xl shadow-sky-400"
          }`}
        >
          <div
            dir="rtl"
            className={`${
              fullScreen
                ? "bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 w-full h-full flex flex-col shadow-md shadow-sky-300 border border-sky-200 rounded-2xl p-3"
                : "w-[360px]"
            }`}
          >
            {/* header */}
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-md font-semibold text-sky-600">
                  اطلاعات تکمیلی
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{address}</p>
              </div>
              <button onClick={onClose}>
                <X size={20} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* پلاک و واحد روی یک سطر */}
            <div className="flex gap-2 mt-2 mx-auto w-[75%]">
              <input
                type="number"
                placeholder="پلاک"
                value={plaque}
                onChange={(e) => setPlaque(e.target.value)}
                className="flex-1 border-2 rounded-xl px-2 py-1.5 bg-sky-50 shadow-lg shadow-sky-300 border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
              />
              <input
                type="number"
                placeholder="واحد"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="flex-1 border-2 rounded-xl px-2 py-1.5 bg-sky-50 shadow-lg shadow-sky-300 border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
              />
            </div>

            {/* input عنوان آدرس */}
            <div className="flex flex-col mt-3 mx-auto w-[75%]">
              <label className="text-xs text-gray-600 mb-1">
                عنوان آدرس
              </label>
              <input
                placeholder="مثلاً خانه، محل کار"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-2 rounded-xl px-2 py-1.5 bg-sky-50 shadow-lg shadow-sky-300 border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
              />
            </div>

            {/* input توضیحات اختیاری */}
            <div className="flex flex-col mt-2 mx-auto w-[75%]">
              <label className="text-xs text-gray-600 mb-1">
                توضیحات اضافی (اختیاری)
              </label>
              <textarea
                placeholder="مثلاً زنگ خراب است، طبقه دوم..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full border-2 rounded-xl px-2 py-1.5 bg-sky-50 shadow-lg shadow-sky-300 border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none text-sm"
              />
            </div>

            {/* submit */}
            <button
              onClick={onSubmit}
              className="mt-3 mx-auto w-[75%] bg-sky-600 border border-sky-600 shadow-lg shadow-sky-300 text-white rounded-xl py-2 text-sm hover:bg-sky-700 transition"
            >
              ثبت اطلاعات
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
