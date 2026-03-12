import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/municipal", (_req, res) => {
  res.json({
    totalWasteCollected: 2847.5,
    segregationRate: 68.4,
    activeUsers: 12450,
    totalReports: 342,
    areaWiseData: [
      { area: "Andheri", segregationRate: 78, totalWaste: 420, compliance: "high" },
      { area: "Bandra", segregationRate: 82, totalWaste: 380, compliance: "high" },
      { area: "Dharavi", segregationRate: 45, totalWaste: 520, compliance: "low" },
      { area: "Juhu", segregationRate: 71, totalWaste: 290, compliance: "high" },
      { area: "Kurla", segregationRate: 55, totalWaste: 460, compliance: "medium" },
      { area: "Malad", segregationRate: 63, totalWaste: 350, compliance: "medium" },
      { area: "Thane", segregationRate: 58, totalWaste: 427, compliance: "medium" },
    ],
    wasteTypeDistribution: [
      { category: "Organic", percentage: 42, amount: 1195.9 },
      { category: "Plastic", percentage: 28, amount: 797.3 },
      { category: "Paper", percentage: 14, amount: 398.7 },
      { category: "Metal", percentage: 8, amount: 227.8 },
      { category: "Glass", percentage: 5, amount: 142.4 },
      { category: "E-waste", percentage: 3, amount: 85.4 },
    ],
    weeklyTrend: [
      { day: "Mon", organic: 180, plastic: 120, metal: 45, glass: 30, ewaste: 15 },
      { day: "Tue", organic: 165, plastic: 135, metal: 50, glass: 28, ewaste: 12 },
      { day: "Wed", organic: 195, plastic: 110, metal: 42, glass: 35, ewaste: 18 },
      { day: "Thu", organic: 210, plastic: 145, metal: 55, glass: 25, ewaste: 20 },
      { day: "Fri", organic: 185, plastic: 125, metal: 48, glass: 32, ewaste: 14 },
      { day: "Sat", organic: 240, plastic: 160, metal: 60, glass: 40, ewaste: 22 },
      { day: "Sun", organic: 200, plastic: 130, metal: 38, glass: 22, ewaste: 10 },
    ],
    topCommunities: [
      { name: "Green Bandra RWA", area: "Bandra West", score: 94, members: 450, rank: 1 },
      { name: "Eco Andheri Heights", area: "Andheri East", score: 91, members: 380, rank: 2 },
      { name: "Juhu Clean Society", area: "Juhu", score: 88, members: 320, rank: 3 },
      { name: "Versova Eco Club", area: "Versova", score: 85, members: 290, rank: 4 },
      { name: "Powai Green Warriors", area: "Powai", score: 82, members: 410, rank: 5 },
    ],
  });
});

router.get("/dashboard", (_req, res) => {
  const today = new Date();
  const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
      points: Math.floor(Math.random() * 50) + 10,
      items: Math.floor(Math.random() * 5) + 1,
    };
  });
  res.json({
    totalPoints: 750,
    itemsSegregated: 47,
    ecoScore: 82,
    rank: 4,
    weeklyActivity,
    categoryBreakdown: [
      { category: "Organic", count: 18, color: "#22c55e" },
      { category: "Plastic", count: 14, color: "#3b82f6" },
      { category: "Paper", count: 8, color: "#eab308" },
      { category: "Metal", count: 4, color: "#6b7280" },
      { category: "Glass", count: 2, color: "#06b6d4" },
      { category: "E-waste", count: 1, color: "#ef4444" },
    ],
    recentActivity: [
      { id: "ra1", userId: "demo-user", category: "plastic", itemName: "Plastic Bottle", pointsEarned: 15, verifiedAt: new Date(Date.now() - 7200000).toISOString(), date: "Today" },
      { id: "ra2", userId: "demo-user", category: "organic", itemName: "Vegetable Peels", pointsEarned: 10, verifiedAt: new Date(Date.now() - 86400000).toISOString(), date: "Yesterday" },
      { id: "ra3", userId: "demo-user", category: "paper", itemName: "Newspaper", pointsEarned: 12, verifiedAt: new Date(Date.now() - 172800000).toISOString(), date: "2 days ago" },
    ],
  });
});

export default router;
