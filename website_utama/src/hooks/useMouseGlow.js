import { useEffect } from "react";

/**
 * Custom Hook to track mouse coordinate positions globally and update CSS variables.
 * requestAnimationFrame throttled global cursor tracking
 */
export function useMouseGlow(glowRef) {
  useEffect(() => {
    let frameId;
    
    const handleMouseMove = (e) => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        if (glowRef.current) {
          glowRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
          glowRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
        }
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [glowRef]);
}
