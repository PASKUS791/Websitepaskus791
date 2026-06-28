import React from "react";
import { Helmet } from "react-helmet-async";
import { FraksiBrm5Feature } from "@/features/brm5";

const FraksiBrm5 = () => {
  return (
    <>
      <Helmet>
        <title>Blackhawk Rescue 5 Roleplay Fraksi Indonesia | PASKUS Gi1</title>
        <meta
          name="description"
          content="PASKUS Gi1 adalah fraksi dan resimen roleplay Blackhawk Rescue Mission 5 Indonesia dengan Discord resmi, unit So-791, pendaftaran personel, dan struktur komunitas."
        />
      </Helmet>
      <FraksiBrm5Feature />
    </>
  );
};

export default FraksiBrm5;
