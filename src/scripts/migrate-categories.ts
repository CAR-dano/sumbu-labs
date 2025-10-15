/**
 * Migration script to add categories field to existing projects
 * Run this once: npx ts-node src/scripts/migrate-categories.ts
 */

import { connectDB } from "@/lib/db";
import Project from "@/models/Project";

async function migrateCategories() {
  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Finding projects without categories...");
    const projectsWithoutCategories = await Project.find({
      $or: [{ categories: { $exists: false } }, { categories: { $size: 0 } }],
    });

    console.log(`Found ${projectsWithoutCategories.length} projects to update`);

    for (const project of projectsWithoutCategories) {
      console.log(`Updating project: ${project.title}`);
      project.categories = ["other"];
      await project.save();
    }

    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateCategories();
