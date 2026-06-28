import React from "react";
import { Helmet } from "react-helmet-async";
import AboutFeature from "@/features/about";

const About = () => {
  return (
    <>
      <Helmet>
        <title>Tentang Kami PASKUS Gi1 | Resimen BRM5 Roleplay Indonesia</title>
        <meta
          name="description"
          content="Halaman pengenalan PASKUS Gi1 So-791 untuk mengenal lebih dekat visi, budaya, koordinasi taktis, dan standar sikap komunitas resimen BRM5."
        />
        <link rel="canonical" href="https://paskus.so791.com/about" />
      </Helmet>
      <AboutFeature />
    </>
  );
};

export default About;
