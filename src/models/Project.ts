import mongoose, { Schema, Model } from "mongoose";
import { IProject } from "@/types/project";

const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
  },
  { _id: false }
);

const linksSchema = new Schema(
  {
    live: { type: String },
    repo: { type: String },
    caseStudy: { type: String },
  },
  { _id: false }
);

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 200,
    },
    description: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
      validate: [(val: string[]) => val.length <= 8, "Maximum 8 tags allowed"],
    },
    roles: {
      type: [String],
      default: [],
      validate: [(val: string[]) => val.length <= 8, "Maximum 8 roles allowed"],
    },
    categories: {
      type: [String],
      default: ["other"],
      enum: [
        "software development",
        "ui/ux design",
        "artificial intelligent",
        "blockchain",
        "other",
      ],
      validate: [
        (val: string[]) => val.length >= 1,
        "At least one category is required",
      ],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
    links: {
      type: linksSchema,
    },
    metrics: {
      type: Map,
      of: Number,
    },
    coverImage: {
      type: imageSchema,
    },
    gallery: {
      type: [imageSchema],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "TeamMember",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "TeamMember",
    },
  } as Record<string, unknown>,
  {
    timestamps: true,
  }
);

// Generate unique slug from title
export async function generateUniqueSlug(
  title: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const query: { slug: string; _id?: { $ne: string } } = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await Project.findOne(query);
    if (!existing) break;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

projectSchema.index({ status: 1, order: 1, createdAt: -1 });
projectSchema.index({ status: 1, featured: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ categories: 1 });

// Clear cached model if exists in development
if (process.env.NODE_ENV !== "production" && mongoose.models.Project) {
  delete mongoose.models.Project;
}

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);

export default Project;
