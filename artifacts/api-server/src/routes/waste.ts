import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { wasteEntriesTable } from "@workspace/db/schema";
import { ClassifyWasteBody, VerifyWasteDisposalBody } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

const wasteCategories = [
  {
    category: "plastic",
    items: ["Plastic Bottle", "Plastic Bag", "PET Container", "Plastic Cup", "Polythene Wrapper"],
    binColor: "Blue",
    disposalInstructions: "Rinse and crush before placing in the Blue Recycling Bin. Remove caps and labels if possible.",
    tips: ["Rinse containers before recycling", "Crush bottles to save space", "Remove food residue", "Check the recycling number on the bottom"],
  },
  {
    category: "organic",
    items: ["Food Waste", "Vegetable Peels", "Fruit Scraps", "Cooked Food", "Tea/Coffee Grounds"],
    binColor: "Green",
    disposalInstructions: "Place in the Green Organic Waste Bin. Can be composted to create natural fertilizer.",
    tips: ["Start home composting", "Avoid mixing with plastic", "Use as garden fertilizer", "Keep separate from dry waste"],
  },
  {
    category: "metal",
    items: ["Aluminum Can", "Steel Container", "Metal Bottle Cap", "Iron Scrap", "Copper Wire"],
    binColor: "Grey",
    disposalInstructions: "Clean and place in the Grey Metal Recycling Bin. Metal is 100% recyclable indefinitely.",
    tips: ["Crush cans to save space", "Separate different metals", "Clean before disposing", "Check for sharp edges"],
  },
  {
    category: "glass",
    items: ["Glass Bottle", "Glass Jar", "Broken Glass", "Mirror", "Window Glass"],
    binColor: "White",
    disposalInstructions: "Wrap broken glass in newspaper before placing in White Glass Recycling Bin. Handle with care.",
    tips: ["Wrap sharp edges safely", "Remove caps and lids", "Rinse containers", "Keep color-sorted if possible"],
  },
  {
    category: "ewaste",
    items: ["Mobile Phone", "Battery", "Laptop", "Charger", "Electronic Component"],
    binColor: "Red",
    disposalInstructions: "Take to designated E-Waste collection center. Do NOT put in regular bins. Contains hazardous materials.",
    tips: ["Never put in regular trash", "Find authorized e-waste collectors", "Data wipe before disposing", "Check manufacturer take-back programs"],
  },
  {
    category: "paper",
    items: ["Newspaper", "Cardboard Box", "Paper Bag", "Office Paper", "Magazine"],
    binColor: "Yellow",
    disposalInstructions: "Keep dry and place in Yellow Paper Recycling Bin. Wet paper cannot be recycled.",
    tips: ["Keep paper dry", "Remove staples and clips", "Flatten cardboard boxes", "Avoid shredded paper in bins"],
  },
];

const classificationSessions: Record<string, { category: string; itemName: string }> = {};

router.post("/classify", (req, res) => {
  const parsed = ClassifyWasteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: "Invalid request" });
    return;
  }
  const wasteType = wasteCategories[Math.floor(Math.random() * wasteCategories.length)];
  const itemName = wasteType.items[Math.floor(Math.random() * wasteType.items.length)];
  const confidence = 0.75 + Math.random() * 0.22;
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  classificationSessions[sessionId] = { category: wasteType.category, itemName };
  res.json({
    sessionId,
    category: wasteType.category,
    itemName,
    confidence: Math.round(confidence * 100) / 100,
    disposalInstructions: wasteType.disposalInstructions,
    binColor: wasteType.binColor,
    tips: wasteType.tips,
  });
});

router.post("/verify", async (req, res) => {
  const parsed = VerifyWasteDisposalBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: "Invalid request" });
    return;
  }
  const { sessionId, userId } = parsed.data;
  const session = sessionId ? classificationSessions[sessionId] : null;
  const pointsAwarded = 10 + Math.floor(Math.random() * 20);
  if (session && userId) {
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
    totalPoints: 750 + pointsAwarded,
    message: "Waste disposal verified. Green points added! Thank you for segregating responsibly.",
    badge: pointsAwarded > 25 ? "Recycling Champion" : null,
  });
});

router.get("/history", async (req, res) => {
  const entries = await db.select().from(wasteEntriesTable).orderBy(desc(wasteEntriesTable.verifiedAt)).limit(20);
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
  res.json([...dbEntries, ...mockHistory]);
});

export default router;
