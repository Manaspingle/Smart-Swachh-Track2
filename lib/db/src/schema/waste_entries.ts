import { pgTable, text, serial, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const wasteEntriesTable = pgTable("waste_entries", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default("demo-user"),
  category: text("category").notNull(),
  itemName: text("item_name").notNull(),
  pointsEarned: real("points_earned").notNull().default(0),
  verifiedAt: timestamp("verified_at").defaultNow().notNull(),
});

export const insertWasteEntrySchema = createInsertSchema(wasteEntriesTable).omit({ id: true, verifiedAt: true });
export type InsertWasteEntry = z.infer<typeof insertWasteEntrySchema>;
export type WasteEntry = typeof wasteEntriesTable.$inferSelect;
