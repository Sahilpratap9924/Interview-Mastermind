// MongoDB Atlas client. Server-only (Node runtime).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient, type Db, ObjectId } from "mongodb";

let _client: MongoClient | undefined;
let _db: Db | undefined;

function loadDotenv(): Record<string, string> {
  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../.env"),
  ];

  for (const dotenvPath of candidates) {
    if (fs.existsSync(dotenvPath)) {
      console.log("[mongo] loading .env from", dotenvPath);
      const content = fs.readFileSync(dotenvPath, "utf8");
      return Object.fromEntries(
        content
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line && !line.startsWith("#"))
          .map((line) => {
            const [key, ...rest] = line.split("=");
            return [key, rest.join("=")];
          }),
      );
    }
  }

  console.log("[mongo] no .env file found in candidates", candidates);
  return {};
}

function applyDotenvOverrides() {
  const env = loadDotenv();
  for (const [key, value] of Object.entries(env)) {
    const previous = process.env[key];
    if (previous !== value) {
      process.env[key] = value;
      console.log(`[mongo] .env override ${key}:`, previous ? "(previous value overridden)" : "(newly set)");
    }
  }
}

function redactMongodbUri(uri: string): string {
  try {
    const url = new URL(uri);
    if (url.password) url.password = "***";
    return url.toString();
  } catch {
    return uri.replace(/(mongodb\+srv:\/\/)(.*?):(.*?)@/, "$1***:***@");
  }
}

export async function getDb(): Promise<Db> {
  if (_db) return _db;
  applyDotenvOverrides();
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;
  console.log("[mongo] runtime env", {
    MONGODB_URI: uri ? redactMongodbUri(uri) : undefined,
    MONGODB_DB_NAME: dbName,
  });
  if (!uri) throw new Error("MONGODB_URI is not configured");
  if (!dbName) throw new Error("MONGODB_DB_NAME is not configured");
  _client = new MongoClient(uri);
  try {
    await _client.connect();
  } catch (error: unknown) {
    const message = typeof error === "object" && error !== null && "message" in error
      ? String((error as { message?: unknown }).message)
      : String(error);
    if (/bad auth|authentication failed/i.test(message)) {
      throw new Error(
        "MongoDB authentication failed. Check that MONGODB_URI contains the correct username, password, and that the database user has access to the configured database.",
      );
    }
    throw error;
  }
  _db = _client.db(dbName);
  await ensureIndexes(_db);
  return _db;
}

async function ensureIndexes(db: Db) {
  await Promise.all([
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("interview_sessions").createIndex({ user_id: 1, started_at: -1 }),
    db.collection("qa_pairs").createIndex({ session_id: 1, question_index: 1 }),
  ]);
}

export { ObjectId };
