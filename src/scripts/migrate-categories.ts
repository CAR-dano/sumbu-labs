/**
 * Migration script to add categories field to existing projects
 * Run this once: npx ts-node src/scripts/migrate-categories.ts
 */

import { connectDB } from "@/lib/db";
import Project from "@/models/Project";

async function migrateCategories() {
  try {
    await connectDB();

    const projectsWithoutCategories = await Project.find({
      $or: [{ categories: { $exists: false } }, { categories: { $size: 0 } }],
    });

    for (const project of projectsWithoutCategories) {
      project.categories = ["other"];
      await project.save();
    }

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateCategories();
