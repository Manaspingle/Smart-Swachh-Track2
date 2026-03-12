import { Router, type IRouter } from "express";
import { SignupBody, LoginBody } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const router: IRouter = Router();

function requireJwtSecret(): string {
  const secret = process.env["JWT_SECRET"];
  if (!secret || secret.trim() === "") {
    throw new Error("JWT_SECRET must be set (see .env.example).");
  }
  return secret;
}

function signToken(payload: { userId: string }): string {
  return jwt.sign(payload, requireJwtSecret(), { expiresIn: "7d" });
}

function toUserProfile(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    greenPoints: user.greenPoints,
    level: user.level,
    joinedAt: user.joinedAt.toISOString(),
  };
}

router.post("/signup", (req, res) => {
  void (async () => {
    const parsed = SignupBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_error", message: "Invalid request data" });
      return;
    }

    const { name, email, phone, password, city } = parsed.data;
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      res.status(400).json({ error: "user_exists", message: "User already exists with this email" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [created] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        phone,
        city,
        passwordHash,
      })
      .returning();

    const token = signToken({ userId: created.id });
    res.status(201).json({ token, user: toUserProfile(created) });
  })().catch((err: unknown) => {
    console.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to create user" });
  });
});

router.post("/login", (req, res) => {
  void (async () => {
    const parsed = LoginBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_error", message: "Invalid request data" });
      return;
    }

    const { email, password } = parsed.data;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user) {
      res.status(401).json({ error: "invalid_credentials", message: "Invalid email or password" });
      return;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      res.status(401).json({ error: "invalid_credentials", message: "Invalid email or password" });
      return;
    }

    const token = signToken({ userId: user.id });
    res.json({ token, user: toUserProfile(user) });
  })().catch((err: unknown) => {
    console.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to login" });
  });
});

export default router;
