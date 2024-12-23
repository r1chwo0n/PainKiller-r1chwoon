import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { connectionString } from "@db/utils";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
  schema: "./db/schema.ts",
  out: "db/migration",
  verbose: true,
  strict: true,
});
