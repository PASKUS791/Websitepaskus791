import React from "react";

// Inline SVG Silhouettes for Tactical Weapons - instant loading vectors
const WeaponAssaultRifle = () => (
  <svg viewBox="0 0 64 64" className="weapon-svg-element">
    <title>Assault Rifle</title>
    {/* Clean stylized rifle silhouette */}
    <path d="M2,34 L12,34 L14,30 L22,30 L23,34 L28,34 L29,32 L46,32 L48,36 L52,36 L62,36 L62,35 L52,35 L50,30 L40,30 L38,26 L22,26 L14,26 L12,28 L2,28 Z M6,28 L6,34 M20,30 L20,38 L22,38 L24,30 M42,32 L44,40 L46,40 L46,32" />
  </svg>
);

const WeaponSniper = () => (
  <svg viewBox="0 0 64 64" className="weapon-svg-element">
    <title>Sniper Rifle</title>
    {/* Stylized long range sniper with scope */}
    <path d="M1,33 L10,33 L12,31 L18,31 L19,33 L32,33 L34,30 L63,30 L63,29 L38,29 L36,25 L16,25 L14,27 L8,27 L2,27 Z M26,25 L26,20 L36,20 L36,25 M28,22 L34,22 M16,31 L14,39 L16,39 M32,31 L30,37 L32,37" />
  </svg>
);

const WeaponPistol = () => (
  <svg viewBox="0 0 64 64" className="weapon-svg-element">
    <title>Tactical Pistol</title>
    {/* Compact semi-automatic handgun */}
    <path d="M14,18 L48,18 L48,26 L30,26 L22,46 L12,46 L18,26 L14,26 Z M30,26 L34,31 L32,31 L28,26" />
  </svg>
);

const WeaponKnife = () => (
  <svg viewBox="0 0 64 64" className="weapon-svg-element">
    <title>Combat Knife</title>
    {/* Sleek combat knife with clip point blade */}
    <path d="M8,46 L14,52 L26,40 L24,38 L26,36 L48,14 C50,12 56,10 58,12 C60,14 58,20 56,22 L34,44 L32,42 L30,44 Z" />
  </svg>
);

const WeaponSMG = () => (
  <svg viewBox="0 0 64 64" className="weapon-svg-element">
    <title>Tactical SMG</title>
    {/* Compact submachine gun */}
    <path d="M4,36 L12,36 L14,32 L28,32 L30,36 L48,36 L50,32 L58,32 L58,30 L42,30 L40,26 L20,26 L14,26 L10,29 L4,29 Z M12,26 L12,21 L16,21 M24,32 L26,42 L29,42 L29,32" />
  </svg>
);

const OrbitWeapons = () => {
  return (
    <div className="weapons-orbit-container">
      {/* 5 Weapons orbiting in a perfect pentagon */}
      <div className="weapon-silhouette-item">
        <WeaponAssaultRifle />
      </div>
      <div className="weapon-silhouette-item">
        <WeaponSniper />
      </div>
      <div className="weapon-silhouette-item">
        <WeaponPistol />
      </div>
      <div className="weapon-silhouette-item">
        <WeaponKnife />
      </div>
      <div className="weapon-silhouette-item">
        <WeaponSMG />
      </div>
    </div>
  );
};

export default OrbitWeapons;
