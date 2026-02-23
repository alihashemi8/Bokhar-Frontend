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
import { useProfile } from "../../context/ProfileContext";
import { useAuth } from "../../context/AuthContext";

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
          w-full p-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition
          bg-white dark:bg-sky-900/60 border-sky-300 dark:border-sky-700 text-gray-900 dark:text-white
          placeholder:text-gray-400 dark:placeholder:text-gray-300
        "
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

export default function SecurityPrivacy() {
  const navigate = useNavigate();
  const { editPassword } = useProfile();
  const { user, refreshUser } = useAuth(); // ← فرض می‌کنم refreshUser داری، اگر نداری باید اضافه کنی

  function getCSRFToken() {
    const match = document.cookie.match(/csrftoken=([\w-]+)/);
    return match ? match[1] : "";
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ مهم: با fallback برای undefined
  const hasPassword = Boolean(user?.has_password);

  // ✅ useMemo برای جلوگیری از محاسبه مجدد بی‌مورد
  const isPasswordFormValid = hasPassword
    ? password.current.trim() !== "" &&
      password.new.trim() !== "" &&
      password.confirm.trim() !== "" &&
      password.new === password.confirm &&
      password.new.length >= 6 // ← اضافه کردن حداقل طول رمز
    : password.new.trim() !== "" &&
      password.confirm.trim() !== "" &&
      password.new === password.confirm &&
      password.new.length >= 6;

  const API_BASE = import.meta.env.VITE_API_URL;

  const handlePasswordChange = async () => {
    // ✅ پاک کردن پیام‌های قبلی
    setError("");
    setSuccess("");

    if (!isPasswordFormValid) {
      setError(
        hasPassword
          ? "رمز فعلی و رمز جدید و تایید آن باید درست و غیر خالی باشند."
          : "رمز جدید و تایید آن باید مطابقت داشته باشند و حداقل ۶ کاراکتر باشند."
      );
      return;
    }

    setLoading(true);

    const csrfToken = getCSRFToken();

    const data = hasPassword
      ? {
          old_password: password.current,
          password: password.new,
          password2: password.confirm,
        }
      : {
          password: password.new,
          password2: password.confirm,
        };

    try {
      const res = await fetch(`${API_BASE}/edit/password/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result?.old_password?.[0] ||
            result?.password?.[0] ||
            result?.password2?.[0] ||
            result?.detail ||
            "خطای اعتبارسنجی"
        );
      }

      // ✅ موفقیت: پاک کردن فرم و نمایش پیام
      setSuccess("رمز عبور با موفقیت تغییر کرد!");
      setPassword({ current: "", new: "", confirm: "" });
      
      // ✅ مهم: آپدیت کردن state کاربر
      if (refreshUser) {
        await refreshUser(); // ← این has_password رو true می‌کنه
      }
      
      // اگر refreshUser نداری، می‌تونی مستقیم آپدیت کنی:
      // user.has_password = true; // ← فقط اگر mutable هست
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ دیباگ: برای بررسی مقدار has_password
  useEffect(() => {
    console.log("User:", user);
    console.log("has_password:", user?.has_password);
    console.log("hasPassword (processed):", hasPassword);
  }, [user]);

  const devices = [
    { id: 1, name: "iPhone 14", lastActive: "2 ساعت پیش", type: "mobile" },
    { id: 2, name: "MacBook Pro", lastActive: "1 روز پیش", type: "laptop" },
    {
      id: 3,
      name: "Windows Desktop",
      lastActive: "3 روز پیش",
      type: "desktop",
    },
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

          <button
            onClick={() => navigate("/customer-dashboard")}
            className="ms-auto w-10 h-10 rounded-full border shadow-sm hover:shadow-md
              bg-white/80 hover:bg-gray-200 border-sky-300 shadow-sky-200
               dark:bg-purple-800 dark:hover:bg-purple-900 dark:border-indigo-500 dark:shadow-indigo-500 flex items-center justify-center transition"
          >
            <ArrowLeft size={20} className="text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* تغییر/تنظیم رمز عبور */}
        <div className="bg-sky-50 dark:bg-gradient-to-br dark:from-sky-800 dark:via-sky-900 dark:to-sky-950 border border-sky-200 dark:border-sky-700 rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
          <div className="flex items-center gap-3 mb-5">
            <Lock className="text-blue-600" size={24} />
            <p className="font-medium text-gray-900 dark:text-gray-100 text-lg">
              {hasPassword ? "تغییر رمز عبور" : "تنظیم رمز عبور"}
            </p>
          </div>

          <div className="space-y-3">
            {error && (
              <p className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                {error}
              </p>
            )}
            
            {success && (
              <p className="text-green-500 text-sm font-medium bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                {success}
              </p>
            )}

            {hasPassword && (
              <PasswordInput
                placeholder="رمز فعلی"
                value={password.current}
                onChange={(e) =>
                  setPassword((prev) => ({ ...prev, current: e.target.value }))
                }
              />
            )}

            <PasswordInput
              placeholder="رمز جدید (حداقل ۶ کاراکتر)"
              value={password.new}
              onChange={(e) =>
                setPassword((prev) => ({ ...prev, new: e.target.value }))
              }
            />
            <PasswordInput
              placeholder="تایید رمز جدید"
              value={password.confirm}
              onChange={(e) =>
                setPassword((prev) => ({ ...prev, confirm: e.target.value }))
              }
            />

            <button
              onClick={handlePasswordChange}
              disabled={!isPasswordFormValid || loading}
              className={`w-full mt-3 rounded-xl p-3 font-medium transition disabled:opacity-50
                ${
                  isPasswordFormValid && !loading
                    ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-purple-700 dark:hover:bg-purple-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              {loading
                ? "در حال ارسال..."
                : hasPassword
                  ? "ذخیره تغییرات"
                  : "تنظیم رمز عبور"}
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