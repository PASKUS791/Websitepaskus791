import { useEffect } from "react";

/**
 * Custom Hook to reveal target elements smoothly on scroll using IntersectionObserver.
 * lazy scroll reveal bindings
 */
export function useScrollReveal(pathname) {
  useEffect(() => {
    // Give a short delay to ensure elements are mounted before selecting
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          });
        },
        { threshold: 0.1 }
      );

      const elements = document.querySelectorAll(
        ".reveal-on-scroll, .struktural-card, .pasal-block, .about-section"
      );
      elements.forEach((el) => observer.observe(el));

      return () => {
        elements.forEach((el) => observer.unobserve(el));
        observer.disconnect();
      };
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);
}
