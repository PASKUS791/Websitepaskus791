import React, { useEffect } from "react";

/**
 * Reusable animated modal component.
 * simple portal-like animated overlay
 */
export function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#0d0d0d] border border-gold/30 rounded-2xl p-8 shadow-2xl relative transition-all duration-300 scale-100 select-none"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "parallaxTitle 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
          <h4 className="heading-font text-[#EFBF04] text-xl font-bold uppercase tracking-wider">
            {title}
          </h4>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-sage hover:text-white transition-colors p-1"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="text-gray-300 text-sm leading-relaxed mb-6">
          {children}
        </div>
      </div>
    </div>
  );
}
