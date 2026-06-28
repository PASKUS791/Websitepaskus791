import React from "react";
import { Helmet } from "react-helmet-async";
import { Brm5RoleplayFeature } from "@/features/brm5";

const Brm5Roleplay = () => {
  return (
    <>
      <Helmet>
        <title>Resimen BRM5 Roleplay Indonesia | PASKUS Gi1</title>
        <meta
          name="description"
          content="PASKUS Gi1 is a BRM5 roleplay regiment in Indonesia for Blackhawk Rescue Mission 5 players looking for BRM5 roleplay groups, fractions, units, and official enrollment via So-791 Discord."
        />
      </Helmet>
      <Brm5RoleplayFeature />
    </>
  );
};

export default Brm5Roleplay;
