import React from "react";
import { Helmet } from "react-helmet-async";
import { RoleplayGrupBrm5Feature } from "@/features/brm5";

const RoleplayGrupBrm5 = () => {
  return (
    <>
      <Helmet>
        <title>Roleplay Grup BRM5 Indonesia | PASKUS Gi1</title>
        <meta
          name="description"
          content="PASKUS Gi1 adalah roleplay grup BRM5 Indonesia untuk Blackhawk Rescue Mission 5 dengan komunitas Discord, pendaftaran anggota, unit tempur, dan struktur So-791."
        />
      </Helmet>
      <RoleplayGrupBrm5Feature />
    </>
  );
};

export default RoleplayGrupBrm5;
