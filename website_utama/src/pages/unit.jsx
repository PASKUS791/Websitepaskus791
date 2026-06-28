import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { UNIT_DETAIL_MAP } from "@/data/unitDetail.js";
import UnitFeature from "@/features/unit";

const Unit = () => {
  const { namaUnit } = useParams();
  const rawKey = (namaUnit || "").toLowerCase();
  const unitNameKey = rawKey === "toruk" ? "toruk-makto" : rawKey;
  const unit = UNIT_DETAIL_MAP[unitNameKey];

  return (
    <>
      <Helmet>
        <title>PASKUS 791 - {unit?.h1 || "Unit Operasional"}</title>
        <meta
          name="description"
          content={`Halaman rekrutmen resmi untuk unit ${unit?.h1 || "Operasional"} di PASKUS-791.`}
        />
        <meta property="og:title" content={`PASKUS 791 - ${unit?.h1 || "Unit Operasional"}`} />
        <meta
          property="og:description"
          content={`Bergabunglah dengan unit ${unit?.h1 || "Operasional"} sekarang.`}
        />
      </Helmet>
      <UnitFeature />
    </>
  );
};

export default Unit;
