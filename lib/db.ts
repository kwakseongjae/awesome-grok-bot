/** Server-only Neon/Postgres pool. Never import from client components. */
import { Pool, type QueryResultRow } from "pg";
import { isDatabaseConfigured } from "@/lib/env";

type GlobalPg = typeof globalThis & { __agbPgPool?: Pool };

const pgErrorCode = (error: unknown) => {
  if (!error || typeof error !== "object" || !("code" in error)) return "";
  return String(error.code);
};

const pgErrorMessage = (error: unknown) => {
  if (!error || typeof error !== "object" || !("message" in error)) return "";
  return String(error.message);
};

export const isUndefinedTableError = (error: unknown) => {
  const message = pgErrorMessage(error);
  return pgErrorCode(error) === "42P01" || /relation .+ does not exist/i.test(message);
};

export const isStoreUnavailableError = (error: unknown) => {
  if (isUndefinedTableError(error)) return true;
  const code = pgErrorCode(error);
  if (
    code === "28P01" ||
    code === "3D000" ||
    code === "ECONNREFUSED" ||
    code === "ENOTFOUND" ||
    code === "ETIMEDOUT" ||
    code === "ECONNRESET"
  ) {
    return true;
  }
  return /connect|ECONN|timeout|not exist/i.test(pgErrorMessage(error));
};

export const getPool = (): Pool | null => {
  if (!isDatabaseConfigured()) return null;
  const globalForPg = globalThis as GlobalPg;
  if (!globalForPg.__agbPgPool) {
    globalForPg.__agbPgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
    });
  }
  return globalForPg.__agbPgPool;
};

export const query = async <T extends QueryResultRow>(
  text: string,
  values: unknown[] = [],
): Promise<{ rows: T[]; error: unknown | null; unavailable: boolean }> => {
  const pool = getPool();
  if (!pool) return { rows: [], error: "STORE_UNAVAILABLE", unavailable: true };
  try {
    const result = await pool.query<T>(text, values);
    return { rows: result.rows, error: null, unavailable: false };
  } catch (error) {
    return { rows: [], error, unavailable: isStoreUnavailableError(error) };
  }
};
