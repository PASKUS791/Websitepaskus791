import React from "react";
import { Helmet } from "react-helmet-async";
import { ResimenBrm5Feature } from "@/features/brm5";

const ResimenBrm5 = () => {
  return (
    <>
      <Helmet>
        <title>Resimen BRM5 Indonesia PASKUS Gi1 | So-791</title>
        <meta
          name="description"
          content="PASKUS Gi1 is a BRM5 roleplay regiment in Indonesia for Blackhawk Rescue Mission 5 players looking for BRM5 roleplay groups, fractions, units, and official enrollment via So-791 Discord."
        />
      </Helmet>
      <ResimenBrm5Feature />
    </>
  );
};

export default ResimenBrm5;
