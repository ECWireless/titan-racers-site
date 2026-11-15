import { neon } from "@neondatabase/serverless";
import { Pool as PgPool } from "pg";

type Query = <T>(text: string, values?: unknown[]) => Promise<T[]>;

let runQuery: Query | undefined;

function isLocalDatabaseUrl(connectionString: string) {
  try {
    const { hostname } = new URL(connectionString);
    const normalizedHostname = hostname.replace(/^\[|\]$/g, "");
    return (
      normalizedHostname === "localhost" ||
      normalizedHostname === "127.0.0.1" ||
      normalizedHostname === "::1"
    );
  } catch {
    return false;
  }
}

function getQuery(): Query {
  if (runQuery) {
    return runQuery;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required for the updates list.");
  }

  if (isLocalDatabaseUrl(connectionString)) {
    const pool = new PgPool({ connectionString });
    pool.on("error", (error) => console.warn("Postgres pool error", error.name));
    runQuery = async <T>(text: string, values: unknown[] = []) =>
      (await pool.query(text, values)).rows as T[];
  } else {
    // Neon over HTTP: no idle connections to break when a serverless
    // instance is frozen or Neon suspends. Every query here is one statement.
    const sql = neon(connectionString);
    runQuery = async <T>(text: string, values: unknown[] = []) =>
      (await sql.query(text, values)) as T[];
  }

  return runQuery;
}

export async function query<T>(text: string, values: unknown[] = []) {
  return getQuery()<T>(text, values);
}
