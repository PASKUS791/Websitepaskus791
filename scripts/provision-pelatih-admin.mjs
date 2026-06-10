import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync } from "node:fs";
import { MongoClient } from "mongodb";

function parseEnvFile(path) {
  const env = {};
  const text = readFileSync(path, "utf8");

  text.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      return;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      return;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();
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

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeScryptCost(value, fallback) {
  const parsed = parsePositiveInt(value, fallback);
  return parsed > 1 && (parsed & (parsed - 1)) === 0 ? parsed : fallback;
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

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

function normalizeDiscordUserId(value) {
  return String(value || "").replace(/\D/g, "");
}

function hashPassword(password, env) {
  const N = normalizeScryptCost(env.APP_HASH_SCRYPT_N, 16384);
  const r = parsePositiveInt(env.APP_HASH_SCRYPT_R, 8);
  const p = parsePositiveInt(env.APP_HASH_SCRYPT_P, 1);
  const maxmem = Math.max(64 * 1024 * 1024, 128 * N * r * p);
  const salt = randomBytes(16).toString("base64url");
  const pepper = String(env.APP_PASSWORD_PEPPER || "");
  const derivedKey = scryptSync(`${password}${pepper}`, salt, 64, {
    N,
    r,
    p,
    maxmem,
  }).toString("base64url");

  return `scrypt$${N}$${r}$${p}$${salt}$${derivedKey}`;
}

async function main() {
  const env = parseEnvFile("deploy/staff.paskus791.cloud.env");
  const uri = String(env.MONGODB_URI || "").trim();
  const databaseName = String(
    env.MONGODB_DB_NAME || inferMongoDbName(uri),
  ).trim();
  const username = normalizeUsername(env.PELATIH_ADMIN_USERNAME);
  const password = String(env.PELATIH_ADMIN_PASSWORD || "");
  const label = String(env.PELATIH_ADMIN_LABEL || "Paskus Admin").trim();
  const unit = String(env.PELATIH_ADMIN_UNIT || "PASKUS 791").trim();
  const discordUserId = normalizeDiscordUserId(
    env.PELATIH_ADMIN_DISCORD_USER_ID || env.PELATIH_ADMIN_DISCORD_ID,
  );

  if (!uri || !databaseName || !username || !password) {
    throw new Error(
      "MONGODB_URI, MONGODB_DB_NAME, PELATIH_ADMIN_USERNAME, dan PELATIH_ADMIN_PASSWORD wajib tersedia.",
    );
  }

  const client = new MongoClient(uri, { ignoreUndefined: true });
  await client.connect();

  try {
    const database = client.db(databaseName);
    const users = database.collection("users");
    const sessions = database.collection("sessions");
    const resources = database.collection("resources");
    const now = new Date().toISOString();

    await users.createIndex({ scope: 1, username: 1 }, { unique: true });

    const existingUser = await users.findOne({ scope: "pelatih", username });
    await users.updateOne(
      { scope: "pelatih", username },
      {
        $set: {
          scope: "pelatih",
          username,
          label,
          unit,
          passwordHash: hashPassword(password, env),
          active: true,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true },
    );

    const user = await users.findOne({ scope: "pelatih", username });
    await sessions.deleteMany({ userId: String(user._id) });

    const sharedName = "staffPortal.shared";
    const existingShared = await resources.findOne({ name: sharedName });
    const sharedValue =
      existingShared?.value && typeof existingShared.value === "object"
        ? existingShared.value
        : {};
    const operators = Array.isArray(sharedValue.operators)
      ? sharedValue.operators
      : [];
    const nextOperator = {
      id: String(user._id),
      username,
      label,
      unit,
      discordUserId,
    };
    const nextOperators = [
      ...operators.filter((entry) => normalizeUsername(entry?.username) !== username),
      nextOperator,
    ].sort((left, right) =>
      String(left.label || left.username).localeCompare(
        String(right.label || right.username),
        "id-ID",
      ),
    );
    const nextSharedValue = {
      operators: nextOperators,
      sessionMetaMap:
        sharedValue.sessionMetaMap && typeof sharedValue.sessionMetaMap === "object"
          ? sharedValue.sessionMetaMap
          : {},
      reportMetaMap:
        sharedValue.reportMetaMap && typeof sharedValue.reportMetaMap === "object"
          ? sharedValue.reportMetaMap
          : {},
      candidateMetaMap:
        sharedValue.candidateMetaMap && typeof sharedValue.candidateMetaMap === "object"
          ? sharedValue.candidateMetaMap
          : {},
    };

    await resources.updateOne(
      { name: sharedName },
      {
        $set: {
          name: sharedName,
          scope: "pelatih",
          value: nextSharedValue,
          updatedAt: now,
        },
      },
      { upsert: true },
    );

    console.log(
      JSON.stringify(
        {
          ok: true,
          account: {
            scope: "pelatih",
            username,
            label,
            unit,
            id: String(user._id),
          },
          wasExisting: Boolean(existingUser),
          operatorDirectoryCount: nextOperators.length,
          updatedAt: now,
        },
        null,
        2,
      ),
    );
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
