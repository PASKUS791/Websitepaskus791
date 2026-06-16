import React, { useState } from "react";
import { Link } from "react-router";
import Paskus from "../assets/images/paskus.webp";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [brm5Open, setBrm5Open] = useState(false);

  const toggleMobileMenu = () => {
    setOpen(!open);
    setBrm5Open(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-black/60 backdrop-blur-md border-b border-[#8a9a5b]/20">
      {/* Logo */}
      <Link to="/" className="flex items-center text-white cursor-pointer">
        <img src={Paskus} alt="PASKUS Logo" className="w-10 h-10 mr-2" />
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-none heading-font">PASKUS</span>
          <span className="text-[10px] text-[#8a9a5b] tracking-widest heading-font">
            SYSTEMS COMMAND
          </span>
        </div>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 items-center text-[12px] tracking-widest text-gray-400 heading-font">
        <Link to="/" className="hover:text-white transition">
          HOME
        </Link>

        {/* Dropdown BRM5 INFO */}
        <div className="relative group">
          <button className="hover:text-white transition cursor-pointer flex items-center gap-1">
            BRM5 INFO <span className="text-[9px] opacity-60">▼</span>
          </button>
          <div className="absolute top-full left-0 mt-2 w-56 bg-black/95 border border-[#8a9a5b]/30 rounded-xl py-2 hidden group-hover:block hover:block transition-all shadow-xl">
            <Link to="/brm5-roleplay" className="block px-4 py-2 hover:bg-[#8a9a5b]/20 hover:text-white text-gray-300 text-[11px]">
              BRM5 ROLEPLAY
            </Link>
            <Link to="/resimen-brm5" className="block px-4 py-2 hover:bg-[#8a9a5b]/20 hover:text-white text-gray-300 text-[11px]">
              RESIMEN BRM5
            </Link>
            <Link to="/roleplay-grup-brm5" className="block px-4 py-2 hover:bg-[#8a9a5b]/20 hover:text-white text-gray-300 text-[11px]">
              ROLEPLAY GRUP
            </Link>
            <Link to="/unit-brm5-paskus" className="block px-4 py-2 hover:bg-[#8a9a5b]/20 hover:text-white text-gray-300 text-[11px]">
              UNIT BRM5
            </Link>
            <Link to="/cara-gabung-brm5-roleplay" className="block px-4 py-2 hover:bg-[#8a9a5b]/20 hover:text-white text-gray-300 text-[11px]">
              CARA GABUNG
            </Link>
            <Link to="/blackhawk-rescue-5-roleplay-fraksi" className="block px-4 py-2 hover:bg-[#8a9a5b]/20 hover:text-white text-gray-300 text-[11px]">
              FRAKSI BRM5
            </Link>
            <Link to="/peraturan" className="block px-4 py-2 hover:bg-[#8a9a5b]/20 hover:text-white text-gray-300 text-[11px]">
              PERATURAN
            </Link>
          </div>
        </div>

        <Link to="/streamers" className="hover:text-white transition">
          STREAMERS
        </Link>
        <Link to="/struktural" className="hover:text-white transition">
          STRUKTURAL
        </Link>
        <Link to="/about" className="hover:text-white transition">
          ABOUT US
        </Link>
        <a
          href="https://discord.gg/ynRhDN5p7b"
          target="_blank"
          rel="noreferrer"
          className="text-[#d4af37] border border-[#d4af37]/50 px-3 py-1 hover:bg-white hover:text-black transition"
        >
          DISCORD
        </a>
      </div>

      {/* Hamburger Button */}
      <button
        className="md:hidden text-white text-2xl"
        onClick={toggleMobileMenu}
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-black/95 border-b border-[#8a9a5b]/20 flex flex-col items-center gap-4 py-6 text-gray-300 md:hidden heading-font text-xs tracking-wider shadow-2xl">
          <Link to="/" onClick={() => setOpen(false)} className="hover:text-white">HOME</Link>
          
          <button
            onClick={() => setBrm5Open(!brm5Open)}
            className="hover:text-white flex items-center gap-1"
          >
            BRM5 INFO <span className="text-[8px] opacity-60">{brm5Open ? "▲" : "▼"}</span>
          </button>

          {brm5Open && (
            <div className="flex flex-col items-center gap-2.5 bg-white/5 w-full py-3 border-y border-white/5">
              <Link to="/brm5-roleplay" onClick={() => setOpen(false)} className="hover:text-white text-[11px]">BRM5 ROLEPLAY</Link>
              <Link to="/resimen-brm5" onClick={() => setOpen(false)} className="hover:text-white text-[11px]">RESIMEN BRM5</Link>
              <Link to="/roleplay-grup-brm5" onClick={() => setOpen(false)} className="hover:text-white text-[11px]">ROLEPLAY GRUP</Link>
              <Link to="/unit-brm5-paskus" onClick={() => setOpen(false)} className="hover:text-white text-[11px]">UNIT BRM5</Link>
              <Link to="/cara-gabung-brm5-roleplay" onClick={() => setOpen(false)} className="hover:text-white text-[11px]">CARA GABUNG</Link>
              <Link to="/blackhawk-rescue-5-roleplay-fraksi" onClick={() => setOpen(false)} className="hover:text-white text-[11px]">FRAKSI BRM5</Link>
              <Link to="/peraturan" onClick={() => setOpen(false)} className="hover:text-white text-[11px]">PERATURAN</Link>
            </div>
          )}

          <Link to="/streamers" onClick={() => setOpen(false)} className="hover:text-white">STREAMERS</Link>
          <Link to="/struktural" onClick={() => setOpen(false)} className="hover:text-white">STRUKTURAL</Link>
          <Link to="/about" onClick={() => setOpen(false)} className="hover:text-white">ABOUT US</Link>
          <a
            href="https://discord.gg/ynRhDN5p7b"
            target="_blank"
            rel="noreferrer"
            className="text-[#d4af37] border border-[#d4af37]/50 px-4 py-1.5 hover:bg-white hover:text-black transition"
          >
            DISCORD
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
