import React from "react";

const GlowEffect = () => {
  return (
    <div className="tactical-ring-container">
      {/* Outer Dashed HUD Ring */}
      <div className="hud-ring-outer" />
      
      {/* Expanding Concentric Energy Wave */}
      <div className="hud-energy-wave" />
      
      {/* Floating Micro-Particles */}
      <div className="hud-particles-container">
        <span className="hud-particle" />
        <span className="hud-particle" />
        <span className="hud-particle" />
        <span className="hud-particle" />
      </div>
    </div>
  );
};

export default GlowEffect;
