import React from "react";

const TextReveal = () => {
  return (
    <div className="loader-text-wrapper">
      <div className="flex items-center justify-center">
        {/* Left Tactical Bracket */}
        <span className="loader-bracket bracket-left">[</span>
        
        {/* Main Header Text */}
        <span className="loader-main-text">PASKUS 791 DASHBOARD</span>
        
        {/* Right Tactical Bracket */}
        <span className="loader-bracket bracket-right">]</span>
      </div>
      
      {/* HUD Details Subtext */}
      <div className="text-hud-subtext">
        OPERATIONAL STATUS: READY // ENCRYPTED CHANNEL SECURE
      </div>
    </div>
  );
};

export default TextReveal;
