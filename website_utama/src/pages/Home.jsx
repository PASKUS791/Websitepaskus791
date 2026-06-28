import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeFeature from "@/features/home";

const Home = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.2 },
    );

    const sections = document.querySelectorAll(".page-section");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>PASKUS Gi1 | Resimen BRM5 Roleplay Indonesia</title>
        <meta
          name="description"
          content="PASKUS Gi1 | So-791 adalah resimen BRM5 roleplay Indonesia dengan komando taktis, unit khusus, dinas pendukung, streamer hub, pendaftaran personel, dan Discord resmi PASKUS."
        />
      </Helmet>

      <div>
        <Navbar />
        <HomeFeature />
        <Footer />
      </div>
    </>
  );
};

export default Home;
