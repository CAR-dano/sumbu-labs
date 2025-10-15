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
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ImageData = z.infer<typeof imageSchema>;
export type LinksData = z.infer<typeof linksSchema>;
