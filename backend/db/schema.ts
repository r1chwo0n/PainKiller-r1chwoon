import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
  date,
  real,
  foreignKey,
} from "drizzle-orm/pg-core";

// Drug table schema
export const drugTable = pgTable("drug", {
  drug_id: integer("drug_id").primaryKey(), // Primary Key
  name: varchar("name", { length: 255 }).notNull(), // ชื่อยา
  detail: text("detail"), // รายละเอียดยา
  usage: varchar("usage", { length: 255 }), // วิธีการใช้
  slang_food: text("slang_food"), // อาหารที่ควรหลีกเลี่ยง
  side_effect: text("side_effect"), // ผลข้างเคียง
  unit_price: real("unit_price"), // ราคาต่อหน่วย
  created_at: timestamp("created_at").defaultNow().notNull(), // เวลาที่สร้าง
  updated_at: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()), // เวลาที่อัปเดตล่าสุด
});

// Stock table schema
export const stockTable = pgTable("stock", {
  stock_id: integer("stock_id").primaryKey(), // Primary Key
  drug_id: integer("drug_id") // Foreign Key
    .references(() => drugTable.drug_id), // เชื่อมกับ drugTable
  amount: integer("amount").notNull(), // จำนวนของยาในสต็อก
  expired: date("expired"), // วันหมดอายุ
  created_at: timestamp("created_at").defaultNow().notNull(), // เวลาที่สร้าง
  updated_at: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()), // เวลาที่อัปเดตล่าสุด
});

