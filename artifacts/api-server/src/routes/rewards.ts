import { Router, type IRouter } from "express";

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
  res.json({
    userId: "demo-user",
    greenPoints: 750,
    level: "Recycling Champion",
    nextLevelPoints: 1000,
    rank: 4,
    totalUsers: 12450,
    weeklyPoints: 125,
    monthlyPoints: 380,
  });
});

router.get("/leaderboard", (_req, res) => {
  res.json(leaderboardData);
});

router.get("/badges", (_req, res) => {
  res.json(allBadges);
});

export default router;
