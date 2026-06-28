import React from "react";
import { Helmet } from "react-helmet-async";
import PeraturanFeature from "@/features/peraturan";

const Peraturan = () => {
  return (
    <>
      <Helmet>
        <title>Regulasi Resmi PASKUS-791 | Peraturan Kesatuan So-791</title>
        <meta
          name="description"
          content="Dengan rahmat Tuhan dan semangat jiwa korps, peraturan ini ditetapkan sebagai pedoman disiplin, etika, serta tata kehidupan seluruh prajurit di lingkungan komunitas Roleplay PASKUS-791."
        />
        <link rel="canonical" href="https://paskus.so791.com/peraturan" />
      </Helmet>
      <PeraturanFeature />
    </>
  );
};

export default Peraturan;
