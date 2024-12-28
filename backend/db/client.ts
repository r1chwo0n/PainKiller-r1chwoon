import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema"; // นำเข้า schema ของตาราง
import postgres from "postgres"; // ใช้สำหรับเชื่อมต่อกับ PostgreSQL
import { connectionString } from "./utils"; // นำเข้า connection string ที่ตั้งค่าใน .env

export const dbConn = postgres(connectionString); // สร้างการเชื่อมต่อกับฐานข้อมูล

export const dbClient = drizzle(dbConn, { schema: schema, logger: true }); // สร้าง dbClient ที่ใช้สำหรับ query ด้วย Drizzle ORM
