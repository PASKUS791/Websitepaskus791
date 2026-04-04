/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: HCO / Access Helpers
 * Purpose: Menyatukan default akses route HCO dan pengecekan admin utama.
 */

export const DEFAULT_HCO_ACCESS = {
  mainPlanner: true,
  customMaps: true,
  saves: true,
};

export const PRIMARY_HCO_ADMIN_USERNAME = "cosmohco";

export function normalizeHcoUsername(username) {
  return String(username || "").trim().toLowerCase();
}

export function isPrimaryHcoAdminUser(user) {
  return normalizeHcoUsername(user?.username) === PRIMARY_HCO_ADMIN_USERNAME;
}

export function normalizeHcoAccessEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const username = normalizeHcoUsername(entry.username);

  if (!username) {
    return null;
  }

  return {
    username,
    access: {
      mainPlanner: entry.access?.mainPlanner !== false,
      customMaps: entry.access?.customMaps !== false,
      saves: entry.access?.saves !== false,
    },
    updatedAt:
      typeof entry.updatedAt === "string" && entry.updatedAt
        ? entry.updatedAt
        : new Date().toISOString(),
  };
}

export function normalizeHcoAccessEntries(value) {
  return Array.isArray(value)
    ? value.map((entry) => normalizeHcoAccessEntry(entry)).filter(Boolean)
    : [];
}

export function getHcoAccessForUser(user, accessEntries = []) {
  if (isPrimaryHcoAdminUser(user)) {
    return DEFAULT_HCO_ACCESS;
  }

  const username = normalizeHcoUsername(user?.username);
  const matchedEntry = accessEntries.find(
    (entry) => normalizeHcoUsername(entry.username) === username,
  );

  if (!matchedEntry) {
    return DEFAULT_HCO_ACCESS;
  }

  return {
    mainPlanner: matchedEntry.access?.mainPlanner !== false,
    customMaps: matchedEntry.access?.customMaps !== false,
    saves: matchedEntry.access?.saves !== false,
  };
}
