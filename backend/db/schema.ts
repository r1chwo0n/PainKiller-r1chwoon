import { relations } from "drizzle-orm";
import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
  date,
  real,
  uuid,
  foreignKey,
} from "drizzle-orm/pg-core";

// Drug table schema
export const drugTable = pgTable("drug", {
  drug_id: uuid("drug_id").primaryKey().defaultRandom(), 
  name: varchar("name", { length: 255 }).notNull(), 
  code: varchar("code", { length: 255 }).notNull(),
  drug_type: varchar("drug_type", { length: 255 }).notNull(),
  detail: text("detail"), 
  usage: varchar("usage", { length: 255 }), 
  slang_food: text("slang_food"), 
  side_effect: text("side_effect"), 
  unit_price: real("unit_price"), 
  created_at: timestamp("created_at").defaultNow().notNull(), 
  updated_at: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()), 
});

// Stock table schema
export const stockTable = pgTable("stock", {
  stock_id: uuid("stock_id").primaryKey().defaultRandom(),
  drug_id: uuid("drug_id") 
    .references(() => drugTable.drug_id, { onDelete: "cascade" }), 
  amount: integer("amount").notNull(), 
  expired: date("expired"), 
  created_at: timestamp("created_at").defaultNow().notNull(), 
  updated_at: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()), 
});

// Define relations
export const drugRelations = relations(drugTable, ({ many }) => ({
  stock: many(stockTable),
}));

export const stockRelations = relations(stockTable, ({ one }) => ({
  drug: one(drugTable, {
    fields: [stockTable.drug_id], 
    references: [drugTable.drug_id], 
  }),
}));
