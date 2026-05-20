import { Smartphone, Monitor, Lock } from "lucide-react";

export default function SessionsSection() {

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
    <div className="bg-sky-50 dark:bg-gradient-to-br dark:from-sky-800 dark:via-sky-900 dark:to-sky-950 border border-sky-200 dark:border-sky-700 rounded-2xl shadow-lg p-5 hover:shadow-xl transition">

      <p className="font-medium text-gray-900 dark:text-gray-100 text-lg mb-5">
        دستگاه‌ها و نشست‌ها
      </p>

      <div className="space-y-4">
        {devices.map((d) => (
          <div
            key={d.id}
            className="flex justify-between items-center p-4 border rounded-xl
            hover:bg-sky-100 dark:hover:bg-sky-800 transition shadow-sm
            border-sky-200 dark:border-sky-700"
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
  );
}
