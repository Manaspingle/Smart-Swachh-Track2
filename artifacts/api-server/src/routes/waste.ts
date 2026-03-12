import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { wasteEntriesTable, usersTable } from "@workspace/db/schema";
import { ClassifyWasteBody, VerifyWasteDisposalBody, GetWasteHistoryQueryParams } from "@workspace/api-zod";
import { desc, eq } from "drizzle-orm";
import { checkFakeImageWithHf, classifyWasteWithHf } from "../services/hf";

const router: IRouter = Router();

const classificationSessions: Record<string, { category: string; itemName: string }> = {};

function resolveLevel(points: number): string {
  if (points >= 2000) return "Zero Waste Warrior";
  if (points >= 1000) return "Sustainability Hero";
  if (points >= 500) return "Recycling Champion";
  if (points >= 100) return "Green Citizen";
  return "Eco Beginner";
}

router.post("/classify", (req, res) => {
  const parsed = ClassifyWasteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: "Invalid request" });
    return;
  }
  void (async () => {
    const { imageBase64 } = parsed.data;
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

    // If HF is configured, use ML classification; otherwise fall back to a safe default.
    let result:
      | Awaited<ReturnType<typeof classifyWasteWithHf>>
      | {
          category: "other";
          itemName: "Unknown Item";
          confidence: 0.5;
          disposalInstructions: string;
          binColor: string;
          tips: string[];
        };

    if (process.env["HF_API_TOKEN"]) {
      result = await classifyWasteWithHf(imageBase64);
    } else {
      result = {
        category: "other",
        itemName: "Unknown Item",
        confidence: 0.5,
        disposalInstructions:
          "Configure HF_API_TOKEN to enable ML classification. For now, treat this as general waste.",
        binColor: "Black",
        tips: ["Set HF_API_TOKEN on the backend to enable ML classification."],
      };
    }

    classificationSessions[sessionId] = { category: result.category, itemName: result.itemName };
    res.json({
      sessionId,
      category: result.category,
      itemName: result.itemName,
      confidence: result.confidence,
      disposalInstructions: result.disposalInstructions,
      binColor: result.binColor,
      tips: result.tips,
    });
  })().catch((err: unknown) => {
    console.error(err);
    res.status(500).json({ error: "ml_error", message: "Failed to classify image" });
  });
});

router.post("/verify", async (req, res) => {
  const parsed = VerifyWasteDisposalBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: "Invalid request" });
    return;
  }
  const { sessionId, userId, imageBase64 } = parsed.data;
  const session = sessionId ? classificationSessions[sessionId] : null;
  const pointsAwarded = 10 + Math.floor(Math.random() * 20);
  let totalPoints = pointsAwarded;

  // Fake/AI-generated image check (only enforced when HF is configured).
  if (process.env["HF_API_TOKEN"]) {
    try {
      const fake = await checkFakeImageWithHf(imageBase64);
      if (fake.isFakeLikely) {
        res.status(400).json({
          error: "fake_image_detected",
          message: "Image appears to be AI-generated/tampered. Please upload a real photo.",
        });
        return;
      }
    } catch (err) {
      // If detection fails, do not block user; still allow verification.
      console.warn("Fake-image check failed:", err);
    }
  }

  if (userId) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (user) {
      totalPoints = user.greenPoints + pointsAwarded;
      await db
        .update(usersTable)
        .set({ greenPoints: totalPoints, level: resolveLevel(totalPoints) })
        .where(eq(usersTable.id, userId));
    }
  }

  if (session) {
    await db.insert(wasteEntriesTable).values({
      userId: userId || "demo-user",
      category: session.category,
      itemName: session.itemName,
      pointsEarned: pointsAwarded,
    });
    delete classificationSessions[sessionId!];
  }
  res.json({
    verified: true,
    pointsAwarded,
    totalPoints,
    message: "Waste disposal verified. Green points added! Thank you for segregating responsibly.",
    badge: pointsAwarded > 25 ? "Recycling Champion" : null,
  });
});

router.get("/history", async (req, res) => {
  const parsed = GetWasteHistoryQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: "Invalid request" });
    return;
  }

  const { userId } = parsed.data;
  const baseQuery = db
    .select()
    .from(wasteEntriesTable)
    .orderBy(desc(wasteEntriesTable.verifiedAt))
    .limit(20);

  const entries = userId
    ? await baseQuery.where(eq(wasteEntriesTable.userId, userId))
    : await baseQuery;
  const mockHistory = [
    { id: "h1", userId: "demo-user", category: "plastic", itemName: "Plastic Bottle", pointsEarned: 15, verifiedAt: new Date(Date.now() - 86400000).toISOString(), date: new Date(Date.now() - 86400000).toDateString() },
    { id: "h2", userId: "demo-user", category: "organic", itemName: "Food Waste", pointsEarned: 10, verifiedAt: new Date(Date.now() - 172800000).toISOString(), date: new Date(Date.now() - 172800000).toDateString() },
    { id: "h3", userId: "demo-user", category: "paper", itemName: "Newspaper", pointsEarned: 12, verifiedAt: new Date(Date.now() - 259200000).toISOString(), date: new Date(Date.now() - 259200000).toDateString() },
    { id: "h4", userId: "demo-user", category: "metal", itemName: "Aluminum Can", pointsEarned: 18, verifiedAt: new Date(Date.now() - 345600000).toISOString(), date: new Date(Date.now() - 345600000).toDateString() },
    { id: "h5", userId: "demo-user", category: "glass", itemName: "Glass Bottle", pointsEarned: 20, verifiedAt: new Date(Date.now() - 432000000).toISOString(), date: new Date(Date.now() - 432000000).toDateString() },
  ];
  const dbEntries = entries.map((e) => ({
    id: String(e.id),
    userId: e.userId,
    category: e.category,
    itemName: e.itemName,
    pointsEarned: e.pointsEarned,
    verifiedAt: e.verifiedAt.toISOString(),
    date: e.verifiedAt.toDateString(),
  }));
  res.json(userId ? dbEntries : [...dbEntries, ...mockHistory]);
});

export default router;
