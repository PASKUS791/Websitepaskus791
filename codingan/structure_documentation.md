# PASKUS Gi1 - Organizational Structure Documentation

## Overview
This document outlines the hierarchical structure, rank titles, and visual representation (insignia) used in the project. It is designed to be easily reproducible and adaptable for other React/Tailwind projects.

## Tech Stack & Libraries
- **React**: Component-based UI structure.
- **Tailwind CSS**: Utility-first styling for layout, gradients, colors, and shadows.
- **Framer Motion**: Used for staggered reveal animations and collapsible content (`AnimatePresence`, `motion.div`).
- **Lucide React**: For highly scalable vector icons.

## Rank Structure

The military ranks are divided into 7 main categories, ordered from highest to lowest:

### 1. PERWIRA TINGGI (High Command)
*Colors: Rust Gold (`text-rust-gold`, `bg-rust-gold/10`)*
- **MAYOR JENDRAL**: Division General *(Insignia: 2 Stars)*
- **BRIGADIR JENDRAL**: Brigade General *(Insignia: 1 Star)*

### 2. PERWIRA MENENGAH (Field Officers)
*Colors: Rust Gold (`text-rust-gold`, `bg-rust-gold/5`)*
- **KOLONEL**: Regiment Commander *(Insignia: 3 Melati/Jasmine)*
- **LETNAN KOLONEL**: Battalion Commander *(Insignia: 2 Melati/Jasmine)*
- **MAYOR**: Battalion Executive Officer *(Insignia: 1 Melati/Jasmine)*

### 3. PERWIRA PERTAMA (Junior Officers)
*Colors: Olive Green (`text-olive-green`, `bg-olive-green/5`)*
- **KAPTEN**: Company Commander *(Insignia: 3 Gold Bars)*
- **LETNAN SATU**: Field Officer *(Insignia: 2 Gold Bars)*
- **LETNAN DUA**: Junior Officer *(Insignia: 1 Gold Bar)*

### 4. BINTARA TINGGI (Senior Non-Commissioned Officer)
*Colors: Steel Gray (`text-steel-gray`, `bg-steel-gray/5`)*
- **SERSAN MAYOR**: Senior NCO *(Insignia: 4 Yellow Chevrons)*

### 5. BINTARA MUDA (Non-Commissioned Officers)
*Colors: Steel Gray (`text-steel-gray`, `bg-steel-gray/5`)*
- **SERSAN KEPALA**: Platoon Assistant *(Insignia: 3 Yellow Chevrons)*
- **SERSAN SATU**: Senior Squad Leader *(Insignia: 2 Yellow Chevrons)*
- **SERSAN DUA**: Squad Leader *(Insignia: 1 Yellow Chevron)*

### 6. TAMTAMA SENIOR (Senior Enlisted)
*Colors: Red (`text-red-500`, `bg-red-600/5`)*
- **KOPRAL KEPALA**: Fireteam Leader *(Insignia: 3 Red Chevrons)*
- **KOPRAL SATU**: Senior Assistant *(Insignia: 2 Red Chevrons)*
- **KOPRAL DUA**: Assistant Team Leader *(Insignia: 1 Red Chevron)*

### 7. TAMTAMA JUNIOR (Junior Enlisted)
*Colors: Red (`text-red-400`, `bg-red-500/5`)*
- **PRAJURIT KEPALA**: Senior Operator *(Insignia: 3 Red Bars)*
- **PRAJURIT SATU**: Operator First Class *(Insignia: 2 Red Bars)*
- **PRAJURIT DUA**: Recruit / Trainee *(Insignia: 1 Red Bar)*

---

## Insignia Details (Icons)

The `RankInsignia` component dynamically renders icons based on the `rank` string. The rendering logic utilizes a combination of Lucide icons and custom CSS shapes:

1. **Stars (`lucide-react: Star`)**
   - **Used for**: Jendral ranks.
   - **Styling**: Rendered with a custom drop-shadow for a glowing military effect (`drop-shadow-[0_0_12px_rgba(168,140,74,0.9)]`).

2. **Melati / Jasmine (Custom SVG)**
   - **Used for**: Kolonel, Letnan Kolonel, and Mayor.
   - **Styling**: An 8-pointed star to represent the Indonesian "Melati" rank insignia.
   - **Implementation**:
     ```tsx
     <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
       <path d="M12 1L14.5 8.5L22 6L17 12L22 18L14.5 15.5L12 23L9.5 15.5L2 18L7 12L2 6L9.5 8.5L12 1Z" fill="currentColor" />
       <circle cx="12" cy="12" r="3.5" fill="#111" stroke="currentColor" strokeWidth="1.5" />
     </svg>
     ```

3. **Bars (Tailwind CSS `<div>`)**
   - **Used for**: Kapten, Letnan, and Prajurit ranks.
   - **Styling**: Built exclusively with Tailwind divs. They utilize gradients and rounded corners to look like metallic bars.
   - **Implementation**:
     ```tsx
     <div className="w-11 h-3 bg-gradient-to-r from-rust-gold/80 via-yellow-400 to-rust-gold/80 rounded-[2px] shadow-[0_0_12px_rgba(168,140,74,0.8)] border border-yellow-200/30" />
     ```

4. **Chevrons (`lucide-react: ChevronUp`)**
   - **Used for**: Sersan and Kopral ranks.
   - **Styling**: Rendered with negative vertical spacing (`-space-y-4`) to overlap them tightly, creating military chevron stripes.

---

## Data Structure (State / Props)

To populate this UI in another project, structure your data as an array of objects. It allows you to loop through categories and their respective ranks dynamically.

```typescript
type RankMember = string;

interface Rank {
  name: string;        // Full rank name (e.g., "MAYOR JENDRAL")
  role: string;        // Internal division role (e.g., "DIVISION GENERAL")
  color: string;       // Tailwind classes for borders and backgrounds
  members?: RankMember[]; // Optional array of personnel names
}

interface RankCategory {
  category: string;
  ranks: Rank[];
}

```typescript
// Example Data payload:
const structureData = [
  {
    category: "PERWIRA TINGGI",
    ranks: [
      { name: "MAYOR JENDRAL", role: "DIVISION GENERAL", color: "border-rust-gold/50 text-rust-gold bg-rust-gold/10", members: ["[ ☆☆ ] MAYJEN. [HCO] Gi1"] },
      { name: "BRIGADIR JENDRAL", role: "BRIGADE GENERAL", color: "border-rust-gold/40 text-rust-gold bg-rust-gold/5", members: ["[☆][STAFF ♤] Cosmo"] },
    ]
  },
  {
    category: "PERWIRA MENENGAH",
    ranks: [
      { name: "KOLONEL", role: "REGIMENT COMMANDER", color: "border-rust-gold/30 text-rust-gold bg-rust-gold/5", members: ["[ 𖤍 ] KOL. Duke"] },
      { name: "LETNAN KOLONEL", role: "BATTALION COMMANDER", color: "border-rust-gold/20 text-rust-gold/80 bg-rust-gold/5", members: ["[ 𖤓 ] LETKOL. [STAFF ♤] Supri", "[ 𖤓 ] LETKOL. PEL [🗡] Moru"] },
      { name: "MAYOR", role: "BATTALION EXECUTIVE OFFICER", color: "border-rust-gold/10 text-rust-gold/60 bg-rust-gold/5", members: ["[ 𖤓 ] Do", "[ 𖤓 ] [PM ♤] 4Hn. SPR.Jr"] },
    ]
  },
  {
    category: "PERWIRA PERTAMA",
    ranks: [
      { name: "KAPTEN", role: "COMPANY COMMANDER", color: "border-olive-green/40 text-olive-green bg-olive-green/5", members: ["[ III ] Cpt. [PM ♤] G•dwg", "[ III ] Ewok The Immortality", "[ III ] KAPT. [STAFF]. Raikkonen", "[ III ] Kapten [PRO] Dr96fx", "[ III ] Kapten Regi. [PUSDIKLAT]"] },
      { name: "LETNAN SATU", role: "FIELD OFFICER", color: "border-olive-green/30 text-olive-green/80 bg-olive-green/5", members: ["[ II ] [⚒] Nap", "[ II ] Lettu. [⚒] LOG. Lee", "[ II ] Lettu. 🌐 [STAFF ♤] Poyu", "[ II ] Lettu. Go", "[ II ] Lt. [™ PM] Jokooo Jawirrr", "[ II ] Salty"] },
      { name: "LETNAN DUA", role: "JUNIOR OFFICER", color: "border-olive-green/20 text-olive-green/60 bg-olive-green/5", members: ["[ I ] Letda ʟᴏɢ [⚒] zzz.ᴋɴʏᴛ-1", "[ I ] Letda. [PRO] ウィキSPR.Jr", "[ I ] Letda. ashbatten Alakamula", "[ I ] Letda. Med [PM] GX Ganz ©", "[ I ]Letda. Garit KNYT-2"] },
    ]
  },
  {
    category: "BINTARA TINGGI",
    ranks: [
      { name: "SERSAN MAYOR", role: "SENIOR NCO", color: "border-steel-gray/40 text-steel-gray bg-steel-gray/5" },
    ]
  },
  {
    category: "BINTARA MUDA",
    ranks: [
      { name: "SERSAN KEPALA", role: "PLATOON ASSISTANT", color: "border-steel-gray/30 text-steel-gray/80 bg-steel-gray/5" },
      { name: "SERSAN SATU", role: "SENIOR SQUAD LEADER", color: "border-steel-gray/20 text-steel-gray/60 bg-steel-gray/5" },
      { name: "SERSAN DUA", role: "SQUAD LEADER", color: "border-steel-gray/10 text-steel-gray/40 bg-steel-gray/5" },
    ]
  }
]

const tamtamaSeniorData = {
  category: "TAMTAMA SENIOR",
  ranks: [
    { name: "KOPRAL KEPALA", role: "FIRETEAM LEADER", color: "border-red-600/40 text-red-500 bg-red-600/5" },
    { name: "KOPRAL SATU", role: "SENIOR ASSISTANT", color: "border-red-600/30 text-red-500/80 bg-red-600/5" },
    { name: "KOPRAL DUA", role: "ASSISTANT TEAM LEADER", color: "border-red-600/20 text-red-500/60 bg-red-600/5" },
  ]
}

const tamtamaJuniorData = {
  category: "TAMTAMA JUNIOR",
  ranks: [
    { name: "PRAJURIT KEPALA", role: "SENIOR OPERATOR", color: "border-red-500/30 text-red-400 bg-red-500/5" },
    { name: "PRAJURIT SATU", role: "OPERATOR FIRST CLASS", color: "border-red-500/20 text-red-400/80 bg-red-500/5" },
    { name: "PRAJURIT DUA", role: "RECRUIT / TRAINEE", color: "border-red-500/10 text-red-400/60 bg-red-500/5" },
  ]
}
```

## UI Rendering Example

When mapping over the data, the `members` array should be conditionally rendered beneath the title and role.

```tsx
{rank.members && rank.members.length > 0 && (
  <div className="pt-2 space-y-1">
    {rank.members.map((member, mIdx) => (
      <div 
        key={mIdx} 
        className="text-xs sm:text-sm font-mono text-bone-white/80 group-hover:text-bone-white transition-colors"
      >
        {member}
      </div>
    ))}
  </div>
)}
```

---

## Complete Source Code: `RankInsignia.tsx`

If you are porting this to another project, you can simply create a new file `src/components/ui/RankInsignia.tsx` and paste the following code. Make sure you have `lucide-react` installed.

```tsx
import { Star, ChevronUp, ShieldCheck } from 'lucide-react';

interface RankInsigniaProps {
  rank: string;
}

// Enhanced 8-pointed star representing Melati/Jasmine in ID ranking system
const MelatiIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-rust-gold drop-shadow-[0_0_10px_rgba(168,140,74,0.9)]">
    <path d="M12 1L14.5 8.5L22 6L17 12L22 18L14.5 15.5L12 23L9.5 15.5L2 18L7 12L2 6L9.5 8.5L12 1Z" fill="currentColor" />
    <circle cx="12" cy="12" r="3.5" fill="#111" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const RankInsignia: React.FC<RankInsigniaProps> = ({ rank }) => {
  const normalizedRank = rank.toUpperCase();

  const renderStars = (count: number) => (
    <div className="flex gap-1.5 justify-center">
      {[...Array(count)].map((_, i) => (
        <Star key={i} size={24} fill="currentColor" className="text-rust-gold drop-shadow-[0_0_12px_rgba(168,140,74,0.9)]" />
      ))}
    </div>
  );

  const renderMelati = (count: number) => (
    <div className="flex gap-1.5 justify-center">
      {[...Array(count)].map((_, i) => (
        <MelatiIcon key={i} />
      ))}
    </div>
  );

  const renderBars = (count: number) => (
    <div className="flex flex-col gap-1.5 items-center">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="w-11 h-3 bg-gradient-to-r from-rust-gold/80 via-yellow-400 to-rust-gold/80 rounded-[2px] shadow-[0_0_12px_rgba(168,140,74,0.8)] border border-yellow-200/30" />
      ))}
    </div>
  );

  const renderYellowChevrons = (count: number) => (
    <div className="flex flex-col -space-y-4 items-center mt-2">
      {[...Array(count)].map((_, i) => (
        <ChevronUp key={i} size={34} className="text-rust-gold drop-shadow-[0_0_12px_rgba(168,140,74,1)]" strokeWidth={5} />
      ))}
    </div>
  );

  const renderRedChevrons = (count: number) => (
    <div className="flex flex-col -space-y-4 items-center mt-2">
      {[...Array(count)].map((_, i) => (
        <ChevronUp key={i} size={34} className="text-red-600 drop-shadow-[0_0_12px_rgba(220,38,38,1)]" strokeWidth={5} />
      ))}
    </div>
  );

  const renderTamtamaBars = (count: number) => (
    <div className="flex flex-col gap-1.5 items-center">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="w-11 h-3 bg-gradient-to-r from-red-700 via-red-500 to-red-700 rounded-[2px] shadow-[0_0_12px_rgba(220,38,38,0.8)] border border-red-400/30" />
      ))}
    </div>
  );

  switch (normalizedRank) {
    case 'MAYOR JENDRAL':
    case 'MAYOR JENDERAL':
      return renderStars(2);
    case 'BRIGADIR JENDRAL':
    case 'BRIGADIR JENDERAL':
      return renderStars(1);
    case 'KOLONEL':
      return renderMelati(3);
    case 'LETNAN KOLONEL':
      return renderMelati(2);
    case 'MAYOR':
      return renderMelati(1);
    case 'KAPTEN':
      return renderBars(3);
    case 'LETNAN SATU':
      return renderBars(2);
    case 'LETNAN DUA':
      return renderBars(1);
    case 'SERSAN MAYOR':
      return renderYellowChevrons(4);
    case 'SERSAN KEPALA':
      return renderYellowChevrons(3);
    case 'SERSAN SATU':
      return renderYellowChevrons(2);
    case 'SERSAN DUA':
      return renderYellowChevrons(1);
    case 'KOPRAL KEPALA':
      return renderRedChevrons(3);
    case 'KOPRAL SATU':
      return renderRedChevrons(2);
    case 'KOPRAL DUA':
      return renderRedChevrons(1);
    case 'PRAJURIT KEPALA':
      return renderTamtamaBars(3);
    case 'PRAJURIT SATU':
      return renderTamtamaBars(2);
    case 'PRAJURIT DUA':
      return renderTamtamaBars(1);
    default:
      return <ShieldCheck size={28} className="text-rust-gold opacity-50 drop-shadow-[0_0_10px_rgba(168,140,74,0.6)]" />;
  }
};

export default RankInsignia;
```
