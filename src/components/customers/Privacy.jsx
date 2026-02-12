import {
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// کامپوننت مستقل برای فیلد رمز با آیکن چشم
function PasswordInput({ placeholder, value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition
          bg-white dark:bg-sky-900/60 border-sky-300 dark:border-sky-700 text-gray-900 dark:text-white
          placeholder:text-gray-400 dark:placeholder:text-gray-300
        "
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute top-3 left-3 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

// صفحه اصلی امنیت و حریم خصوصی
export default function SecurityPrivacy() {
  const navigate = useNavigate();

  // اسکرول به بالای صفحه
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const isPasswordFormValid =
    password.current.trim() !== "" &&
    password.new.trim() !== "" &&
    password.confirm.trim() !== "";

  const handlePasswordChange = () => {
    alert("رمز عبور با موفقیت تغییر کرد!");
    setPassword({ current: "", new: "", confirm: "" });
  };

  const devices = [
    { id: 1, name: "iPhone 14", lastActive: "2 ساعت پیش", type: "mobile" },
    { id: 2, name: "MacBook Pro", lastActive: "1 روز پیش", type: "laptop" },
    { id: 3, name: "Windows Desktop", lastActive: "3 روز پیش", type: "desktop" },
  ];

  const getDeviceIcon = (type) => {
    switch (type) {
      case "mobile":
        return <Smartphone size={22} className="text-blue-500" />;
      case "laptop":
      case "desktop":
        return <Monitor size={22} className="text-purple-500" />;
      default:
        return <Lock size={22} className="text-gray-500" />;
    }
  };

  return (
    <div dir="rtl" className="min-h-screen p-4 md:p-8">
      <div className="md:max-w-3xl md:mx-auto space-y-6 md:mt-16 mb-20 md:mb-0">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Lock className="text-blue-600" size={26} />
          <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
            امنیت و حریم خصوصی
          </p>

          {/* Back Button */}
          <button
            onClick={() => navigate("/customer-dashboard")}
            className="ms-auto w-10 h-10 rounded-full border shadow-sm hover:shadow-md
              bg-white/80 hover:bg-gray-200 border-sky-300 shadow-sky-200
               dark:bg-purple-800 dark:hover:bg-purple-900 dark:border-indigo-500 dark:shadow-indigo-500 flex items-center justify-center transition"
          >
            <ArrowLeft size={20} className="text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* تغییر رمز عبور */}
        <div className="bg-sky-50 dark:bg-gradient-to-br dark:from-sky-800 dark:via-sky-900 dark:to-sky-950 border border-sky-200 dark:border-sky-700 rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
          <div className="flex items-center gap-3 mb-5">
            <Lock className="text-blue-600" size={24} />
            <p className="font-medium text-gray-900 dark:text-gray-100 text-lg">
              تغییر رمز عبور
            </p>
          </div>

          <div className="space-y-3">
            <PasswordInput
              placeholder="رمز فعلی"
              value={password.current}
              onChange={(e) =>
                setPassword({ ...password, current: e.target.value })
              }
            />
            <PasswordInput
              placeholder="رمز جدید"
              value={password.new}
              onChange={(e) =>
                setPassword({ ...password, new: e.target.value })
              }
            />
            <PasswordInput
              placeholder="تایید رمز جدید"
              value={password.confirm}
              onChange={(e) =>
                setPassword({ ...password, confirm: e.target.value })
              }
            />

            {/* دکمه ذخیره */}
            <button
              onClick={handlePasswordChange}
              disabled={!isPasswordFormValid}
              className={`w-full mt-3 rounded-xl p-3 font-medium transition
                ${
                  isPasswordFormValid
                    ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-purple-700 dark:hover:bg-purple-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              ذخیره تغییرات
            </button>
          </div>
        </div>

        {/* مدیریت دستگاه‌ها */}
        <div className="bg-sky-50 dark:bg-gradient-to-br dark:from-sky-800 dark:via-sky-900 dark:to-sky-950 border border-sky-200 dark:border-sky-700 rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
          <p className="font-medium text-gray-900 dark:text-gray-100 text-lg mb-5">
            دستگاه‌ها و نشست‌ها
          </p>

          <div className="space-y-4">
            {devices.map((d) => (
              <div
                key={d.id}
                className="
                  flex justify-between items-center p-4 border rounded-xl hover:bg-sky-100 dark:hover:bg-sky-800 transition shadow-sm
                  border-sky-200 dark:border-sky-700
                "
              >
                <div className="flex items-center gap-3">
                  {getDeviceIcon(d.type)}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {d.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {d.lastActive}
                    </p>
                  </div>
                </div>
                <button className="text-red-500 text-sm hover:underline">
                  خروج
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
