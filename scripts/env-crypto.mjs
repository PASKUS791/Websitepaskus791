/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Environment Crypto Utility
 * Purpose: Mengenkripsi file env agar aman disimpan di repository tanpa membocorkan secret.
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const DEFAULT_INPUT_PATH = resolve(projectRoot, ".env.production");
const DEFAULT_OUTPUT_PATH = resolve(projectRoot, "deploy/staff.paskus791.cloud.env.enc");
const DEFAULT_KEY_PATH = resolve(projectRoot, ".env.production.key");
const ENVELOPE_VERSION = 1;

function parseArgs(argv) {
  const [, , command = "encrypt", ...rest] = argv;
  const options = {
    input: command === "decrypt" ? DEFAULT_OUTPUT_PATH : DEFAULT_INPUT_PATH,
    output:
      command === "decrypt"
        ? resolve(projectRoot, ".env.production.restored")
        : DEFAULT_OUTPUT_PATH,
    keyFile: DEFAULT_KEY_PATH,
  };

  for (let index = 0; index < rest.length; index += 1) {
    const current = rest[index];
    const next = rest[index + 1];

    if (current === "--input" && next) {
      options.input = resolve(projectRoot, next);
      index += 1;
      continue;
    }

    if (current === "--output" && next) {
      options.output = resolve(projectRoot, next);
      index += 1;
      continue;
    }

    if (current === "--key-file" && next) {
      options.keyFile = resolve(projectRoot, next);
      index += 1;
      continue;
    }
  }

  return {
    command,
    options,
  };
}

function ensureParentDirectory(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

function readPassphrase(keyFile, { allowGenerate = false } = {}) {
  const envKey = String(process.env.PASKUS_ENV_KEY || "").trim();

  if (envKey) {
    return envKey;
  }

  if (existsSync(keyFile)) {
    return String(readFileSync(keyFile, "utf8")).trim();
  }

  if (!allowGenerate) {
    throw new Error(
      `Kunci enkripsi tidak ditemukan. Isi PASKUS_ENV_KEY atau sediakan file ${keyFile}.`,
    );
  }

  const generated = randomBytes(32).toString("base64url");
  ensureParentDirectory(keyFile);
  writeFileSync(keyFile, `${generated}\n`, { mode: 0o600 });
  chmodSync(keyFile, 0o600);
  return generated;
}

function encodeBase64(buffer) {
  return Buffer.from(buffer).toString("base64");
}

function decodeBase64(value, fieldName) {
  try {
    return Buffer.from(String(value || ""), "base64");
  } catch {
    throw new Error(`Field ${fieldName} tidak valid pada file terenkripsi.`);
  }
}

function createEnvelope(plaintextBuffer, passphrase, sourcePath) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = scryptSync(passphrase, salt, 32);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintextBuffer), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    version: ENVELOPE_VERSION,
    algorithm: "aes-256-gcm",
    kdf: "scrypt",
    createdAt: new Date().toISOString(),
    source: sourcePath,
    salt: encodeBase64(salt),
    iv: encodeBase64(iv),
    tag: encodeBase64(tag),
    ciphertext: encodeBase64(ciphertext),
  };
}

function decryptEnvelope(envelope, passphrase) {
  if (Number(envelope?.version) !== ENVELOPE_VERSION) {
    throw new Error("Versi file env terenkripsi tidak didukung.");
  }

  if (String(envelope?.algorithm || "") !== "aes-256-gcm") {
    throw new Error("Algoritma file env terenkripsi tidak didukung.");
  }

  const salt = decodeBase64(envelope.salt, "salt");
  const iv = decodeBase64(envelope.iv, "iv");
  const tag = decodeBase64(envelope.tag, "tag");
  const ciphertext = decodeBase64(envelope.ciphertext, "ciphertext");
  const key = scryptSync(passphrase, salt, 32);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

function runEncrypt({ input, output, keyFile }) {
  if (!existsSync(input)) {
    throw new Error(`File env sumber tidak ditemukan: ${input}`);
  }

  const passphrase = readPassphrase(keyFile, { allowGenerate: true });
  const plaintextBuffer = readFileSync(input);
  const envelope = createEnvelope(plaintextBuffer, passphrase, input);

  ensureParentDirectory(output);
  writeFileSync(output, `${JSON.stringify(envelope, null, 2)}\n`, "utf8");

  console.log(`Encrypted env written to ${output}`);
  console.log(`Encryption key available at ${keyFile}`);
}

function runDecrypt({ input, output, keyFile }) {
  if (!existsSync(input)) {
    throw new Error(`File env terenkripsi tidak ditemukan: ${input}`);
  }

  const passphrase = readPassphrase(keyFile, { allowGenerate: false });
  const envelope = JSON.parse(readFileSync(input, "utf8"));
  const plaintextBuffer = decryptEnvelope(envelope, passphrase);

  ensureParentDirectory(output);
  writeFileSync(output, plaintextBuffer);

  console.log(`Decrypted env written to ${output}`);
}

try {
  const { command, options } = parseArgs(process.argv);

  if (command === "encrypt") {
    runEncrypt(options);
  } else if (command === "decrypt") {
    runDecrypt(options);
  } else {
    throw new Error(`Command tidak dikenal: ${command}`);
  }
} catch (error) {
  console.error(error.message || "Gagal memproses env terenkripsi.");
  process.exitCode = 1;
}
