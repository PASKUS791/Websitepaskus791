import React from "react";

function RankInsigniaLive({ name, count }) {
  if (name === "stars") {
    return (
      <div aria-label={`${count} Stars`}>
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="structure-star">★</span>
        ))}
      </div>
    );
  }
  if (name === "melati") {
    return (
      <div aria-label={`${count} Melati`}>
        {Array.from({ length: count }, (_, i) => (
          <svg key={i} className="structure-melati" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 1L14.5 8.5L22 6L17 12L22 18L14.5 15.5L12 23L9.5 15.5L2 18L7 12L2 6L9.5 8.5L12 1Z" fill="currentColor" />
            <circle cx="12" cy="12" r="3.5" fill="#111" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ))}
      </div>
    );
  }
  if (name === "bars") {
    return (
      <div className="structure-bars" aria-label={`${count} Bars`}>
        {Array.from({ length: count }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    );
  }
  if (name === "chevrons") {
    return (
      <div className="structure-chevrons" aria-label={`${count} Chevrons`}>
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="structure-chevron" />
        ))}
      </div>
    );
  }
  return null;
}

export default RankInsigniaLive;
