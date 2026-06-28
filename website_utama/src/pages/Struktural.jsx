import React from "react";
import { Helmet } from "react-helmet-async";
import StrukturalFeature from "@/features/struktural";

const Struktural = () => {
  return (
    <>
      <Helmet>
        <title>Struktural Resmi PASKUS Gi1 | So-791 Komando</title>
        <meta name="description" content="Struktur komando resmi, jenjang pangkat, dan daftar personel aktif PASKUS Gi1 So-791." />
      </Helmet>
      <StrukturalFeature />
    </>
  );
};

export default Struktural;
