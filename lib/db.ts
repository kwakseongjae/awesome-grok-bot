import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";
import { isDatabaseConfigured } from "@/lib/env";

const globalForDb = globalThis as unknown as { grokBotPool?: Pool };

export const getPool = (): Pool | null => {
  if (!isDatabaseConfigured()) return null;
  if (!globalForDb.grokBotPool) {
    globalForDb.grokBotPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    });
  }
  return globalForDb.grokBotPool;
};

export const isUndefinedTableError = (error: unknown) => {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? String(error.code) : "";
  const message = "message" in error ? String(error.message) : "";
  return (
    code === "42P01" ||
    /does not exist|relation .* does not exist/i.test(message)
  );
};

export const toIsoString = (value: Date | string): string =>
  value instanceof Date ? value.toISOString() : value;

export const query = async <T extends QueryResultRow>(
  text: string,
  values?: unknown[],
): Promise<QueryResult<T> | null> => {
  const db = getPool();
  if (!db) return null;
  if (!values) return db.query<T>(text);
  return db.query<T>(text, values as never);
};

export const withTransaction = async <T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T | null> => {
  const db = getPool();
  if (!db) return null;
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const value = await fn(client);
    await client.query("COMMIT");
    return value;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
