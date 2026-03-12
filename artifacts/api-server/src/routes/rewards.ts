import { Router, type IRouter } from "express";
import { GetRewardPointsQueryParams } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { usersTable, wasteEntriesTable } from "@workspace/db/schema";
import { and, count, eq, gt, gte, sql } from "drizzle-orm";

const router: IRouter = Router();

const leaderboardData = [
  { rank: 1, userId: "u001", name: "Aditya Kumar", city: "Mumbai", greenPoints: 2840, level: "Zero Waste Warrior", itemsRecycled: 142 },
  { rank: 2, userId: "u002", name: "Sneha Patel", city: "Pune", greenPoints: 2650, level: "Zero Waste Warrior", itemsRecycled: 133 },
  { rank: 3, userId: "u003", name: "Rahul Nair", city: "Bengaluru", greenPoints: 2420, level: "Sustainability Hero", itemsRecycled: 121 },
  { rank: 4, userId: "u004", name: "Priya Sharma", city: "Mumbai", greenPoints: 2100, level: "Sustainability Hero", itemsRecycled: 105 },
  { rank: 5, userId: "u005", name: "Vikram Singh", city: "Delhi", greenPoints: 1850, level: "Sustainability Hero", itemsRecycled: 92 },
  { rank: 6, userId: "u006", name: "Ananya Reddy", city: "Hyderabad", greenPoints: 1620, level: "Recycling Champion", itemsRecycled: 81 },
  { rank: 7, userId: "u007", name: "Karthik Iyer", city: "Chennai", greenPoints: 1450, level: "Recycling Champion", itemsRecycled: 72 },
  { rank: 8, userId: "u008", name: "Meera Joshi", city: "Ahmedabad", greenPoints: 1280, level: "Recycling Champion", itemsRecycled: 64 },
  { rank: 9, userId: "u009", name: "Arjun Mehta", city: "Kolkata", greenPoints: 1100, level: "Green Citizen", itemsRecycled: 55 },
  { rank: 10, userId: "u010", name: "Divya Krishnan", city: "Bengaluru", greenPoints: 980, level: "Green Citizen", itemsRecycled: 49 },
];

const allBadges = [
  { id: "b1", name: "Eco Beginner", description: "Started your green journey", icon: "🌱", requirement: "Earn 1 green point", unlocked: true, earnedAt: "2025-01-15T00:00:00Z" },
  { id: "b2", name: "Green Citizen", description: "Making a difference every day", icon: "🌿", requirement: "Earn 100 green points", unlocked: true, earnedAt: "2025-02-01T00:00:00Z" },
  { id: "b3", name: "Recycling Champion", description: "A champion of waste segregation", icon: "♻️", requirement: "Earn 500 green points", unlocked: true, earnedAt: "2025-02-20T00:00:00Z" },
  { id: "b4", name: "Sustainability Hero", description: "Inspiring others through action", icon: "🏆", requirement: "Earn 1000 green points", unlocked: false, earnedAt: null },
  { id: "b5", name: "Zero Waste Warrior", description: "Ultimate waste warrior", icon: "⚡", requirement: "Earn 2000 green points", unlocked: false, earnedAt: null },
  { id: "b6", name: "Plastic Slayer", description: "Recycled 50 plastic items", icon: "🧴", requirement: "Recycle 50 plastic items", unlocked: true, earnedAt: "2025-03-01T00:00:00Z" },
  { id: "b7", name: "Nature Protector", description: "Saved 10kg of CO₂ emissions", icon: "🌳", requirement: "Reduce 10kg CO2", unlocked: false, earnedAt: null },
  { id: "b8", name: "Community Star", description: "Reached top 10 in leaderboard", icon: "⭐", requirement: "Rank in top 10", unlocked: false, earnedAt: null },
];

router.get("/points", (req, res) => {
  void (async () => {
    const parsed = GetRewardPointsQueryParams.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_error", message: "Invalid request" });
      return;
    }

    const userId = parsed.data.userId ?? "demo-user";
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

    if (!user) {
      res.json({
        userId,
        greenPoints: 0,
        level: "Eco Beginner",
        nextLevelPoints: 100,
        rank: 0,
        totalUsers: 0,
        weeklyPoints: 0,
        monthlyPoints: 0,
      });
      return;
    }

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    const monthStart = new Date(now);
    monthStart.setDate(now.getDate() - 30);

    const weekly = await db
      .select({ sum: sql<number>`coalesce(sum(${wasteEntriesTable.pointsEarned}), 0)` })
      .from(wasteEntriesTable)
      .where(and(eq(wasteEntriesTable.userId, userId), gte(wasteEntriesTable.verifiedAt, weekStart)));

    const monthly = await db
      .select({ sum: sql<number>`coalesce(sum(${wasteEntriesTable.pointsEarned}), 0)` })
      .from(wasteEntriesTable)
      .where(and(eq(wasteEntriesTable.userId, userId), gte(wasteEntriesTable.verifiedAt, monthStart)));

    const totalUsersResult = await db.select({ c: count() }).from(usersTable);
    const totalUsers = totalUsersResult[0]?.c ?? 0;

    // Rank is approximate: count users with more points + 1
    const better = await db
      .select({ c: count() })
      .from(usersTable)
      .where(gt(usersTable.greenPoints, user.greenPoints));
    const rank = (better[0]?.c ?? 0) + 1;

    const nextLevelPoints =
      user.greenPoints >= 2000 ? 2000 :
      user.greenPoints >= 1000 ? 2000 :
      user.greenPoints >= 500 ? 1000 :
      user.greenPoints >= 100 ? 500 :
      100;

    res.json({
      userId,
      greenPoints: user.greenPoints,
      level: user.level,
      nextLevelPoints,
      rank,
      totalUsers,
      weeklyPoints: weekly[0]?.sum ?? 0,
      monthlyPoints: monthly[0]?.sum ?? 0,
    });
  })().catch((err: unknown) => {
    console.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to load reward points" });
  });
});

router.get("/leaderboard", (_req, res) => {
  res.json(leaderboardData);
});

router.get("/badges", (_req, res) => {
  res.json(allBadges);
});

export default router;
