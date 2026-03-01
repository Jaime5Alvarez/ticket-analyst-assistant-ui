import { defineConfig } from "drizzle-kit";
import { getServerConstant } from "./lib/server-constants";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: getServerConstant("DATABASE_URL"),
  },
});
