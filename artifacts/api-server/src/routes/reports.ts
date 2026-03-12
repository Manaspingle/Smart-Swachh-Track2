import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { reportsTable } from "@workspace/db/schema";
import { SubmitReportBody } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.post("/", async (req, res) => {
  const parsed = SubmitReportBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: "Invalid report data" });
    return;
  }
  const { userId, location, description, latitude, longitude } = parsed.data;
  const [report] = await db.insert(reportsTable).values({
    userId: userId || null,
    location,
    description,
    status: "pending",
    latitude: latitude || null,
    longitude: longitude || null,
  }).returning();
  res.status(201).json({
    id: String(report.id),
    userId: report.userId || undefined,
    location: report.location,
    description: report.description,
    status: report.status,
    submittedAt: report.submittedAt.toISOString(),
    resolvedAt: report.resolvedAt ? report.resolvedAt.toISOString() : null,
  });
});

router.get("/", async (_req, res) => {
  const dbReports = await db.select().from(reportsTable).orderBy(desc(reportsTable.submittedAt)).limit(20);
  const mockReports = [
    { id: "r1", userId: "demo", location: "Andheri East, near Station", description: "Large garbage dump blocking the footpath", status: "in_progress", submittedAt: new Date(Date.now() - 86400000).toISOString(), resolvedAt: null },
    { id: "r2", userId: "demo", location: "Bandra West, Hill Road", description: "Overflowing dustbin near market", status: "resolved", submittedAt: new Date(Date.now() - 259200000).toISOString(), resolvedAt: new Date(Date.now() - 86400000).toISOString() },
    { id: "r3", userId: null, location: "Juhu Beach parking area", description: "Plastic waste scattered near beach entrance", status: "pending", submittedAt: new Date(Date.now() - 43200000).toISOString(), resolvedAt: null },
  ];
  const formatted = dbReports.map((r) => ({
    id: String(r.id),
    userId: r.userId || undefined,
    location: r.location,
    description: r.description,
    status: r.status,
    submittedAt: r.submittedAt.toISOString(),
    resolvedAt: r.resolvedAt ? r.resolvedAt.toISOString() : null,
  }));
  res.json([...formatted, ...mockReports]);
});

export default router;
