import { useState, useEffect } from "react";

export default function ServicesModal({ onClose, onSave, editItem, categories }) {
  const [form, setForm] = useState({
    title: "",
    category: categories[0] || "",
    materialPrices: {},
    sizeType: "",
    singlePrice: "",
    doublePrice: "",
    meter: { width: "", height: "" },
    pricePerMeter: ""
  });

  const materials = ["چرم", "مخمل", "نخی", "کتان"];

  // همگام‌سازی فرم با editItem هنگام باز شدن مودال
  useEffect(() => {
    setForm(
      editItem || {
        title: "",
        category: categories[0] || "",
        materialPrices: {},
        sizeType: "",
        singlePrice: "",
        doublePrice: "",
        meter: { width: "", height: "" },
        pricePerMeter: ""
      }
    );
  }, [editItem, categories]);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleMaterialPrice = (mat, value) => {
    setForm((f) => ({
      ...f,
      materialPrices: { ...f.materialPrices, [mat]: value }
    }));
  };

  const submit = () => {
    let finalPrice = 0;

    if (form.sizeType === "singleDouble") {
      finalPrice = Number(form.singlePrice) || 0;
    } else if (form.sizeType === "meter") {
      finalPrice =
        (Number(form.pricePerMeter) || 0) *
        (Number(form.meter.width) || 0) *
        (Number(form.meter.height) || 0);
    }

    onSave({
      ...form,
      basePrice: finalPrice,
      finalArea:
        form.sizeType === "meter"
          ? (Number(form.meter.width) || 0) * (Number(form.meter.height) || 0)
          : null,
      status: "active"
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-end sm:items-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="
          bg-white dark:bg-gray-800 p-6 rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-xl
          overflow-y-auto max-h-[90vh] relative
        "
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute left-4 top-4 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-5 text-right">افزودن / ویرایش سرویس</h2>

        <div className="space-y-5 text-right">
          {/* عنوان */}
          <input
            name="title"
            value={form.title}
            onChange={change}
            placeholder="عنوان سرویس"
            className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700"
          />

          {/* دسته‌بندی */}
          <select
            name="category"
            value={form.category}
            onChange={change}
            className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* جنس‌ها */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl space-y-4">
            <p className="font-bold">جنس (نمایش input بعد از کلیک)</p>
            <div className="space-y-3">
              {materials.map((mat) => {
                const active = form.materialPrices[mat] !== undefined;

                return (
                  <div key={mat} className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setForm((f) => ({
                          ...f,
                          materialPrices: active
                            ? (() => {
                                const copy = { ...f.materialPrices };
                                delete copy[mat];
                                return copy;
                              })()
                            : { ...f.materialPrices, [mat]: "" }
                        }));
                      }}
                      className={`px-3 py-2 rounded-xl border
                        ${active ? "bg-purple-600 text-white" : "bg-white dark:bg-gray-600"}
                      `}
                    >
                      {mat}
                    </button>

                    {active && (
                      <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={form.materialPrices[mat]}
                        onChange={(e) => handleMaterialPrice(mat, e.target.value)}
                        placeholder="قیمت"
                        className="flex-1 p-2 rounded-xl bg-white dark:bg-gray-600 text-left"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* نوع ابعاد */}
          <div className="space-y-3">
            <p className="font-bold">ابعاد</p>
            <select
              name="sizeType"
              value={form.sizeType}
              onChange={change}
              className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700"
            >
              <option value="">نوع ابعاد را انتخاب کنید</option>
              <option value="singleDouble">تک نفره / دو نفره</option>
              <option value="meter">متراژی (متر مربع)</option>
            </select>

            {form.sizeType === "singleDouble" && (
              <div className="space-y-2">
                <input
                  type="number"
                  name="singlePrice"
                  value={form.singlePrice}
                  onChange={change}
                  placeholder="قیمت تک نفره"
                  className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700"
                />
                <input
                  type="number"
                  name="doublePrice"
                  value={form.doublePrice}
                  onChange={change}
                  placeholder="قیمت دو نفره"
                  className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700"
                />
              </div>
            )}

            {form.sizeType === "meter" && (
              <div className="space-y-2">
                <input
                  type="number"
                  name="meter.width"
                  value={form.meter.width}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      meter: { ...f.meter, width: e.target.value }
                    }))
                  }
                  placeholder="عرض (متر)"
                  className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700"
                />
                <input
                  type="number"
                  name="meter.height"
                  value={form.meter.height}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      meter: { ...f.meter, height: e.target.value }
                    }))
                  }
                  placeholder="ارتفاع (متر)"
                  className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700"
                />
                <input
                  type="number"
                  name="pricePerMeter"
                  value={form.pricePerMeter}
                  onChange={change}
                  placeholder="قیمت هر متر مربع"
                  className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700"
                />
              </div>
            )}
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-300 dark:bg-gray-700"
          >
            انصراف
          </button>

          <button
            onClick={submit}
            className="px-6 py-2 rounded-xl bg-purple-600 text-white"
          >
            ذخیره
          </button>
        </div>
      </div>
    </div>
  );
}
