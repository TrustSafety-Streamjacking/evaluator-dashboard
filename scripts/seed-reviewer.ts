/**
 * Seed a reviewer account into the MongoDB reviewers collection.
 *
 * Usage:
 *   pnpm tsx scripts/seed-reviewer.ts <username> <password> [display_name]
 *
 * Example:
 *   pnpm tsx scripts/seed-reviewer.ts ag10293 mypassword "Aninda Ghosh"
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load .env.local
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

if (!MONGODB_URI || !MONGODB_DB_NAME) {
  console.error("❌ Missing MONGODB_URI or MONGODB_DB_NAME in environment variables.");
  process.exit(1);
}

const [, , username, password, displayName] = process.argv;

if (!username || !password) {
  console.error("Usage: pnpm tsx scripts/seed-reviewer.ts <username> <password> [display_name]");
  process.exit(1);
}

const ReviewerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  display_name: String,
  created_at: { type: Date, default: Date.now },
});

async function main() {
  await mongoose.connect(MONGODB_URI!, { dbName: MONGODB_DB_NAME });
  console.log("✅ Connected to MongoDB");

  const Reviewer = mongoose.models.Reviewer || mongoose.model("Reviewer", ReviewerSchema);

  const existing = await Reviewer.findOne({ username: username.toLowerCase().trim() });
  if (existing) {
    // Update password
    const hash = await bcrypt.hash(password, 10);
    await Reviewer.updateOne(
      { username: username.toLowerCase().trim() },
      { $set: { password_hash: hash, display_name: displayName || existing.display_name } }
    );
    console.log(`✅ Updated reviewer: ${username}`);
  } else {
    const hash = await bcrypt.hash(password, 10);
    await Reviewer.create({
      username: username.toLowerCase().trim(),
      password_hash: hash,
      display_name: displayName || username,
    });
    console.log(`✅ Created reviewer: ${username} (${displayName || username})`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
