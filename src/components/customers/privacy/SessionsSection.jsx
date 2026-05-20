import { Smartphone, Monitor, Lock, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function SessionsSection() {
  const devices = [
    { id: 1, name: "iPhone 14", lastActive: "2 ساعت پیش", type: "mobile", current: true },
    { id: 2, name: "MacBook Pro", lastActive: "1 روز پیش", type: "laptop" },
    { id: 3, name: "Windows Desktop", lastActive: "3 روز پیش", type: "desktop" },
  ];

  const getDeviceIcon = (type) => {
    switch (type) {
      case "mobile":
        return <Smartphone size={20} className="text-blue-600 dark:text-blue-400" />;
      case "laptop":
      case "desktop":
        return <Monitor size={20} className="text-purple-600 dark:text-purple-400" />;
      default:
        return <Lock size={20} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  const getDeviceColor = (type) => {
    switch (type) {
      case "mobile":
        return "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400";
      case "laptop":
      case "desktop":
        return "bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400";
      default:
        return "bg-gray-500/10 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="relative overflow-hidden">
        {/* Ambient Glow Background - هماهنگ با PasswordSection */}
        <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-blue-500/20 blur-2xl rounded-2xl opacity-50" />
        
        {/* Card Body */}
        <div className="relative bg-sky-50 dark:bg-gray-900/40 border border-white/20 dark:border-white/10 rounded-2xl shadow-xl shadow-black/5">
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Header - هماهنگ با PasswordSection */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200/30 dark:border-white/5">
              <div className="p-2 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg">
                <Smartphone className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  دستگاه‌ها و نشست‌ها
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  مدیریت دستگاه‌های متصل به حساب کاربری
                </p>
              </div>
            </div>

            {/* Devices List */}
            <div className="space-y-3">
              {devices.map((d, index) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group flex justify-between items-center p-4 rounded-xl
                    bg-white/50 dark:bg-black/20 border border-gray-200/50 dark:border-gray-700/50
                    hover:bg-white/70 dark:hover:bg-white/30 transition-all duration-200
                    backdrop-blur-sm ${d.current ? 'ring-1 ring-blue-500/20 dark:ring-blue-400/20' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${getDeviceColor(d.type)} transition-transform group-hover:scale-105`}>
                      {getDeviceIcon(d.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {d.name}
                        </p>
                        {d.current && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                            فعال
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {d.lastActive}
                      </p>
                    </div>
                  </div>

                  <button 
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 
                      text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 
                      transition-colors flex items-center gap-1.5 opacity-0 group-hover:opacity-100 
                      focus:opacity-100"
                    title="خروج از دستگاه"
                  >
                    <LogOut size={14} />
                    خروج
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Logout All Button */}
            <div className="pt-4 border-t border-gray-200/30 dark:border-white/5">
              <button className="w-full py-3 px-4 rounded-xl text-sm font-medium 
                text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 
                bg-white/30 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-900/10 
                border border-gray-200/50 dark:border-gray-700/50 hover:border-red-200 dark:hover:border-red-800
                transition-all duration-200 flex items-center justify-center gap-2 group">
                <LogOut size={16} className="transition-transform group-hover:translate-x-1" />
                خروج از تمام دستگاه‌ها
              </button>
            </div>

            {/* Security Note */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200/30 dark:border-blue-500/20">
              <Lock size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                در صورت مشاهده دستگاه ناشناس، سریعاً آن را حذف کرده و رمز عبور خود را تغییر دهید.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
