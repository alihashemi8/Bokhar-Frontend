import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();

  return (
    <div dir="rtl" className="min-h-screen p-4 md:p-8">
      
      <div className="bg-white rounded-2xl shadow p-4 md:max-w-3xl md:mx-auto md:mt-15">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
            👤
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold">ویرایش پروفایل</p>
            <p className="text-sm text-gray-500">
              اطلاعات هویتی شما در این بخش نمایش داده می‌شود
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              نام و نام خانوادگی
            </label>
            <input
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="علی هاشمی"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              شماره موبایل
            </label>
            <input
              className="w-full p-3 border rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed"
              value="09*********"
              disabled
            />
            <p className="text-xs text-gray-400 mt-1">
              تغییر شماره موبایل فقط از طریق بخش «امنیت و حریم خصوصی» امکان‌پذیر است
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <button className="w-full bg-blue-600 text-white rounded-xl p-3 hover:bg-blue-700 transition">
            ذخیره تغییرات
          </button>

          <button
            onClick={() => navigate("/customer-dashboard")}
            className="w-full text-gray-500 hover:text-gray-700"
          >
            بازگشت
          </button>
        </div>
      </div>
    </div>
  );
}
