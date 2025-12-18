import { useState } from "react";
import toast from "react-hot-toast";
import { finalizeRegister } from "../../../api/apiClient"; 

export default function RegisterFinalForm({ phone, onSuccess }) {
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  if (loading) return;

  if (!fullname.trim()) {
    return toast.error("نام و نام خانوادگی الزامی است");
  }

  if (password.length < 6) {
    return toast.error("رمز عبور باید حداقل 6 کاراکتر باشد");
  }

  setLoading(true);
  try {
    const res = await finalizeRegister(phone, fullname, password);

    if (!res?.ok) throw new Error(res?.message || "ثبت‌نام با خطا مواجه شد");

    toast.success("ثبت‌نام موفق ✅");
    onSuccess();
  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto p-2 sm:p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
        تکمیل ثبت‌نام
      </h2>

      <input
        value={fullname}
        onChange={(e) => setFullname(e.target.value)}
        placeholder="نام و نام خانوادگی"
        className="w-full border-b p-2 mb-4 bg-transparent text-gray-800 dark:text-gray-100 focus:border-blue-500 outline-none"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="رمز عبور"
        className="w-full border-b p-2 mb-4 bg-transparent text-gray-800 dark:text-gray-100 focus:border-blue-500 outline-none"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-3 mt-4 rounded-xl text-white font-medium flex justify-center items-center gap-2 ${
          loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
        {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
      </button>
    </div>
  );
}
