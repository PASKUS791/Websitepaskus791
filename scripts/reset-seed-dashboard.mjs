/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Script: Reset and seed dashboard data for MongoDB testing.
 */

import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { MongoClient } from "mongodb";

const projectRoot = resolve(import.meta.dirname, "..");
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

function inferMongoDbName(uri, fallback = "pelatihdash") {
  try {
    const parsed = new URL(uri);
    const pathName = parsed.pathname.replace(/^\/+/, "").trim();
    return pathName || fallback;
  } catch {
    return fallback;
  }
}

const env = parseEnvFile(envPath);
const mongodbUri = String(env.MONGODB_URI || env.APP_MONGODB_URI || "").trim();
const mongodbDbName = String(
  env.MONGODB_DB_NAME || env.APP_MONGODB_DB_NAME || "pelatihdash",
).trim();

if (!mongodbUri) {
  throw new Error("MONGODB_URI wajib diisi sebelum menjalankan reset seed MongoDB.");
}

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

const candidates = buildCandidateSeeds();
const client = new MongoClient(mongodbUri, {
  ignoreUndefined: true,
});

await client.connect();

try {
  const database = client.db(inferMongoDbName(mongodbUri, mongodbDbName));
  const users = database.collection("users");
  const sessions = database.collection("sessions");
  const resources = database.collection("resources");

  await Promise.all([
    users.createIndex({ scope: 1, username: 1 }, { unique: true }),
    sessions.createIndex({ sessionId: 1 }, { unique: true }),
    resources.createIndex({ name: 1 }, { unique: true }),
  ]);

  await sessions.deleteMany({ scope: "pelatih" });
  await users.deleteMany({ scope: "pelatih" });

  await users.insertMany(
    trainerSeeds.map((trainer) => ({
      scope: "pelatih",
      username: trainer.username,
      label: trainer.label,
      unit: trainer.unit,
      passwordHash: hashPassword(commonPassword),
      active: true,
      createdAt: nowIso,
      updatedAt: nowIso,
    })),
  );

  const resourceEntries = [
    {
      name: "dashboard.candidates",
      scope: "pelatih",
      value: candidates,
    },
    {
      name: "dashboard.schedules",
      scope: "pelatih",
      value: [],
    },
    {
      name: "dashboard.reports",
      scope: "pelatih",
      value: [],
    },
    {
      name: "dashboard.trainingSessions",
      scope: "pelatih",
      value: [],
    },
  ];

  await Promise.all(
    resourceEntries.map((entry) =>
      resources.updateOne(
        { name: entry.name },
        {
          $set: {
            scope: entry.scope,
            value: entry.value,
            updatedAt: nowIso,
          },
        },
        { upsert: true },
      ),
    ),
  );

  const trainerCount = await users.countDocuments({
    scope: "pelatih",
    active: { $ne: false },
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        database: "mongodb",
        databaseName: inferMongoDbName(mongodbUri, mongodbDbName),
        trainerCount,
        candidateCount: candidates.length,
        password: commonPassword,
      },
      null,
      2,
    ),
  );
} finally {
  await client.close();
}
