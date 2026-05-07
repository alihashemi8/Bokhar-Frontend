import { useRef, useEffect } from "react";

export default function HorizontalScroller({ children, className = "" }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      // فقط اگر حرکت عمودی قوی‌تر از افقی باشد
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        e.stopPropagation();
        
        // RTL: چرخ به پایین (deltaY > 0) = اسکرول به راست (مقدار مثبت)
        const delta = e.deltaY > 0 ? 100 : -100;
        
        el.scrollBy({
          left: delta,
          behavior: 'smooth'
        });
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div 
      ref={scrollRef} 
      className={`overflow-x-auto ${className}`}
    >
      <div className="flex">
        {children}
      </div>
    </div>
  );
}
