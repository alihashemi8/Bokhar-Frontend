export default function AddressForm({
  address,
  formData,
  setFormData,
  onSave,
  disableSave
}) {
  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 space-y-3 text-sm sm:text-base transition-all">
      <div className="text-gray-700 dark:text-gray-200 text-sm">
        <p className="font-semibold mb-1">آدرس انتخاب‌شده:</p>
        <p className="leading-relaxed text-purple-600 dark:text-purple-400">
          {address || "—"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">
            پلاک<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="plaque"
            placeholder="مثلاً ۱۲"
            value={formData.plaque}
            onChange={handleNumberInput}
            className="p-2 border rounded-lg text-sm w-full dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">
            واحد<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="unit"
            placeholder="مثلاً ۳"
            value={formData.unit}
            onChange={handleNumberInput}
            className="p-2 border rounded-lg text-sm w-full dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <textarea
        placeholder="توضیحات اضافه (اختیاری)"
        value={formData.note}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, note: e.target.value }))
        }
        className="w-full p-2 border rounded-lg text-sm dark:bg-gray-700 dark:text-white"
      />
      <div className="col-span-2">
        <label className="text-sm text-gray-600 dark:text-gray-300">
          عنوان آدرس<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          placeholder="مثلاً خانه، محل کار..."
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="p-2 border rounded-lg text-sm w-full dark:bg-gray-700 dark:text-white"
        />
      </div>
<button
  onClick={onSave}
  className={`px-4 py-2 rounded-xl transition ${
    disableSave
      ? "bg-gray-300 cursor-not-allowed"
      : "bg-green-600 text-white hover:bg-green-700"
  }`}
  disabled={disableSave}
>
  ذخیره آدرس
</button>

    </div>
  );
}
