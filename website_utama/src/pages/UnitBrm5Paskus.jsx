import React from "react";
import { Helmet } from "react-helmet-async";
import { UnitBrm5PaskusFeature } from "@/features/brm5";

const UnitBrm5Paskus = () => {
  return (
    <>
      <Helmet>
        <title>Unit BRM5 PASKUS Gi1 | Unit Tempur dan Dinas So-791</title>
        <meta
          name="description"
          content="Informasi unit BRM5 PASKUS Gi1, termasuk GATAM, BRINGAS, TORUK MAKTO, SIERRA, PATHFINDER, SENTINEL, KOMODO, dan dinas non-tempur So-791."
        />
      </Helmet>
      <UnitBrm5PaskusFeature />
    </>
  );
};

export default UnitBrm5Paskus;
