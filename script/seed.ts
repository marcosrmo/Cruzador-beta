import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Starting seed...");

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "diretor123";

  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  // Check if admin user already exists
  const [existingAdmin] = await db.select().from(users).where(eq(users.username, adminUsername));
  
  if (existingAdmin) {
    // Update the password of existing admin
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.username, adminUsername));
    console.log(`Admin password updated for: ${adminUsername}`);
  } else {
    // Create admin user
    await db.insert(users).values({
      username: adminUsername,
      password: hashedPassword,
    });
    console.log(`Admin user created: ${adminUsername}`);
  }

  console.log("Seed completed successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
