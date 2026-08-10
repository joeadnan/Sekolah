import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@libsql/client";

function loadLocalEnvFile(fileName) {
  const envPath = join(process.cwd(), fileName);
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const [key, ...rest] = trimmed.split("=");
    if (process.env[key]) continue;

    process.env[key] = rest.join("=").trim().replace(/^[\'"]|[\'"]$/g, "");
  }
}

if (!process.env.VERCEL) {
  loadLocalEnvFile(".env.local");
  loadLocalEnvFile(".env");
}

const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!databaseUrl) throw new Error("TURSO_DATABASE_URL belum diisi.");
if (!authToken) throw new Error("TURSO_AUTH_TOKEN belum diisi.");

const schemaPath = join(process.cwd(), "database", "schema.sql");
if (!existsSync(schemaPath)) throw new Error("File database/schema.sql tidak ditemukan.");

const client = createClient({ url: databaseUrl, authToken });

function splitSqlStatements(sql) {
  const statements = [];
  let current = "";
  let quote = null;

  for (let i = 0; i < sql.length; i += 1) {
    const char = sql[i];
    const next = sql[i + 1];

    if (!quote && char === "-" && next === "-") {
      while (i < sql.length && sql[i] !== "\n") i += 1;
      continue;
    }

    if ((char === "'" || char === '"') && sql[i - 1] !== "\\") {
      quote = quote === char ? null : quote || char;
    }

    if (!quote && char === ";") {
      const statement = current.trim();
      if (statement) statements.push(statement);
      current = "";
      continue;
    }

    current += char;
  }

  const last = current.trim();
  if (last) statements.push(last);

  return statements;
}

try {
  const sql = readFileSync(schemaPath, "utf8");
  const statements = splitSqlStatements(sql);

  for (const statement of statements) {
    await client.execute(statement);
  }

  console.log(`Schema berhasil diterapkan ke Turso. Total statement: ${statements.length}`);
} catch (error) {
  console.error("Gagal menerapkan schema ke Turso:", error);
  process.exitCode = 1;
} finally {
  if (typeof client.close === "function") client.close();
}
