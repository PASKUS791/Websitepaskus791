import React from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router";

import Landing from "./pages/Landing";
import About from "./pages/About";
import Unit from "./pages/unit";

import Struktural from "./pages/Struktural";
import Streamers from "./pages/Streamers";
import StreamerProfile from "./pages/StreamerProfile";

import Brm5Roleplay from "./pages/Brm5Roleplay";
import ResimenBrm5 from "./pages/ResimenBrm5";
import RoleplayGrupBrm5 from "./pages/RoleplayGrupBrm5";
import UnitBrm5Paskus from "./pages/UnitBrm5Paskus";
import FraksiBrm5 from "./pages/FraksiBrm5";
import CaraGabungBrm5 from "./pages/CaraGabungBrm5";
import Peraturan from "./pages/Peraturan";

import Loading from "./components/Loading";

const App = () => {
  return (
    <div className="">
      <Loading />
      <Navbar />
      <Routes>
        <Route index element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/unit/:namaUnit" element={<Unit />} />

        {/* New Pages */}
        <Route path="/struktural" element={<Struktural />} />
        <Route path="/streamer" element={<Streamers />} />
        <Route path="/streamers" element={<Streamers />} />
        <Route path="/streamer/:creator" element={<StreamerProfile />} />
        <Route path="/streamers/:creator" element={<StreamerProfile />} />

        {/* BRM5 Pages */}
        <Route path="/brm5-roleplay" element={<Brm5Roleplay />} />
        <Route path="/resimen-brm5" element={<ResimenBrm5 />} />
        <Route path="/roleplay-grup-brm5" element={<RoleplayGrupBrm5 />} />
        <Route path="/unit-brm5-paskus" element={<UnitBrm5Paskus />} />
        <Route path="/blackhawk-rescue-5-roleplay-fraksi" element={<FraksiBrm5 />} />
        <Route path="/cara-gabung-brm5-roleplay" element={<CaraGabungBrm5 />} />
        <Route path="/peraturan" element={<Peraturan />} />
      </Routes>
    </div>
  );
};

export default App;
