import { Document } from "mongoose";

export interface ImageData {
  url: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface LinksData {
  live?: string;
  repo?: string;
  caseStudy?: string;
}

export interface IProject extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description?: string;
  tags: string[];
  roles: string[];
  categories: string[];
  status: "draft" | "published";
  featured: boolean;
  order: number;
  links?: LinksData;
  metrics?: Record<string, number>;
  coverImage?: ImageData;
  gallery?: ImageData[];
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
