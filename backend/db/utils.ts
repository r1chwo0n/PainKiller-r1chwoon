import "dotenv/config";

const dbUser = process.env.POSTGRES_APP_USER;
const dbPassword = process.env.POSTGRES_APP_PASSWORD;
const dbHost = process.env.POSTGRES_HOST;
// const dbPort = process.env.POSTGRES_PORT || 5003; // Default to 5432 if not provided
const dbPort = 5432;
const dbName = process.env.POSTGRES_DB;

if (!dbUser || !dbPassword || !dbHost || !dbPort || !dbName) {
  throw new Error("Invalid DB environment variables.");
}

export const connectionString = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
