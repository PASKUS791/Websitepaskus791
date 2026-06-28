import React from "react";
import { Helmet } from "react-helmet-async";
import StreamerProfileFeature from "@/features/streamer/profile";

const StreamerProfile = () => {
  return (
    <>
      <Helmet>
        <title>Creator Profile | Streamer PASKUS791</title>
        <meta
          name="description"
          content="Content creator and streamer resmi resimen PASKUS791 untuk game BRM5 roleplay."
        />
      </Helmet>
      <StreamerProfileFeature />
    </>
  );
};

export default StreamerProfile;
