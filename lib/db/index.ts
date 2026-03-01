import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getServerConstant } from "@/lib/server-constants";
import * as schema from "@/lib/db/schema";

const globalForDb = globalThis as unknown as {
  pgPool?: Pool;
  db?: NodePgDatabase<typeof schema>;
};

export const pgPool =
  globalForDb.pgPool ??
  new Pool({
    connectionString: getServerConstant("DATABASE_URL"),
  });

export const db = globalForDb.db ?? drizzle(pgPool, { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgPool = pgPool;
  globalForDb.db = db;
}
