/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Script: Reset and seed local dashboard database for testing.
 */

import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const projectRoot = resolve(import.meta.dirname, "..");
const databasePath = resolve(projectRoot, "server/data/pelatihdash.sqlite");
const envPath = resolve(projectRoot, ".env");

function parseEnvFile(path) {
  const env = {};
  const raw = readFileSync(path, "utf8");

  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  });

  return env;
}

const env = parseEnvFile(envPath);
const pepper = env.APP_PASSWORD_PEPPER || "";
const scryptN = Number.parseInt(env.APP_HASH_SCRYPT_N || "16384", 10);
const scryptR = Number.parseInt(env.APP_HASH_SCRYPT_R || "8", 10);
const scryptP = Number.parseInt(env.APP_HASH_SCRYPT_P || "1", 10);
const scryptOptions = {
  N: scryptN,
  r: scryptR,
  p: scryptP,
  maxmem: Math.max(64 * 1024 * 1024, 128 * scryptN * scryptR * scryptP),
};
const nowIso = new Date().toISOString();
const commonPassword = "Paskus123";

function hashPassword(password) {
  const salt = randomBytes(16).toString("base64url");
  const derivedKey = scryptSync(
    `${String(password || "")}${pepper}`,
    salt,
    64,
    scryptOptions,
  ).toString("base64url");
  return `scrypt$${scryptN}$${scryptR}$${scryptP}$${salt}$${derivedKey}`;
}

function buildCandidateSeeds() {
  const sipilFirstNames = [
    "Aldo",
    "Rifka",
    "Dimas",
    "Putri",
    "Yoga",
    "Rama",
    "Nadya",
    "Fikri",
    "Tegar",
    "Salsa",
    "Bima",
    "Alya",
    "Reza",
    "Naufal",
    "Tiara",
    "Fauzan",
    "Dinda",
    "Raka",
    "Citra",
    "Galih",
    "Intan",
    "Bagas",
    "Nabila",
    "Rizky",
    "Shela",
  ];
  const sipilLastNames = [
    "Pratama",
    "Nabila",
    "Reno",
    "Aksa",
    "Fadli",
    "Mahesa",
    "Anindya",
    "Herlambang",
    "Saputra",
    "Maharani",
    "Ardana",
    "Putri",
    "Akbar",
    "Ramadhan",
    "Lestari",
    "Maulana",
    "Permata",
    "Wijaya",
    "Larissa",
    "Mahardika",
    "Safitri",
    "Kusuma",
    "Rahma",
    "Aditya",
    "Valencia",
  ];
  const pmcNames = [
    "VantaMerc",
    "NyraContract",
    "RogueAtlas",
    "KestrelPMC",
    "MakoStrike",
    "RavenLock",
    "BravoSpecter",
    "HelixWard",
    "IronFalcon",
    "NovaShield",
    "VectorRidge",
    "ObsidianFox",
    "TitanRook",
    "GhostHarbor",
    "CrimsonVale",
    "DeltaHowl",
    "QuartzViper",
    "AegisDrift",
    "NightSaber",
    "KodiakLine",
    "ZeroTrident",
    "AtlasCrow",
    "ViperTalon",
    "StormLedger",
    "BlackForge",
  ];

  const candidates = [];

  for (let index = 0; index < 25; index += 1) {
    const roblox = `${sipilFirstNames[index]}${sipilLastNames[index]}`;

    candidates.push({
      id: `sipil-${index + 1}`,
      roblox,
      discord: `${roblox.toLowerCase()}#${String(3101 + index).padStart(4, "0")}`,
      age: 18 + (index % 10),
      gender: index % 3 === 0 ? "Perempuan" : "Laki-Laki",
      category: "sipil",
      createdAt: nowIso,
      updatedAt: nowIso,
    });
  }

  for (let index = 0; index < 25; index += 1) {
    const roblox = pmcNames[index];

    candidates.push({
      id: `pmc-${index + 1}`,
      roblox,
      discord: `${roblox.toLowerCase()}#${String(7301 + index).padStart(4, "0")}`,
      age: 21 + (index % 12),
      gender: index % 4 === 1 ? "Perempuan" : "Laki-Laki",
      category: "pmc",
      createdAt: nowIso,
      updatedAt: nowIso,
    });
  }

  return candidates;
}

const trainerSeeds = [
  { username: "paskusadmin", label: "Paskus Admin", unit: "PASKUS 791" },
  { username: "cpt.nova", label: "CPT. Nova", unit: "Ops Chamber Sigma" },
  { username: "cpt.price", label: "CPT. Price", unit: "Ops Chamber Alpha" },
  { username: "lt.ghost", label: "LT. Ghost", unit: "Ops Chamber Echo" },
  { username: "maj.payne", label: "MAJ. Payne", unit: "Ops Chamber Delta" },
  { username: "sgt.miller", label: "SGT. Miller", unit: "Ops Chamber Bravo" },
  { username: "capt.reza", label: "CAPT. Reza", unit: "Ops Chamber Orion" },
  { username: "lt.rama", label: "LT. Rama", unit: "Ops Chamber Falcon" },
  { username: "sgt.aria", label: "SGT. Aria", unit: "Ops Chamber Atlas" },
  { username: "wo.delta", label: "WO. Delta", unit: "Ops Chamber Vanguard" },
];

const db = new DatabaseSync(databasePath);
db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;");

const upsertResourceStatement = db.prepare(`
  INSERT INTO resources (name, scope, value_json, updated_at)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(name) DO UPDATE SET
    scope = excluded.scope,
    value_json = excluded.value_json,
    updated_at = excluded.updated_at
`);
const deletePelatihSessionsStatement = db.prepare(
  "DELETE FROM sessions WHERE scope = 'pelatih'",
);
const deletePelatihUsersStatement = db.prepare(
  "DELETE FROM users WHERE scope = 'pelatih'",
);
const insertUserStatement = db.prepare(`
  INSERT INTO users (scope, username, label, unit, password_hash, active, created_at, updated_at)
  VALUES ('pelatih', ?, ?, ?, ?, 1, ?, ?)
`);

const candidates = buildCandidateSeeds();

db.exec("BEGIN");
try {
  deletePelatihSessionsStatement.run();
  deletePelatihUsersStatement.run();

  trainerSeeds.forEach((trainer) => {
    insertUserStatement.run(
      trainer.username,
      trainer.label,
      trainer.unit,
      hashPassword(commonPassword),
      nowIso,
      nowIso,
    );
  });

  upsertResourceStatement.run(
    "dashboard.candidates",
    "pelatih",
    JSON.stringify(candidates),
    nowIso,
  );
  upsertResourceStatement.run(
    "dashboard.schedules",
    "pelatih",
    JSON.stringify([]),
    nowIso,
  );
  upsertResourceStatement.run(
    "dashboard.reports",
    "pelatih",
    JSON.stringify([]),
    nowIso,
  );
  upsertResourceStatement.run(
    "dashboard.trainingSessions",
    "pelatih",
    JSON.stringify([]),
    nowIso,
  );
  db.exec("COMMIT");
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
}

const trainerCount = db
  .prepare("SELECT COUNT(*) AS count FROM users WHERE scope = 'pelatih' AND active = 1")
  .get().count;

console.log(
  JSON.stringify(
    {
      ok: true,
      trainerCount,
      candidateCount: candidates.length,
      password: commonPassword,
    },
    null,
    2,
  ),
);
