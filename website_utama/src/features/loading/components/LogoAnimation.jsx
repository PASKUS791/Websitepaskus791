import React from "react";

const LogoAnimation = () => {
  return (
    <div className="loader-logo-wrapper">
      <img
        className="loader-logo-img"
        src="/recruitment-webhook-logo.png"
        alt="PASKUS Tactical Emblem"
        loading="eager"
        decoding="async"
      />
    </div>
  );
};

export default LogoAnimation;
