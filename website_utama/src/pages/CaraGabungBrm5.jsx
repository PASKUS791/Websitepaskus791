import React from "react";
import { Helmet } from "react-helmet-async";
import { CaraGabungBrm5Feature } from "@/features/brm5";

const CaraGabungBrm5 = () => {
  return (
    <>
      <Helmet>
        <title>Cara Gabung BRM5 Roleplay PASKUS Gi1 | Pendaftaran Discord</title>
        <meta
          name="description"
          content="Panduan singkat cara gabung BRM5 roleplay PASKUS Gi1 melalui sinkronisasi Discord, pendaftaran personel, pemilihan golongan, dan arahan perekrut So-791."
        />
      </Helmet>
      <CaraGabungBrm5Feature />
    </>
  );
};

export default CaraGabungBrm5;
