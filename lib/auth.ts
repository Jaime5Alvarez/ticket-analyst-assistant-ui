import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { Pool } from "pg";
import { getServerConstant } from "@/lib/server-constants";

const globalForPg = globalThis as unknown as { pgPool?: Pool };

const database =
  globalForPg.pgPool ??
  new Pool({
    connectionString: getServerConstant("DATABASE_URL"),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = database;
}

const provisioningMode = process.env.AUTH_PROVISIONING_MODE === "true";

export const auth = betterAuth({
  database,
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        before: async () => {
          if (!provisioningMode) {
            throw new APIError("FORBIDDEN", {
              message: "Public signup is disabled",
            });
          }
        },
      },
    },
  },
  trustedOrigins: [getServerConstant("BETTER_AUTH_URL")],
});
