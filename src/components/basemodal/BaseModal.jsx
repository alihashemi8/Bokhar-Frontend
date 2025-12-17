import { useEffect, useState } from "react";
import MobileModal from "./MobileModal";
import DesktopModal from "./DesktopModal";

export default function BaseModal({ isOpen, onClose, children, maxWidth = "md" }) {
  // تعیین وضعیت موبایل هنگام mount فوری
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 800;
    }
    return false; // fallback برای SSR
  });

  /* ---------------- Detect mobile on resize ---------------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isOpen) return null;

  /* ---------------- Mobile → Bottom Sheet ---------------- */
  if (isMobile) {
    return <MobileModal isOpen={isOpen} onClose={onClose}>{children}</MobileModal>;
  }

  /* ---------------- Desktop → Center Modal ---------------- */
  return (
    <DesktopModal isOpen={isOpen} onClose={onClose} maxWidth={maxWidth}>
      {children}
    </DesktopModal>
  );
}
