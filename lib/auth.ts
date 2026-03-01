import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { authSchema } from "@/lib/db/schema";
import { getServerConstant } from "@/lib/server-constants";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema: authSchema }),
  baseURL: getServerConstant("BETTER_AUTH_URL"),
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        before: async () => {
          const provisioningMode =
            process.env.AUTH_PROVISIONING_MODE === "true";
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
