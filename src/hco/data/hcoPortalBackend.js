/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: HCO / Backend Adapter
 * Purpose: Menyatukan operasi data HCO agar strukturnya setara dengan adapter backend staff.
 */

import { PRIMARY_HCO_ADMIN_USERNAME } from "../hcoAccess";
import {
  createHcoUserAccount,
  deleteHcoUserAccount,
  dispatchHcoStrategicSave,
  fetchHcoResource,
  listHcoUsersApi,
  saveHcoResource,
} from "../../lib/hcoApi";
import { RESOURCE_KEYS } from "../../lib/resources";

function cloneArray(value) {
  return Array.isArray(value) ? [...value] : [];
}

export function createEmptyHcoPortalSnapshot() {
  return {
    plannerState: null,
    customMaps: [],
    strategicSaves: [],
    mapPlannerUsers: [],
    users: [],
  };
}

function isPrimaryAdminUser(user) {
  return String(user?.username || "").trim().toLowerCase() === PRIMARY_HCO_ADMIN_USERNAME;
}

function filterStrategicSavesByUser(saves, user) {
  if (isPrimaryAdminUser(user)) {
    return cloneArray(saves);
  }

  const normalizedUsername = String(user?.username || "").trim().toLowerCase();
  return cloneArray(saves).filter(
    (entry) => String(entry.ownerUsername || "").trim().toLowerCase() === normalizedUsername,
  );
}

export async function fetchHcoPortalSnapshot(currentUser = null) {
  const [plannerState, customMaps, strategicSaves, mapPlannerUsers, usersPayload] =
    await Promise.all([
      fetchHcoResource(RESOURCE_KEYS.hcoPlannerState),
      fetchHcoResource(RESOURCE_KEYS.hcoCustomMaps),
      fetchHcoResource(RESOURCE_KEYS.hcoStrategicSaves),
      fetchHcoResource(RESOURCE_KEYS.hcoMapPlannerUsers),
      isPrimaryAdminUser(currentUser)
        ? listHcoUsersApi().catch(() => ({ users: [] }))
        : Promise.resolve({ users: [] }),
    ]);

  return {
    plannerState: plannerState || null,
    customMaps: cloneArray(customMaps),
    strategicSaves: filterStrategicSavesByUser(cloneArray(strategicSaves), currentUser),
    mapPlannerUsers: cloneArray(mapPlannerUsers),
    users: Array.isArray(usersPayload?.users) ? usersPayload.users : [],
  };
}

export async function fetchHcoPlannerUsers() {
  const payload = await listHcoUsersApi();
  return Array.isArray(payload?.users) ? payload.users : [];
}

export async function createHcoPlannerUser(formState) {
  return createHcoUserAccount(formState);
}

export async function removeHcoPlannerUser(username) {
  return deleteHcoUserAccount(username);
}

export async function persistHcoResource(resourceKey, value) {
  return saveHcoResource(resourceKey, value);
}

export async function dispatchHcoStrategicSnapshot(saveId) {
  return dispatchHcoStrategicSave(saveId);
}
