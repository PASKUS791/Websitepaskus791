import React from "react";
import { Star, ChevronUp, ShieldCheck } from "lucide-react";

// Enhanced 8-pointed star representing Melati/Jasmine in ID ranking system
const MelatiIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    className="text-[#d4af37] drop-shadow-[0_0_10px_rgba(168,140,74,0.9)]"
  >
    <path
      d="M12 1L14.5 8.5L22 6L17 12L22 18L14.5 15.5L12 23L9.5 15.5L2 18L7 12L2 6L9.5 8.5L12 1Z"
      fill="currentColor"
    />
    <circle
      cx="12"
      cy="12"
      r="3.5"
      fill="#111"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const RankInsignia = ({ rank }) => {
  const normalizedRank = (rank || "").toUpperCase();

  const renderStars = (count) => (
    <div className="flex gap-1.5 justify-center">
      {[...Array(count)].map((_, i) => (
        <Star
          key={i}
          size={24}
          fill="currentColor"
          className="text-[#d4af37] drop-shadow-[0_0_12px_rgba(168,140,74,0.9)]"
        />
      ))}
    </div>
  );

  const renderMelati = (count) => (
    <div className="flex gap-1.5 justify-center">
      {[...Array(count)].map((_, i) => (
        <MelatiIcon key={i} />
      ))}
    </div>
  );

  const renderBars = (count) => (
    <div className="flex flex-col gap-1.5 items-center">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="w-11 h-3 bg-gradient-to-r from-[#b8963a] via-yellow-400 to-[#b8963a] rounded-[2px] shadow-[0_0_12px_rgba(168,140,74,0.8)] border border-yellow-200/30"
        />
      ))}
    </div>
  );

  const renderYellowChevrons = (count) => (
    <div className="flex flex-col -space-y-4 items-center mt-2">
      {[...Array(count)].map((_, i) => (
        <ChevronUp
          key={i}
          size={34}
          className="text-[#d4af37] drop-shadow-[0_0_12px_rgba(168,140,74,1)]"
          strokeWidth={5}
        />
      ))}
    </div>
  );

  const renderRedChevrons = (count) => (
    <div className="flex flex-col -space-y-4 items-center mt-2">
      {[...Array(count)].map((_, i) => (
        <ChevronUp
          key={i}
          size={34}
          className="text-red-600 drop-shadow-[0_0_12px_rgba(220,38,38,1)]"
          strokeWidth={5}
        />
      ))}
    </div>
  );

  const renderTamtamaBars = (count) => (
    <div className="flex flex-col gap-1.5 items-center">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="w-11 h-3 bg-gradient-to-r from-red-700 via-red-500 to-red-700 rounded-[2px] shadow-[0_0_12px_rgba(220,38,38,0.8)] border border-red-400/30"
        />
      ))}
    </div>
  );

  switch (normalizedRank) {
    case "MAYOR JENDRAL":
    case "MAYOR JENDERAL":
      return renderStars(2);
    case "BRIGADIR JENDRAL":
    case "BRIGADIR JENDERAL":
      return renderStars(1);
    case "KOLONEL":
      return renderMelati(3);
    case "LETNAN KOLONEL":
      return renderMelati(2);
    case "MAYOR":
      return renderMelati(1);
    case "KAPTEN":
      return renderBars(3);
    case "LETNAN SATU":
      return renderBars(2);
    case "LETNAN DUA":
      return renderBars(1);
    case "SERSAN MAYOR":
      return renderYellowChevrons(4);
    case "SERSAN KEPALA":
      return renderYellowChevrons(3);
    case "SERSAN SATU":
      return renderYellowChevrons(2);
    case "SERSAN DUA":
      return renderYellowChevrons(1);
    case "KOPRAL KEPALA":
      return renderRedChevrons(3);
    case "KOPRAL SATU":
      return renderRedChevrons(2);
    case "KOPRAL DUA":
      return renderRedChevrons(1);
    case "PRAJURIT KEPALA":
      return renderTamtamaBars(3);
    case "PRAJURIT SATU":
      return renderTamtamaBars(2);
    case "PRAJURIT DUA":
      return renderTamtamaBars(1);
    default:
      return (
        <ShieldCheck
          size={28}
          className="text-[#d4af37] opacity-50 drop-shadow-[0_0_10px_rgba(168,140,74,0.6)]"
        />
      );
  }
};

export default RankInsignia;
