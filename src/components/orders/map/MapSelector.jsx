import { useState } from "react";
import MapView from "./MapView";
import SearchLocation from "./SearchLocation";
import AddressModal from "./AddressModal";
import AddressDropdown from "./AddressDropdown";

export default function MapSelector({
  initialPosition,
  initialAddress,
  onLocationSelect,
  goToNextStep, // اضافه شد: تابع رفتن به مرحله بعد
}) {
  const [coords, setCoords] = useState(initialPosition || null);
  const [address, setAddress] = useState(initialAddress || "");
  const [plaque, setPlaque] = useState("");
  const [unit, setUnit] = useState("");
  const [open, setOpen] = useState(false);

  const isMobile = window.innerWidth < 768;

  const handleSubmit = () => {
    if (!plaque || !unit) return;

    onLocationSelect({ coords, address, plaque, unit });
    setOpen(false);

    // رفتن مستقیم به مرحله بعد
    goToNextStep?.();
  };

  return (
    <div className="relative flex flex-col gap-5">
      {/* نقشه */}
      <div
        className="relative rounded-xl border border-pink-200 overflow-hidden shadow-md shadow-pink-300 z-0 w-[90%] md:w-[75%] mx-auto"
        style={{ height: "300px" }}
      >
        <MapView
          initialPosition={coords}
          onPositionChange={(pos) => setCoords(pos)}
          onMarkerClick={() => setOpen(true)}
        />

        {/* سرچ روی نقشه */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-11/12 md:w-3/4 z-500">
          <SearchLocation
            onSelect={(loc) => {
              setCoords({ lat: loc.lat, lng: loc.lng });
              setAddress(loc.address);
              // ❗ مودال باز نشود
            }}
          />
        </div>
      </div>

      {/* دکمه تایید موقعیت */}
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-2 bg-sky-100 border border-pink-300 text-gray-700 font-bold rounded-xl  
                   hover:bg-sky-200 hover:text-gray-800 shadow-md shadow-pink-300  
                   hover:shadow-pink-400 w-[75%] mx-auto"
      >
        تایید موقعیت
      </button>

      {/* موبایل → AddressModal */}
      {isMobile && (
        <AddressModal
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
          plaque={plaque}
          setPlaque={setPlaque}
          unit={unit}
          setUnit={setUnit}
          address={address}
        />
      )}

      {/* دسکتاپ → AddressDropdown */}
      {!isMobile && (
        <AddressDropdown
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
          plaque={plaque}
          setPlaque={setPlaque}
          unit={unit}
          setUnit={setUnit}
          address={address}
          fullScreen={true}
        />
      )}
    </div>
  );
}
