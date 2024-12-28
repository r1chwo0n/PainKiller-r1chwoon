import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres"; 
import { connectionString } from "./utils";

const dbConn = postgres(connectionString, { max: 1 });

async function main() {
  await migrate(drizzle(dbConn), {
    migrationsFolder: "./db/migration", // โฟลเดอร์ที่เก็บไฟล์ migration
    migrationsSchema: "drizzle", // กำหนด schema สำหรับ migrations
  });
  await dbConn.end(); // ปิดการเชื่อมต่อฐานข้อมูล
}

main();
