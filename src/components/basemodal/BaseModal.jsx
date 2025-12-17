import { useEffect, useState } from "react";
import MobileModal from "./MobileModal";

export default function BaseModal({
  isOpen,
  onClose,
  children,
  maxWidth = "md",
}) {
  const [isMobile, setIsMobile] = useState(false);

  /* ---------------- Detect mobile ---------------- */
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isOpen) return null;

  /* ---------------- Mobile → Bottom Sheet ---------------- */
  if (isMobile) {
    return (
      <MobileModal isOpen={isOpen} onClose={onClose}>
        {children}
      </MobileModal>
    );
  }

  /* ---------------- Desktop → Center Modal ---------------- */
  return (
    <div
      className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          relative w-full mx-4
          bg-white rounded-2xl
          shadow-xl
          animate-scale-in
          ${maxWidthClass(maxWidth)}
        `}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------------- Helpers ---------------- */
function maxWidthClass(size) {
  switch (size) {
    case "sm":
      return "max-w-sm";
    case "md":
      return "max-w-md";
    case "lg":
      return "max-w-lg";
    case "xl":
      return "max-w-xl";
    default:
      return "max-w-md";
  }
}
