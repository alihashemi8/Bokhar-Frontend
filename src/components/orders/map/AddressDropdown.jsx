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
              : "bg-white p-5 rounded-xl shadow-2xl shadow-sky-400"
          }`}
        >
          <div
          dir="rtl"
            className={`${
              fullScreen
                ? "bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 w-full h-full flex flex-col shadow-md shadow-pink-300 border border-pink-200 rounded-2xl p-4"
                : "w-[360px]"
            }`}
          >
            {/* header */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-lg font-semibold text-pink-500">
                  اطلاعات تکمیلی
                </h3>
                <p className="text-xs text-gray-500 mt-1">{address}</p>
              </div>
              <button onClick={onClose}>
                <X size={20} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* input پلاک */}
            <div className="flex flex-col mt-3 mx-auto w-[75%] ">
              <input
                type="number"
                placeholder="پلاک"
                value={plaque}
                onChange={(e) => setPlaque(e.target.value)}
                className="w-full border-2 rounded-xl px-3 py-2 bg-sky-50 shadow-lg shadow-pink-300 border-pink-300"
              />
            </div>

            {/* input واحد */}
            <div className="flex flex-col mt-3 mx-auto w-[75%]">
              <input
                type="number"
                placeholder="واحد"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full border-2 rounded-xl px-3 py-2 bg-sky-50 shadow-lg shadow-pink-300 border-pink-300"
              />
            </div>

            {/* input عنوان آدرس */}
            <div className="flex flex-col mt-4 mx-auto w-[75%] ">
              <label className="text-xs text-gray-600 mb-1">
                برای ذخیره آدرس، عنوان آدرس را بنویسید
              </label>
              <input
                placeholder="عنوان آدرس"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-2 rounded-xl px-3 py-2 bg-sky-50 shadow-lg shadow-pink-300 border-pink-300"
              />
            </div>

            {/* submit */}
            <button
              onClick={onSubmit}
              className="mt-4 mx-auto w-[75%] bg-pink-500 border border-pink-500 shadow-lg shadow-pink-300 text-white rounded-xl py-2 hover:bg-pink-600"
            >
              ثبت اطلاعات
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
