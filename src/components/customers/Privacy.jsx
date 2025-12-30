import { Lock, Eye, EyeOff, Smartphone, Monitor, ArrowRight } from "lucide-react";
import { useState } from "react";
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
        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute top-3 left-3 text-gray-500 hover:text-gray-700"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

// صفحه اصلی امنیت و حریم خصوصی
export default function SecurityPrivacy() {
  const navigate = useNavigate();

  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [otpEnabled, setOtpEnabled] = useState(true);

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
        return <Monitor size={22} className="text-purple-500" />;
      case "desktop":
        return <Monitor size={22} className="text-green-500" />;
      default:
        return <Lock size={22} className="text-gray-500" />;
    }
  };

  return (
    <div dir="rtl" className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="md:max-w-3xl md:mx-auto space-y-6 md:mt-15 mb-20 md:mb-0">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Lock className="text-blue-600" size={26} />
          <p className="font-semibold text-lg text-gray-800">امنیت و حریم خصوصی</p>

          {/* Back Button */}
          <button
            onClick={() => navigate("/customer-dashboard")}
            className="ms-auto w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 flex items-center justify-center"
          >
            <ArrowRight size={20} className="text-gray-700" />
          </button>
        </div>

        {/* تغییر رمز عبور */}
        <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
          <div className="flex items-center gap-3 mb-5">
            <Lock className="text-blue-600" size={24} />
            <p className="font-medium text-gray-800 text-lg">تغییر رمز عبور</p>
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
            <button
              onClick={handlePasswordChange}
              className="w-full mt-3 bg-blue-600 text-white rounded-xl p-3 hover:bg-blue-700 transition font-medium"
            >
              ذخیره تغییرات
            </button>
          </div>
        </div>

        {/* مدیریت دستگاه‌ها */}
        <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
          <p className="font-medium text-gray-800 text-lg mb-5">
            دستگاه‌ها و نشست‌ها
          </p>

          <div className="space-y-4">
            {devices.map((d) => (
              <div
                key={d.id}
                className="flex justify-between items-center p-4 border rounded-xl hover:bg-gray-50 transition shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {getDeviceIcon(d.type)}
                  <div>
                    <p className="font-medium text-gray-700">{d.name}</p>
                    <p className="text-sm text-gray-500">{d.lastActive}</p>
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
