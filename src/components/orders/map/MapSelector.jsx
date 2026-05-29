import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

import { toast } from "react-hot-toast";

import {
  LocateFixed,
  Home,
  BriefcaseBusiness,
  MapPin,
  ChevronRight,
} from "lucide-react";

import MapView from "./MapView";
import SearchLocation from "./SearchLocation";
import AddressModal from "./AddressModal";

export default function MapSelector({
  initialPosition,
  initialAddress,
  onLocationSelect,
  goToNextStep,
}) {
  // ---------------- STATE ----------------

  const [coords, setCoords] = useState(
    initialPosition || {
      lat: 35.6892,
      lng: 51.389,
    }
  );

  const [address, setAddress] = useState(
    initialAddress || ""
  );

  const [loadingAddress, setLoadingAddress] =
    useState(false);

  const [plaque, setPlaque] = useState("");
  const [unit, setUnit] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [open, setOpen] = useState(false);

  const historyLock = useRef(false);

  // ---------------- SAVED ADDRESSES ----------------

  const savedAddresses = useMemo(
    () => [
      {
        id: 1,
        title: "خانه",
        icon: Home,

        address: "تهران، آزادی",

        plaque: "12",
        unit: "3",

        coords: {
          lat: 35.6892,
          lng: 51.389,
        },
      },

      {
        id: 2,
        title: "محل کار",
        icon: BriefcaseBusiness,

        address: "تهران، ونک",

        plaque: "8",
        unit: "1",

        coords: {
          lat: 35.757,
          lng: 51.409,
        },
      },
    ],
    []
  );

  // ---------------- REVERSE GEOCODE ----------------

  useEffect(() => {
    if (!coords) return;

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        setLoadingAddress(true);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`,
          {
            signal: controller.signal,
          }
        );

        const data = await res.json();

        setAddress(
          data.display_name || "آدرس پیدا نشد"
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      } finally {
        setLoadingAddress(false);
      }
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [coords]);

  // ---------------- CURRENT LOCATION ----------------

  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("موقعیت جغرافیایی پشتیبانی نمی‌شود");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        toast.success("موقعیت فعلی انتخاب شد");
      },

      () => {
        toast.error(
          "دسترسی به موقعیت مکانی رد شد"
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, []);

  // ---------------- SELECT SAVED ----------------

  const handleSelectSaved = useCallback((item) => {
    setCoords(item.coords);

    setAddress(item.address);

    setPlaque(item.plaque);

    setUnit(item.unit);

    setTitle(item.title);
  }, []);

  // ---------------- SUBMIT ----------------

  const handleSubmit = useCallback(
    ({
      plaque,
      unit,
      title,
      description,
    }) => {
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

      goToNextStep?.();
    },

    [
      coords,
      address,
      onLocationSelect,
      goToNextStep,
    ]
  );

  // ---------------- BACK BUTTON ----------------

  useEffect(() => {
    if (open && !historyLock.current) {
      window.history.pushState(
        { modal: true },
        ""
      );

      historyLock.current = true;
    }

    const onPopState = () => {
      if (open) {
        setOpen(false);

        historyLock.current = false;
      }
    };

    window.addEventListener(
      "popstate",
      onPopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        onPopState
      );
    };
  }, [open]);

  // ---------------- RENDER ----------------

  return (
    <div
      className="
      fixed
      inset-0

      z-50

      overflow-hidden

      bg-white
      dark:bg-zinc-950
    "
    >
      {/* MAP */}
      <MapView
        position={coords}
        onPositionChange={setCoords}
      />

      {/* TOP OVERLAY */}
      <div
        className="
        absolute
        inset-x-0
        top-0

        z-[1000]

        px-4
        pt-[max(env(safe-area-inset-top),20px)]

        pointer-events-none
      "
      >
        {/* SEARCH */}
        <div className="pointer-events-auto">
          <SearchLocation
            onSelect={(loc) => {
              setCoords({
                lat: loc.lat,
                lng: loc.lng,
              });

              setAddress(loc.address);
            }}
          />
        </div>
      </div>

      {/* LOCATION BUTTON */}
      <button
        onClick={handleCurrentLocation}
        className="
        absolute

        left-4
        bottom-[240px]

        z-[1000]

        flex
        items-center
        justify-center

        w-14
        h-14

        rounded-2xl

        bg-white/95
        dark:bg-zinc-900/95

        backdrop-blur-xl

        shadow-2xl

        border
        border-white/30
        dark:border-zinc-700

        active:scale-95

        transition
      "
      >
        <LocateFixed
          size={22}
          className="
            text-sky-500
          "
        />
      </button>

      {/* SAVED ADDRESSES */}
      <div
        className="
        absolute

        inset-x-0
        bottom-[165px]

        z-[1000]

        flex
        gap-3

        overflow-x-auto

        px-4

        no-scrollbar
      "
      >
        {savedAddresses.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() =>
                handleSelectSaved(item)
              }
              className="
              shrink-0

              flex
              items-center
              gap-2

              h-12

              px-5

              rounded-2xl

              bg-white/95
              dark:bg-zinc-900/95

              backdrop-blur-xl

              border
              border-white/30
              dark:border-zinc-700

              shadow-xl

              active:scale-95

              transition
            "
            >
              <Icon
                size={18}
                className="text-sky-500"
              />

              <span
                className="
                text-sm
                font-bold
              "
              >
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* BOTTOM SHEET */}
      <div
        className="
        absolute

        bottom-0
        inset-x-0

        z-[1000]

        rounded-t-[34px]

        bg-white/95
        dark:bg-zinc-950/95

        backdrop-blur-2xl

        border-t
        border-white/20
        dark:border-zinc-800

        shadow-[0_-20px_60px_rgba(0,0,0,.18)]

        px-5
        pt-4
        pb-[calc(env(safe-area-inset-bottom)+18px)]
      "
      >
        {/* HANDLE */}
        <div
          className="
          w-14
          h-1.5

          rounded-full

          bg-gray-300
          dark:bg-zinc-700

          mx-auto
          mb-5
        "
        />

        {/* TITLE */}
        <div
          className="
          flex
          items-center
          justify-between

          mb-3
        "
        >
          <div className="flex items-center gap-2">
            <MapPin
              size={18}
              className="text-sky-500"
            />

            <span
              className="
              text-sm
              font-bold
            "
            >
              آدرس انتخاب شده
            </span>
          </div>

          <button
            className="
            flex
            items-center
            gap-1

            text-xs
            text-sky-500

            font-bold
          "
          >
            ویرایش
            <ChevronRight size={14} />
          </button>
        </div>

        {/* ADDRESS */}
        <div
          className="
          rounded-2xl

          bg-gray-100/80
          dark:bg-zinc-900

          p-4

          min-h-[88px]

          mb-4
        "
        >
          {loadingAddress ? (
            <div className="space-y-2 animate-pulse">
              <div
                className="
                h-3
                rounded-full
                bg-gray-300
                dark:bg-zinc-700
              "
              />

              <div
                className="
                h-3
                w-[80%]

                rounded-full

                bg-gray-300
                dark:bg-zinc-700
              "
              />
            </div>
          ) : (
            <p
              className="
              text-sm
              leading-7

              text-gray-700
              dark:text-gray-200
            "
            >
              {address ||
                "درحال دریافت آدرس..."}
            </p>
          )}
        </div>
{/* SAVED ADDRESSES */}
<div
  className="
    flex
    gap-3

    overflow-x-auto

    pb-1
    mb-4

    no-scrollbar
  "
>
  {savedAddresses.map((item) => {
    const Icon = item.icon;

    return (
      <button
        key={item.id}
        onClick={() => handleSelectSaved(item)}
        className="
          shrink-0

          flex
          items-center
          gap-2

          h-11

          px-4

          rounded-2xl

          bg-gray-100
          dark:bg-zinc-900

          border
          border-gray-200
          dark:border-zinc-700

          active:scale-95

          transition
        "
      >
        <Icon
          size={16}
          className="text-sky-500"
        />

        <span
          className="
            text-xs
            font-bold
            whitespace-nowrap
          "
        >
          {item.title}
        </span>
      </button>
    );
  })}
</div>
        {/* CONFIRM */}
        <button
          onClick={() => setOpen(true)}
          className="
          w-full
          h-14

          rounded-2xl

          bg-sky-500
          hover:bg-sky-600

          active:scale-[0.98]

          text-white
          text-base
          font-bold

          shadow-xl
          shadow-sky-500/30

          transition
        "
        >
          تایید مبدا
        </button>
      </div>

      {/* MODAL */}
      <AddressModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        plaque={plaque}
        unit={unit}
        title={title}
        description={description}
        address={address}
      />
    </div>
  );
}