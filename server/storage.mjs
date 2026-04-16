/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Server / MongoDB Storage
 * Purpose: Menjadi data layer tunggal backend untuk deploy dan lokal berbasis MongoDB.
 */

import { MongoClient, ObjectId } from "mongodb";

function cloneValue(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
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

function mapUserDocument(document) {
  if (!document) {
    return null;
  }

  return {
    id: String(document._id),
    scope: document.scope,
    username: document.username,
    label: document.label,
    unit: document.unit ?? null,
    passwordHash: document.passwordHash,
    active: document.active !== false ? 1 : 0,
  };
}

export async function createStorage({
  mongodbUri,
  mongodbDbName,
  resourceScopes,
  resourceDefaults,
}) {
  if (!mongodbUri) {
    throw new Error(
      "MONGODB_URI wajib diisi. Backend sekarang hanya mendukung MongoDB.",
    );
  }

  const client = new MongoClient(mongodbUri, {
    ignoreUndefined: true,
  });
  await client.connect();

  const databaseName = inferMongoDbName(mongodbUri, mongodbDbName);
  const database = client.db(databaseName);
  const users = database.collection("users");
  const sessions = database.collection("sessions");
  const resources = database.collection("resources");

  await Promise.all([
    users.createIndex({ scope: 1, username: 1 }, { unique: true }),
    sessions.createIndex({ sessionId: 1 }, { unique: true }),
    sessions.createIndex({ expiresAt: 1 }),
    resources.createIndex({ name: 1 }, { unique: true }),
  ]);

  async function mapSessionDocument(document) {
    if (!document) {
      return null;
    }

    let user = null;

    if (document.userId) {
      try {
        user = await users.findOne({ _id: new ObjectId(String(document.userId)) });
      } catch {
        user = null;
      }
    }

    if (!user) {
      return null;
    }

    return {
      sessionId: document.sessionId,
      scope: document.scope,
      expiresAt: document.expiresAt,
      ipAddress: document.ipAddress,
      userAgent: document.userAgent,
      userId: String(user._id),
      username: user.username,
      label: user.label,
      unit: user.unit,
      active: user.active !== false ? 1 : 0,
    };
  }

  return {
    kind: "mongodb",
    databaseName,
    async ensureResourceDefaults() {
      const timestamp = new Date().toISOString();
      await Promise.all(
        Object.entries(resourceDefaults).map(async ([resourceName, defaultValue]) => {
          const existing = await resources.findOne({ name: resourceName });

          if (!existing) {
            await resources.insertOne({
              name: resourceName,
              scope: resourceScopes[resourceName],
              value: cloneValue(defaultValue),
              updatedAt: timestamp,
            });
          }
        }),
      );
    },
    async seedUser(user) {
      await users.updateOne(
        {
          scope: user.scope,
          username: user.username,
        },
        {
          $set: {
            label: user.label,
            unit: user.unit ?? null,
            passwordHash: user.passwordHash,
            active: true,
            updatedAt: user.updatedAt,
          },
          $setOnInsert: {
            createdAt: user.createdAt,
          },
        },
        { upsert: true },
      );
    },
    async getResource(name) {
      const document = await resources.findOne({ name });

      if (!document) {
        return null;
      }

      return {
        name: document.name,
        scope: document.scope,
        updatedAt: document.updatedAt,
        value: document.value ?? cloneValue(resourceDefaults[name]),
      };
    },
    async putResource(name, scope, value, updatedAt) {
      await resources.updateOne(
        { name },
        {
          $set: {
            scope,
            value,
            updatedAt,
          },
        },
        { upsert: true },
      );

      return {
        name,
        scope,
        updatedAt,
        value,
      };
    },
    async cleanupExpiredSessions(currentIso) {
      await sessions.deleteMany({
        expiresAt: { $lte: currentIso },
      });
    },
    async createSession(session) {
      await sessions.insertOne({
        sessionId: session.sessionId,
        userId: String(session.userId),
        scope: session.scope,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
      });
    },
    async getSessionWithUser(sessionId) {
      const session = await sessions.findOne({ sessionId });
      return mapSessionDocument(session);
    },
    async deleteSession(sessionId) {
      await sessions.deleteOne({ sessionId });
    },
    async deleteSessionsByUser(userId) {
      await sessions.deleteMany({ userId: String(userId) });
    },
    async updateUserPassword(userId, passwordHash, updatedAt) {
      await users.updateOne(
        { _id: new ObjectId(String(userId)) },
        {
          $set: {
            passwordHash,
            updatedAt,
          },
        },
      );
    },
    async getUserByScopeAndUsername(scope, username) {
      const user = await users.findOne({
        scope,
        username,
      });
      return mapUserDocument(user);
    },
    async listUsersByScope(scope) {
      const result = await users
        .find({
          scope,
          active: { $ne: false },
        })
        .sort({
          label: 1,
          username: 1,
        })
        .toArray();

      return result.map((entry) => ({
        id: String(entry._id),
        scope: entry.scope,
        username: entry.username,
        label: entry.label,
        unit: entry.unit ?? null,
      }));
    },
    async createUser(user) {
      const result = await users.insertOne({
        scope: user.scope,
        username: user.username,
        label: user.label,
        unit: user.unit ?? null,
        passwordHash: user.passwordHash,
        active: true,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      return {
        id: String(result.insertedId),
        ...user,
        active: 1,
      };
    },
    async upsertUser(user) {
      const existing = await users.findOne({
        scope: user.scope,
        username: user.username,
      });
      const createdAt = existing?.createdAt || user.createdAt;

      await users.updateOne(
        {
          scope: user.scope,
          username: user.username,
        },
        {
          $set: {
            label: user.label,
            unit: user.unit ?? null,
            active: user.active !== false,
            updatedAt: user.updatedAt,
            ...(user.passwordHash ? { passwordHash: user.passwordHash } : {}),
          },
          $setOnInsert: {
            createdAt,
            passwordHash: user.passwordHash ?? existing?.passwordHash ?? "",
          },
        },
        { upsert: true },
      );

      const nextUser = await users.findOne({
        scope: user.scope,
        username: user.username,
      });

      return mapUserDocument(nextUser);
    },
    async deleteUserByScopeAndUsername(scope, username) {
      await users.deleteOne({
        scope,
        username,
      });
    },
    async countUsersByScope(scope) {
      return users.countDocuments({
        scope,
        active: { $ne: false },
      });
    },
    async countActiveSessions(currentIso) {
      return sessions.countDocuments({
        expiresAt: { $gt: currentIso },
      });
    },
    async countResources() {
      return resources.countDocuments({});
    },
    async close() {
      await client.close();
    },
  };
}
