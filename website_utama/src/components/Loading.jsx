// Loading.jsx (ganti seluruh file)
import React, { useEffect, useState, useRef } from "react";

const Loading = () => {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const intervalRef = useRef(null);

  useEffect(() => {
    // debug: lihat di console progres

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        let next = prev + Math.random() * 30;
        if (next >= 100) {
          next = 100;
          // clear using ref
          clearInterval(intervalRef.current);
          // mulai proses fade
          setTimeout(() => {
            setOpacity(0);
            setTimeout(() => {
              setHidden(true);
            }, 500);
          }, 800);
        }
        return next;
      });
    }, 200);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      id="loading-screen"
      style={{
        opacity: opacity,
        transition: "opacity 0.5s",
        // penting: jika opacity 0 biarkan pointer events agar bisa scroll
        pointerEvents: opacity === 0 ? "none" : "auto",
      }}
      className="fixed inset-0 bg-black flex items-center justify-center z-9999"
    >
      <div className="text-center">
        <h2 className="loader-text heading-font text-gold text-4xl tracking-[1em] mb-4">
          PASKUS
        </h2>

        <p className="text-sage heading-font text-sm animate-pulse">
          AUTHORIZING ACCESS...
        </p>

        <div className="w-64 h-1 bg-white/10 mt-8 mx-auto overflow-hidden">
          <div
            id="progress"
            className="h-full bg-gold transition-all duration-300"
            style={{ width: progress + "%" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
