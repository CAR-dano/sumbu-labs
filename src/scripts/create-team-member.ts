import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { connectDB } from "../lib/db";
import Role from "../models/Role";
import TeamMember from "../models/TeamMember";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createFirstMember() {
  try {
    await connectDB();
    console.log("✅ Connected to database\n");

    // Check if any members exist
    const existingMembers = await TeamMember.countDocuments();
    if (existingMembers > 0) {
      console.log(`⚠️  ${existingMembers} team member(s) already exist.`);
      const proceed = await question(
        "Do you want to create another member anyway? (y/N): "
      );
      if (proceed.toLowerCase() !== "y") {
        console.log("\n👋 Cancelled.");
        process.exit(0);
      }
      console.log("");
    }

    // Get available roles
    const roles = await Role.find().sort({ name: 1 });
    if (roles.length === 0) {
      console.log("❌ No roles found. Please run the seed script first:");
      console.log("   npx tsx src/scripts/seed-team.ts\n");
      process.exit(1);
    }

    console.log("📋 Available Roles:");
    roles.forEach((role, index) => {
      console.log(`   ${index + 1}. ${role.name}`);
    });
    console.log("");

    // Collect member information
    const fullName = await question("👤 Full Name: ");
    const nickname = await question(
      "🏷️  Nickname (optional, press Enter to skip): "
    );

    const roleIndexStr = await question(`🎯 Role (1-${roles.length}): `);
    const roleIndex = parseInt(roleIndexStr) - 1;

    if (roleIndex < 0 || roleIndex >= roles.length) {
      console.log("❌ Invalid role selection");
      process.exit(1);
    }

    const categoryStr = await question("👑 Category (1=Core, 2=Member): ");
    const category = categoryStr === "1" ? "Core" : "Member";

    const skillsStr = await question(
      "🛠️  Skills (comma-separated, optional): "
    );
    const skills = skillsStr
      ? skillsStr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const bio = await question("📝 Bio (optional): ");
    const photoUrl = await question("📸 Photo URL (optional): ");

    let pin = "";
    while (true) {
      pin = await question("🔐 PIN (4-6 digits): ");
      if (/^\d{4,6}$/.test(pin)) {
        const confirmPin = await question("🔐 Confirm PIN: ");
        if (pin === confirmPin) {
          break;
        } else {
          console.log("❌ PINs do not match. Try again.\n");
        }
      } else {
        console.log("❌ PIN must be 4-6 digits. Try again.\n");
      }
    }

    console.log("\n📝 Creating team member...");

    const newMember = await TeamMember.create({
      fullName: fullName.trim(),
      nickname: nickname.trim() || undefined,
      role: roles[roleIndex]._id,
      category,
      skills,
      bio: bio.trim() || undefined,
      photoUrl: photoUrl.trim() || undefined,
      pin,
      isActive: true,
    });

    await newMember.populate("role");

    const roleData = newMember.role as unknown as { name: string };

    console.log("\n✅ Team member created successfully!");
    console.log("\n📋 Member Details:");
    console.log(`   Name: ${newMember.fullName}`);
    console.log(`   Nickname: ${newMember.nickname || "N/A"}`);
    console.log(`   Role: ${roleData.name}`);
    console.log(`   Category: ${newMember.category}`);
    console.log(`   Skills: ${newMember.skills?.join(", ") || "None"}`);
    console.log(`   Status: Active`);
    console.log(`\n🔑 You can now login at /admin/login with PIN: ${pin}`);
    console.log("\n⚠️  Remember your PIN! It cannot be recovered.\n");

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error creating team member:", error);
    rl.close();
    process.exit(1);
  }
}

createFirstMember();
