import { useState, useEffect, useRef } from "react";
import MapView from "./MapView";
import SearchLocation from "./SearchLocation";
import AddressModal from "./AddressModal";
import AddressDropdown from "./AddressDropdown";

export default function MapSelector({
  initialPosition,
  initialAddress,
  onLocationSelect,
  goToNextStep,
}) {
  const [coords, setCoords] = useState(initialPosition || null);
  const [address, setAddress] = useState(initialAddress || "");
  const [plaque, setPlaque] = useState("");
  const [unit, setUnit] = useState("");
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const historyLock = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    if (open && !historyLock.current) {
      window.history.pushState({ modal: true }, "");
      historyLock.current = true;
    }

    const onPopState = () => {
      if (open) {
        setOpen(false);
        historyLock.current = false;
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [open, isMobile]);

  const handleSubmit = ({ plaque, unit, title, description }) => {
    setPlaque(plaque);
    setUnit(unit);

    onLocationSelect({
      coords,
      address,
      plaque,
      unit,
      title,
      description,
    });

    setOpen(false);
    historyLock.current = false;

    goToNextStep?.(); // ✅ حتماً اجرا می‌شود
  };

  const closeModalSafely = () => {
    if (open) window.history.back();
  };

  return (
    <div className="relative flex flex-col gap-5">
      <div
        className="relative rounded-2xl border border-sky-200 overflow-hidden shadow-md shadow-sky-300/50 z-0 w-[90%] md:w-[75%] mx-auto"
        style={{ height: "300px" }}
      >
        <MapView
          initialPosition={coords}
          onPositionChange={(pos) => setCoords(pos)}
          onMarkerClick={() => setOpen(true)}
        />

        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-11/12 md:w-3/4 z-500">
          <SearchLocation
            onSelect={(loc) => {
              setCoords({ lat: loc.lat, lng: loc.lng });
              setAddress(loc.address);
            }}
          />
        </div>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="px-3 py-2 mb-20 md:mb-0 bg-sky-100 border border-sky-300 text-gray-700 font-bold rounded-xl hover:bg-sky-200 shadow-md w-[75%] mx-auto"
      >
        تایید موقعیت
      </button>

      {isMobile && (
        <AddressModal
          isOpen={open}
          onClose={closeModalSafely}
          onSubmit={handleSubmit}
          plaque={plaque}
          unit={unit}
          address={address}
          title=""
        />
      )}

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
          fullScreen
        />
      )}
    </div>
  );
}
