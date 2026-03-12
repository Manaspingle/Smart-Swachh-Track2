import { pgTable, text, serial, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reportsTable = pgTable("waste_reports", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  location: text("location").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export const insertReportSchema = createInsertSchema(reportsTable).omit({ id: true, submittedAt: true });
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reportsTable.$inferSelect;
