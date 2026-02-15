import React, { useState, useRef } from "react";
import { FaTrash } from "react-icons/fa";
import { Locate } from "lucide-react";
export default function SavedAddressButtons({ addresses, onSelect, onDelete, onCurrentLocation }) {
  const [longPressId, setLongPressId] = useState(null);
  const [preventClick, setPreventClick] = useState(false);
  const timerRef = useRef(null);

  if (!addresses?.length && !onCurrentLocation) return null;

  const startPress = (id) => {
    setPreventClick(false);
    timerRef.current = setTimeout(() => {
      setLongPressId(id);
      setPreventClick(true);
    }, 1000); // 1000ms برای Long Press
  };

  const endPress = () => {
    clearTimeout(timerRef.current);
  };

  const handleDelete = (item) => {
    if (onDelete) onDelete(item.id);
    setLongPressId(null);
  };

  return (
    <div
      className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] w-[95%] flex items-center gap-3 overflow-x-auto px-2"
    >
   {/* دکمه Current Location همیشه جدا سمت چپ */}
{onCurrentLocation && (
  <div className="shrink-0 mr-2">
    <button
      onClick={onCurrentLocation}
      className="
        w-9 h-9 rounded-full transition-colors flex items-center justify-center shadow-md
        bg-white/40 text-sky-600 hover:bg-white hover:text-sky-600 text-shadow-2xl
        dark:bg-white/70 dark:text-purple-800 dark:hover:bg-white/90 dark:hover:text-purple-900
      "
    >
      <Locate className="w-4.5 h-4.5 md:w-6 md:h-6" />
    </button>
  </div>
)}


      {/* دکمه‌های Saved Addresses پشت سر هم */}
      <div className="flex gap-2 ml-auto">
        {addresses?.slice(0, 3).map((item) => {
          const isLongPress = longPressId === item.id;

          return (
            <div
              key={item.id}
              className="relative shrink-0"
              onMouseDown={() => startPress(item.id)}
              onMouseUp={endPress}
              onMouseLeave={endPress}
              onTouchStart={() => startPress(item.id)}
              onTouchEnd={endPress}
            >
              <button
                onClick={() => {
                  if (!preventClick) onSelect(item);
                }}
                className={`
                  rounded-2xl backdrop-blur border px-2 py-1 text-right shadow-sm transition
                  text-[11px] md:text-sm md:px-3 md:py-2
                  ${isLongPress ? "bg-red-100 border-red-400" : " bg-white/40 text-sky-600 hover:bg-white hover:text-sky-600 text-shadow-2xl dark:bg-white/70 dark:text-purple-800 dark:hover:bg-white/90 dark:hover:text-purple-900"}
                  hover:bg-sky-100
                `}
              >
                {item.title}
              </button>

              {isLongPress && (
                <button
                  onClick={() => handleDelete(item)}
                  className="absolute -left-3 -top-1 text-red-600 p-1 bg-white rounded-full shadow-md z-50"
                >
                  <FaTrash size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
