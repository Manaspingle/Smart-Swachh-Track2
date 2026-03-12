import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const userAgent = process.env.npm_config_user_agent ?? "";
if (!userAgent.startsWith("pnpm/")) {
  console.error("Use pnpm instead (example: `pnpm install`).");
  process.exit(1);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
for (const file of ["package-lock.json", "yarn.lock"]) {
  const fullPath = path.join(root, file);
  try {
    fs.unlinkSync(fullPath);
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") continue;
    throw err;
  }
}

