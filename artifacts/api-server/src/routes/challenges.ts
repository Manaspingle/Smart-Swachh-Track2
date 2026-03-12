import { Router, type IRouter } from "express";
import { CompleteChallengeBody } from "@workspace/api-zod";

const router: IRouter = Router();

const challenges = [
  {
    id: "ch1",
    title: "Plastic-Free Morning",
    description: "Segregate 3 plastic items and dispose them in the correct blue bin today",
    points: 30,
    category: "plastic",
    difficulty: "easy" as const,
    completed: false,
    deadline: new Date(new Date().setHours(23, 59, 59)).toISOString(),
  },
  {
    id: "ch2",
    title: "Organic Champion",
    description: "Compost your kitchen waste instead of throwing it in the bin",
    points: 50,
    category: "organic",
    difficulty: "medium" as const,
    completed: false,
    deadline: new Date(new Date().setHours(23, 59, 59)).toISOString(),
  },
  {
    id: "ch3",
    title: "E-Waste Awareness",
    description: "Collect one piece of e-waste from home and locate the nearest collection center",
    points: 75,
    category: "ewaste",
    difficulty: "hard" as const,
    completed: true,
    deadline: new Date(new Date().setHours(23, 59, 59)).toISOString(),
  },
  {
    id: "ch4",
    title: "Paper Recycler",
    description: "Collect 5 newspapers or paper items and put them in the yellow bin",
    points: 25,
    category: "paper",
    difficulty: "easy" as const,
    completed: false,
    deadline: new Date(new Date().setHours(23, 59, 59)).toISOString(),
  },
  {
    id: "ch5",
    title: "Community Drive",
    description: "Encourage one family member or neighbor to start segregating waste",
    points: 100,
    category: "community",
    difficulty: "medium" as const,
    completed: false,
    deadline: new Date(new Date().setHours(23, 59, 59)).toISOString(),
  },
];

router.get("/daily", (_req, res) => {
  res.json(challenges);
});

router.post("/complete", (req, res) => {
  const parsed = CompleteChallengeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: "Invalid request" });
    return;
  }
  const challenge = challenges.find((c) => c.id === parsed.data.challengeId);
  const pointsAwarded = challenge ? challenge.points : 25;
  res.json({
    success: true,
    pointsAwarded,
    message: `Great job! You earned ${pointsAwarded} Green Points for completing this challenge!`,
  });
});

export default router;
