import { useEffect, useState } from "react";
import MobileModal from "./MobileModal";
import DesktopModal from "./DesktopModal";

export default function BaseModal({ isOpen, onClose, children, maxWidth = "md", title }) {
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

  /* ---------------- Mobile Back button handling ---------------- */
  useEffect(() => {
    if (!isMobile || !isOpen) return;

    // push state وقتی مودال باز شد
    window.history.pushState({ modal: true }, "");

    const onPopState = () => {
      onClose(); // وقتی Back موبایل زده شد، مودال بسته شود
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isMobile, isOpen, onClose]);

  if (!isOpen) return null;

  /* ---------------- Mobile → Bottom Sheet ---------------- */
  if (isMobile) {
    return (
      <MobileModal isOpen={isOpen} onClose={onClose} title={title}>
        {children}
      </MobileModal>
    );
  }

  /* ---------------- Desktop → Center Modal ---------------- */
  return (
    <DesktopModal isOpen={isOpen} onClose={onClose} maxWidth={maxWidth} title={title}>
      {children}
    </DesktopModal>
  );
}
