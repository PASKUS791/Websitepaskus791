import React from "react";
import { Helmet } from "react-helmet-async";
import StreamersFeature from "@/features/streamer";

const Streamers = () => {
  return (
    <>
      <Helmet>
        <title>Streamer Hub PASKUS Gi1 | Karya So-791</title>
        <meta
          name="description"
          content="Streamer Hub resmi PASKUS Gi1: highlight operasi, profil creator, dokumentasi event, dan karya visual So-791."
        />
      </Helmet>
      <StreamersFeature />
    </>
  );
};

export default Streamers;
