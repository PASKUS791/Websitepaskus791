import React from "react";
import HeroSection from "./components/HeroSection";
import MapSection from "./components/MapSection";
import ModuleOverview from "./components/ModuleOverview";
import CombatSection from "./components/CombatSection";
import SupportSection from "./components/SupportSection";
import EventsSection from "./components/EventsSection";
import EnlistForm from "./components/EnlistForm";
import AiService from "./components/AiService";

export default function HomeFeature() {
  return (
    <>
      {/* Hero Section Banner */}
      <HeroSection />

      {/* Indonesia Member Geographical Presence */}
      <MapSection />

      {/* Tactical Modules Info */}
      <ModuleOverview />

      {/* Special Combat Squadrons */}
      <CombatSection />

      {/* Support Specialized Divisions */}
      <SupportSection />

      {/* Training Scenarios and Group Schedules */}
      <EventsSection />

      {/* Admission Registrations and Webhooks */}
      <EnlistForm />

      {/* AI Chatbot Helper Panel */}
      <AiService />
    </>
  );
}
