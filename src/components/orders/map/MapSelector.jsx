import { useState, useEffect, useRef } from "react";
import { Marker, Tooltip } from "react-leaflet";
import { toast } from "react-hot-toast";

import MapView from "./MapView";
import SearchLocation from "./SearchLocation";
import AddressModal from "./AddressModal";
import AddressDropdown from "./AddressDropdown";
import SavedAddressButtons from "./SavedAddressButtons";

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const historyLock = useRef(false);

  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: "home",
      title: "خانه",
      address: "تهران، خیابان آزادی، نبش کوچه 12",
      plaque: "12",
      unit: "3",
      description: "درب قهوه‌ای، زنگ سمت راست",
      coords: { lat: 35.6892, lng: 51.389 },
    },
    {
      id: "work",
      title: "محل کار",
      address: "تهران، ونک، خیابان ملاصدرا",
      plaque: "8",
      unit: "5",
      description: "طبقه دوم، واحد 5",
      coords: { lat: 35.757, lng: 51.409 },
    },
    {
      id: "parent",
      title: "خانه والدین",
      address: "تهران، صادقیه، کوچه مهر",
      plaque: "21",
      unit: "1",
      description: "",
      coords: { lat: 35.721, lng: 51.334 },
    },
  ]);

  // --- تابع حذف آدرس با Toast ---
  const handleDeleteAddress = (id) => {
    const item = savedAddresses.find((a) => a.id === id);
    if (!item) return;

    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-xs w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 flex flex-col gap-3 border border-gray-200 dark:border-gray-700`}
      >
        <p className="text-gray-800 dark:text-gray-200 text-sm md:text-base">
          آیا می‌خوای "{item.title}" حذف بشه؟
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            خیر
          </button>
          <button
            onClick={() => {
              setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
              toast.dismiss(t.id);
              toast.success("آدرس حذف شد!", {
                className: "bg-red-500 text-white rounded-lg shadow-lg px-4 py-2",
              });
            }}
            className="px-3 py-1 rounded-lg bg-red-500 text-white font-medium transition hover:bg-red-600"
          >
            بله
          </button>
        </div>
      </div>
    ));
  };

  // --- بررسی موبایل ---
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // --- تاریخچه مرورگر برای مودال موبایل ---
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
    setTitle(title);
    setDescription(description);

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
    goToNextStep?.();
  };

  const handleSelectSavedAddress = (item) => {
    setCoords(item.coords);
    setAddress(item.address);
    setPlaque(item.plaque);
    setUnit(item.unit);
    setTitle(item.title);
    setDescription(item.description || "");
    setOpen(true);
  };

  // --- دکمه Current Location ---
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("امکان دسترسی به موقعیت جغرافیایی وجود ندارد.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoords = { lat: latitude, lng: longitude };
        setCoords(newCoords);
        setAddress("موقعیت فعلی"); // بعداً می‌توان reverse geocoding اضافه کرد
        toast.success("موقعیت فعلی شما انتخاب شد!");
      },
      (err) => {
        toast.error("امکان دریافت موقعیت وجود ندارد یا کاربر اجازه نداد.");
        console.error(err);
      }
    );
  };

  const closeModalSafely = () => {
    if (open) window.history.back();
  };

  return (
    <div className="relative flex flex-col gap-5">
      <div
        className="relative rounded-2xl border border-sky-200 overflow-hidden
        shadow-md shadow-sky-300/50 z-0 w-[90%] md:w-[75%] mx-auto"
        style={{ height: "300px" }}
      >
        <MapView
          initialPosition={coords}
          onPositionChange={setCoords}
          onMarkerClick={() => setOpen(true)}
        >
          {savedAddresses.map((item) => (
            <Marker key={item.id} position={item.coords}>
              <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent>
                {item.title}
              </Tooltip>
            </Marker>
          ))}
        </MapView>

        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-11/12 z-[1000]">
          <SearchLocation
            onSelect={(loc) => {
              setCoords({ lat: loc.lat, lng: loc.lng });
              setAddress(loc.address);
            }}
          />
        </div>

        <SavedAddressButtons
          addresses={savedAddresses}
          onSelect={handleSelectSavedAddress}
          onDelete={handleDeleteAddress}
          onCurrentLocation={handleCurrentLocation} 
        />
      </div>


      <button
        onClick={() => setOpen(true)}
        className="w-[75%] mx-auto px-3 py-2 mb-20 md:mb-0 rounded-xl font-bold transition
        bg-sky-100 text-gray-700 border border-sky-300 shadow-md
        hover:bg-sky-200 
        dark:bg-gradient-to-r dark:from-purple-700 dark:to-purple-800
        dark:text-white dark:border-purple-700 dark:shadow-black/40
        dark:hover:from-purple-600 dark:hover:to-purple-700"
      >
        تایید موقعیت
      </button>

      {isMobile ? (
        <AddressModal
          isOpen={open}
          onClose={closeModalSafely}
          onSubmit={handleSubmit}
          plaque={plaque}
          unit={unit}
          address={address}
          title={title}
          description={description}
        />
      ) : (
        <AddressDropdown
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
          plaque={plaque}
          setPlaque={setPlaque}
          unit={unit}
          setUnit={setUnit}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          address={address}
          fullScreen
        />
      )}
    </div>
  );
}
