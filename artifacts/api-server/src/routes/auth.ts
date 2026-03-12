import { Router, type IRouter } from "express";
import { SignupBody, LoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

const mockUsers: Record<string, { id: string; name: string; email: string; phone: string; city: string; password: string; greenPoints: number; level: string; joinedAt: string }> = {
  "demo@swachhtrack.in": {
    id: "user-demo-1",
    name: "Priya Sharma",
    email: "demo@swachhtrack.in",
    phone: "9876543210",
    city: "Mumbai",
    password: "demo123",
    greenPoints: 750,
    level: "Recycling Champion",
    joinedAt: "2025-01-15T00:00:00Z",
  },
};

router.post("/signup", (req, res) => {
  const parsed = SignupBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: "Invalid request data" });
    return;
  }
  const { name, email, phone, password, city } = parsed.data;
  if (mockUsers[email]) {
    res.status(400).json({ error: "user_exists", message: "User already exists with this email" });
    return;
  }
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    phone,
    city,
    password,
    greenPoints: 0,
    level: "Eco Beginner",
    joinedAt: new Date().toISOString(),
  };
  mockUsers[email] = newUser;
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({
    token: `mock-token-${newUser.id}`,
    user: userWithoutPassword,
  });
});

router.post("/login", (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: "Invalid request data" });
    return;
  }
  const { email, password } = parsed.data;
  const user = mockUsers[email];
  if (!user || user.password !== password) {
    res.status(401).json({ error: "invalid_credentials", message: "Invalid email or password" });
    return;
  }
  const { password: _, ...userWithoutPassword } = user;
  res.json({
    token: `mock-token-${user.id}`,
    user: userWithoutPassword,
  });
});

export default router;
