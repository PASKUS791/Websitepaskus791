import { useState, useEffect, useCallback } from "react";

/**
 * Hook to manage browser Location Consent for anti-bot protection.
 * browser geolocation api to location-consent.php
 */
export function useLocationConsent() {
  const [locationState, setLocationState] = useState({
    loading: true,
    hasLocationCode: false,
    locationCodeHint: "",
  });

  const checkLocationStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/location-consent.php", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status" }),
      });
      const data = response.ok ? await response.json().catch(() => null) : null;
      if (data && data.ok) {
        setLocationState({
          loading: false,
          hasLocationCode: Boolean(data.has_location_code),
          locationCodeHint: data.code_hint || "",
        });
      } else {
        setLocationState({ loading: false, hasLocationCode: false, locationCodeHint: "" });
      }
    } catch (error) {
      console.warn("Failed to check location consent status:", error);
      setLocationState({ loading: false, hasLocationCode: false, locationCodeHint: "" });
    }
  }, []);

  useEffect(() => {
    checkLocationStatus();
  }, [checkLocationStatus]);

  const requestConsent = useCallback(async () => {
    if (!window.isSecureContext || !navigator.geolocation) {
      throw new Error("Browser Anda tidak mendukung verifikasi lokasi.");
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const coords = position.coords || {};
            const storePayload = {
              action: "store",
              consent_version: "2026-05-location-consent-v1",
              collected_at: new Date().toISOString(),
              page: window.location.href,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
              language: navigator.language || document.documentElement.lang || "id",
              platform: navigator.userAgentData?.platform || navigator.platform || "",
              coords: {
                latitude: coords.latitude,
                longitude: coords.longitude,
                accuracy: coords.accuracy,
                altitude: coords.altitude,
                altitudeAccuracy: coords.altitudeAccuracy,
                heading: coords.heading,
                speed: coords.speed,
              },
            };

            // 1. Store location consent
            const storeResponse = await fetch("/api/location-consent.php", {
              method: "POST",
              credentials: "same-origin",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(storePayload),
            });
            const storeData = storeResponse.ok ? await storeResponse.json().catch(() => null) : null;
            if (!storeData || !storeData.ok) {
              throw new Error("Gagal menyimpan data verifikasi lokasi.");
            }

            // 2. Attach stored location to Discord session
            const attachResponse = await fetch("/api/location-consent.php", {
              method: "POST",
              credentials: "same-origin",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "attach-discord" }),
            });
            const attachData = attachResponse.ok ? await attachResponse.json().catch(() => null) : null;
            
            // Re-fetch status
            await checkLocationStatus();
            resolve(true);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          let msg = "Akses lokasi ditolak.";
          if (error.code === error.TIMEOUT) msg = "Waktu verifikasi lokasi habis.";
          if (error.code === error.POSITION_UNAVAILABLE) msg = "Lokasi tidak tersedia.";
          reject(new Error(msg));
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 9000,
        }
      );
    });
  }, [checkLocationStatus]);

  return {
    ...locationState,
    requestConsent,
    refetch: checkLocationStatus,
  };
}
