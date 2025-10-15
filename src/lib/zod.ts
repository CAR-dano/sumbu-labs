import { z } from "zod";

export const imageSchema = z.object({
  url: z.string(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  format: z.string().optional(),
});

export const linksSchema = z.object({
  live: z.string().url().optional().or(z.literal("")),
  repo: z.string().url().optional().or(z.literal("")),
  caseStudy: z.string().url().optional().or(z.literal("")),
});

export const projectSchema = z.object({
  title: z
    .string()
    .min(4, "Title must be at least 4 characters")
    .max(100, "Title must be at most 100 characters"),
  slug: z.string().optional(),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters")
    .max(200, "Short description must be at most 200 characters"),
  description: z.string().optional(),
  tags: z.array(z.string()).max(8, "Maximum 8 tags allowed").default([]),
  roles: z.array(z.string()).max(8, "Maximum 8 roles allowed").default([]),
  categories: z
    .array(
      z.enum([
        "software development",
        "ui/ux design",
        "artificial intelligent",
        "blockchain",
        "other",
      ])
    )
    .min(1, "At least one category is required"),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
  order: z.number().int().min(0, "Order must be 0 or greater").default(0),
  links: linksSchema.optional(),
  metrics: z.record(z.string(), z.number()).optional(),
  coverImage: imageSchema.optional(),
  gallery: z.array(imageSchema).optional(),
});

export const projectCreateSchema = projectSchema.extend({
  categories: z
    .array(
      z.enum([
        "software development",
        "ui/ux design",
        "artificial intelligent",
        "blockchain",
        "other",
      ])
    )
    .min(1, "At least one category is required")
    .default(["other"]),
});

export const projectUpdateSchema = projectSchema.partial().extend({
  // Override categories to make validation work properly on updates
  // Don't use .default() here so it can be explicitly updated
  categories: z
    .array(
      z.enum([
        "software development",
        "ui/ux design",
        "artificial intelligent",
        "blockchain",
        "other",
      ])
    )
    .min(1, "At least one category is required")
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;

// Brief Submission Schema
const attachmentSchema = z.object({
  url: z.string(),
  name: z.string().max(255),
  size: z.number().max(8 * 1024 * 1024), // 8MB
  type: z.string(),
});

export const briefSubmissionSchema = z.object({
  // Contact (required)
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  company: z.string().max(100).optional(),
  email: z.string().email("Invalid email address").max(100),
  phone: z.string().max(30).optional(),

  // Project
  projectTitle: z.string().max(200).optional(),
  projectType: z
    .array(z.string())
    .min(1, "Select at least one project type")
    .max(10),
  goals: z
    .string()
    .min(5, "Please describe your goals (at least 5 characters)")
    .max(2000, "Goals description is too long")
    .optional(),
  problems: z.string().max(2000).optional(),
  scopeFeatures: z.array(z.string().max(200)).max(20).default([]),
  platforms: z.array(z.string()).max(10).default([]),
  integrations: z.array(z.string()).max(20).default([]),
  references: z.array(z.string().url("Invalid URL")).max(10).default([]),
  attachments: z.array(attachmentSchema).max(3).default([]),

  // Business
  budgetRange: z
    .enum(["under-5k", "5-10k", "10-25k", "25-50k", "50-100k", "100k-plus"])
    .optional(),
  timeline: z.enum(["asap", "1-2 months", "3-6 months", "flexible"]).optional(),
  startDateTarget: z.string().optional(), // ISO date string
  locationTimezone: z.string().max(100).optional(),

  // Privacy & Consent
  ndaRequired: z.boolean().default(false),
  acceptPolicy: z.boolean().refine((val) => val === true, {
    message: "You must accept the privacy policy",
  }),

  // Honeypot (anti-spam)
  website: z.string().max(0).optional(), // Should be empty
});

export const briefUpdateSchema = z.object({
  status: z
    .enum(["new", "reviewing", "replied", "qualified", "archived"])
    .optional(),
  starred: z.boolean().optional(),
  internalNotes: z.string().max(5000).optional(),
});

export type BriefSubmissionInput = z.infer<typeof briefSubmissionSchema>;
export type BriefUpdateInput = z.infer<typeof briefUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ImageData = z.infer<typeof imageSchema>;
export type LinksData = z.infer<typeof linksSchema>;
