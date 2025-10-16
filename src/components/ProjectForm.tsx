"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ProjectInput, projectSchema } from "@/lib/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  FileText,
  Tag,
  Layers,
  Image as ImageIcon,
  Link as LinkIcon,
  Settings,
  Sparkles,
  X,
  Upload,
  Save,
  ArrowLeft,
} from "lucide-react";

interface ProjectFormProps {
  initialData?: Partial<ProjectInput> & { _id?: string };
  isEdit?: boolean;
}

type FormValues = {
  title: string;
  shortDescription: string;
  description?: string;
  tags: string[];
  roles: string[];
  categories: Array<
    | "software development"
    | "ui/ux design"
    | "artificial intelligent"
    | "blockchain"
    | "other"
  >;
  status: "draft" | "published";
  featured: boolean;
  order: number;
  links?: {
    live?: string;
    repo?: string;
    caseStudy?: string;
  };
  metrics?: Record<string, number>;
  coverImage?: {
    url: string;
    width?: number;
    height?: number;
    format?: string;
  };
  gallery?: Array<{
    url: string;
    width?: number;
    height?: number;
    format?: string;
  }>;
  slug?: string;
};

export default function ProjectForm({ initialData, isEdit }: ProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [coverPreview, setCoverPreview] = useState(
    initialData?.coverImage?.url || ""
  );
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
    initialData?.gallery?.map((g) => g.url) || []
  );
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      title: initialData?.title || "",
      shortDescription: initialData?.shortDescription || "",
      description: initialData?.description || "",
      tags: initialData?.tags || [],
      roles: initialData?.roles || [],
      categories: initialData?.categories || ["other"],
      status: initialData?.status || "draft",
      featured: initialData?.featured || false,
      order: initialData?.order || 0,
      links: initialData?.links || { live: "", repo: "", caseStudy: "" },
      coverImage: initialData?.coverImage,
      gallery: initialData?.gallery || [],
    },
  });

  const tags = watch("tags") || [];
  const roles = watch("roles") || [];
  const categories = watch("categories") || ["other"];

  const categoryOptions = [
    { value: "software development", label: "Software Development" },
    { value: "ui/ux design", label: "UI/UX Design" },
    { value: "artificial intelligent", label: "Artificial Intelligent" },
    { value: "blockchain", label: "Blockchain" },
    { value: "other", label: "Other" },
  ] as const;

  const addTag = () => {
    if (tagInput.trim() && tags.length < 8 && !tags.includes(tagInput.trim())) {
      setValue("tags", [...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setValue(
      "tags",
      tags.filter((t) => t !== tag)
    );
  };

  const addRole = () => {
    if (
      roleInput.trim() &&
      roles.length < 8 &&
      !roles.includes(roleInput.trim())
    ) {
      setValue("roles", [...roles, roleInput.trim()]);
      setRoleInput("");
    }
  };

  const removeRole = (role: string) => {
    setValue(
      "roles",
      roles.filter((r) => r !== role)
    );
  };

  const toggleCategory = (
    category:
      | "software development"
      | "ui/ux design"
      | "artificial intelligent"
      | "blockchain"
      | "other"
  ) => {
    const currentCategories = categories || [];
    if (currentCategories.includes(category)) {
      // Don't allow removing last category
      if (currentCategories.length === 1) {
        toast({
          title: "Error",
          description: "At least one category is required",
          variant: "error",
        });
        return;
      }
      setValue(
        "categories",
        currentCategories.filter((c) => c !== category)
      );
    } else {
      setValue("categories", [...currentCategories, category]);
    }
  };

  const uploadFile = async (
    file: File,
    folder?: string
  ): Promise<{
    url: string;
    width?: number;
    height?: number;
    mime?: string;
  }> => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
      formData.append("folder", folder);
    }

    const res = await fetch("/api/uploads/image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return {
      url: data.file.url,
      width: data.file.width,
      height: data.file.height,
      mime: data.file.mime,
    };
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate title before upload
    const currentTitle = watch("title");
    if (!currentTitle || currentTitle.trim() === "") {
      toast({
        title: "Title Required",
        description: "Please enter project title before uploading images",
        variant: "error",
      });
      e.target.value = ""; // Reset input
      return;
    }

    setUploading(true);
    try {
      // Generate slug from title for folder name
      const projectSlug =
        currentTitle
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]/g, "")
          .substring(0, 50) || `project-${Date.now()}`;

      const folder = `projects/${projectSlug}`;

      const result = await uploadFile(file, folder);
      setCoverPreview(result.url);
      setValue("coverImage", {
        url: result.url,
        width: result.width,
        height: result.height,
        format: result.mime,
      });
      toast({ title: "Success", description: "Cover image uploaded" });
    } catch {
      toast({
        title: "Error",
        description: "Upload failed",
        variant: "error",
      });
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate title before upload
    const currentTitle = watch("title");
    if (!currentTitle || currentTitle.trim() === "") {
      toast({
        title: "Title Required",
        description: "Please enter project title before uploading images",
        variant: "error",
      });
      e.target.value = ""; // Reset input
      return;
    }

    setUploading(true);
    try {
      // Generate slug from title for folder name
      const projectSlug =
        currentTitle
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]/g, "")
          .substring(0, 50) || `project-${Date.now()}`;

      const folder = `projects/${projectSlug}/gallery`;

      const results = await Promise.all(
        files.map((file) => uploadFile(file, folder))
      );
      const newGallery = [
        ...(watch("gallery") || []),
        ...results.map((r) => ({
          url: r.url,
          width: r.width,
          height: r.height,
          format: r.mime,
        })),
      ];
      setValue("gallery", newGallery);
      setGalleryPreviews(newGallery.map((g) => g.url));
      toast({ title: "Success", description: "Images uploaded" });
    } catch {
      toast({
        title: "Error",
        description: "Upload failed",
        variant: "error",
      });
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = (watch("gallery") || []).filter((_, i) => i !== index);
    setValue("gallery", newGallery);
    setGalleryPreviews(newGallery.map((g) => g.url));
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    try {
      // Validate with zod
      const validation = projectSchema.safeParse(data);
      if (!validation.success) {
        console.error("Form validation failed:", validation.error);
        toast({
          title: "Validation Error",
          description: validation.error.issues[0].message,
          variant: "error",
        });
        setLoading(false);
        return;
      }

      const url = isEdit
        ? `/api/projects/${initialData?._id}`
        : "/api/projects";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save project");
      }

      toast({
        title: "Success",
        description: `Project ${isEdit ? "updated" : "created"} successfully`,
      });

      router.push("/admin");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] left-[15%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse [animation-delay:2s]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-6">
        {/* 1️⃣ PROJECT BASICS SECTION */}
        <div
          className="group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 
                     shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(138,106,254,0.15)] 
                     transition-all duration-500"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Project Basics
              </h2>
              <p className="text-sm text-gray-400">
                Core information about your project
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-gray-300 flex items-center gap-2"
              >
                Project Title
                <span className="text-purple-400 text-xs">*</span>
              </Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter project title..."
                className="bg-white/[0.03] border-white/10 text-white placeholder:text-gray-500 
                         focus:border-purple-500/40 focus:ring-purple-500/40 
                         transition-all duration-200 hover:bg-white/[0.05]"
              />
              {errors.title && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400" />
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="shortDescription"
                className="text-sm font-medium text-gray-300 flex items-center gap-2"
              >
                Short Description
                <span className="text-purple-400 text-xs">*</span>
              </Label>
              <Textarea
                id="shortDescription"
                {...register("shortDescription")}
                rows={3}
                placeholder="Brief overview of the project (1-2 sentences)..."
                className="bg-white/[0.03] border-white/10 text-white placeholder:text-gray-500 
                         focus:border-purple-500/40 focus:ring-purple-500/40 resize-none
                         transition-all duration-200 hover:bg-white/[0.05]"
              />
              {errors.shortDescription && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400" />
                  {errors.shortDescription.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 2️⃣ CONTENT DETAILS SECTION */}
        <div
          className="group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 
                     shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(138,106,254,0.15)] 
                     transition-all duration-500"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Content Details
              </h2>
              <p className="text-sm text-gray-400">
                Detailed description and related metadata
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-300"
              >
                Full Description (Markdown supported)
              </Label>
              <p className="text-xs text-gray-500">
                Use markdown formatting for rich text
              </p>
              <Textarea
                id="description"
                {...register("description")}
                rows={10}
                placeholder="## Project Overview&#10;&#10;Detailed description of your project...&#10;&#10;### Key Features&#10;- Feature 1&#10;- Feature 2"
                className="bg-white/[0.03] border-white/10 text-white placeholder:text-gray-500 
                         focus:border-purple-500/40 focus:ring-purple-500/40 resize-y font-mono text-sm
                         transition-all duration-200 hover:bg-white/[0.05]"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Tags */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-400" />
                  Tags
                  <span className="text-xs text-gray-500">(max 8)</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add tag..."
                    className="bg-white/[0.03] border-white/10 text-white placeholder:text-gray-500 
                             focus:border-purple-500/40 focus:ring-purple-500/40 
                             transition-all duration-200 hover:bg-white/[0.05]"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    disabled={tags.length >= 8}
                    className="bg-purple-500/10 border border-purple-500/20 text-purple-400 
                             hover:bg-purple-500/20 hover:border-purple-500/30 
                             disabled:opacity-30 disabled:cursor-not-allowed shrink-0
                             transition-all duration-200"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-purple-500/10 border border-purple-500/30 text-purple-300 
                               hover:bg-purple-500/20 hover:border-purple-500/40 cursor-pointer
                               transition-all duration-200 hover:scale-105 px-3 py-1"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <X className="w-3 h-3 ml-1.5" />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Roles */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Your Roles
                  <span className="text-xs text-gray-500">(max 8)</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addRole();
                      }
                    }}
                    placeholder="Add role..."
                    className="bg-white/[0.03] border-white/10 text-white placeholder:text-gray-500 
                             focus:border-purple-500/40 focus:ring-purple-500/40 
                             transition-all duration-200 hover:bg-white/[0.05]"
                  />
                  <Button
                    type="button"
                    onClick={addRole}
                    disabled={roles.length >= 8}
                    className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 
                             hover:bg-indigo-500/20 hover:border-indigo-500/30 
                             disabled:opacity-30 disabled:cursor-not-allowed shrink-0
                             transition-all duration-200"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <Badge
                      key={role}
                      className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 
                               hover:bg-indigo-500/20 hover:border-indigo-500/40 cursor-pointer
                               transition-all duration-200 hover:scale-105 px-3 py-1"
                      onClick={() => removeRole(role)}
                    >
                      {role}
                      <X className="w-3 h-3 ml-1.5" />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Links Section */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-purple-400" />
                Project Links
              </Label>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="live" className="text-xs text-gray-400">
                    Live URL
                  </Label>
                  <Input
                    id="live"
                    {...register("links.live")}
                    placeholder="https://..."
                    className="bg-white/[0.03] border-white/10 text-white placeholder:text-gray-500 
                             focus:border-purple-500/40 focus:ring-purple-500/40 
                             transition-all duration-200 hover:bg-white/[0.05]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repo" className="text-xs text-gray-400">
                    Repository
                  </Label>
                  <Input
                    id="repo"
                    {...register("links.repo")}
                    placeholder="https://github.com/..."
                    className="bg-white/[0.03] border-white/10 text-white placeholder:text-gray-500 
                             focus:border-purple-500/40 focus:ring-purple-500/40 
                             transition-all duration-200 hover:bg-white/[0.05]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caseStudy" className="text-xs text-gray-400">
                    Case Study
                  </Label>
                  <Input
                    id="caseStudy"
                    {...register("links.caseStudy")}
                    placeholder="https://..."
                    className="bg-white/[0.03] border-white/10 text-white placeholder:text-gray-500 
                             focus:border-purple-500/40 focus:ring-purple-500/40 
                             transition-all duration-200 hover:bg-white/[0.05]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3️⃣ CATEGORIES & METADATA SECTION */}
        <div
          className="group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 
                     shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(138,106,254,0.15)] 
                     transition-all duration-500"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Categories & Metadata
              </h2>
              <p className="text-sm text-gray-400">
                Classification and publishing settings
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Categories */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                Project Categories
                <span className="text-purple-400 text-xs">
                  * (Select at least one)
                </span>
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categoryOptions.map((option) => {
                  const isSelected = categories.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleCategory(option.value)}
                      className={`group/cat relative rounded-xl p-4 border-2 transition-all duration-300 
                                hover:scale-[1.02] hover:shadow-lg text-left
                                ${
                                  isSelected
                                    ? "border-purple-500/60 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                                }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
                                    ${
                                      isSelected
                                        ? "border-purple-500 bg-purple-500"
                                        : "border-gray-500 group-hover/cat:border-gray-400"
                                    }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium transition-colors duration-200
                                    ${
                                      isSelected
                                        ? "text-purple-300"
                                        : "text-gray-300"
                                    }`}
                        >
                          {option.label}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 rounded-xl bg-purple-500/5 pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>
              {errors.categories && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400" />
                  {errors.categories.message}
                </p>
              )}
            </div>

            {/* Status, Order, Featured */}
            <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
              <div className="space-y-2">
                <Label
                  htmlFor="status"
                  className="text-sm font-medium text-gray-300 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-purple-400" />
                  Status
                </Label>
                <Select
                  value={watch("status")}
                  onValueChange={(value: "draft" | "published") =>
                    setValue("status", value)
                  }
                >
                  <SelectTrigger className="bg-white/[0.03] border-white/10 text-white focus:border-purple-500/40 focus:ring-purple-500/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0b0f1a] border-white/10">
                    <SelectItem
                      value="draft"
                      className="text-gray-300 focus:bg-white/10 focus:text-white"
                    >
                      Draft
                    </SelectItem>
                    <SelectItem
                      value="published"
                      className="text-gray-300 focus:bg-white/10 focus:text-white"
                    >
                      Published
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="order"
                  className="text-sm font-medium text-gray-300"
                >
                  Display Order
                </Label>
                <Input
                  id="order"
                  type="number"
                  {...register("order", { valueAsNumber: true })}
                  placeholder="0"
                  className="bg-white/[0.03] border-white/10 text-white placeholder:text-gray-500 
                           focus:border-purple-500/40 focus:ring-purple-500/40 
                           transition-all duration-200 hover:bg-white/[0.05]"
                />
              </div>

              <div className="flex flex-col justify-end">
                <div
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 
                              hover:bg-white/[0.05] transition-all duration-200"
                >
                  <Switch
                    id="featured"
                    checked={watch("featured")}
                    onCheckedChange={(checked) => setValue("featured", checked)}
                    className="data-[state=checked]:bg-purple-500"
                  />
                  <Label
                    htmlFor="featured"
                    className="text-sm font-medium text-gray-300 cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    Featured Project
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4️⃣ MEDIA UPLOADS SECTION */}
        <div
          className="group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 
                     shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(138,106,254,0.15)] 
                     transition-all duration-500"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Media & Assets
              </h2>
              <p className="text-sm text-gray-400">
                Upload images and visual content
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Cover Image */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                Cover Image
              </Label>

              {coverPreview ? (
                <div className="relative group/img rounded-xl overflow-hidden border border-white/10">
                  <div className="relative w-full h-64 bg-black/20">
                    <Image
                      src={coverPreview}
                      alt="Cover"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setCoverPreview("");
                          setValue("coverImage", undefined);
                        }}
                        className="bg-red-500/90 hover:bg-red-600 border-0"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove Image
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="coverUpload"
                  className="relative block w-full h-64 rounded-xl border-2 border-dashed border-white/20 
                           bg-white/[0.02] hover:bg-white/[0.05] hover:border-purple-500/40 
                           transition-all duration-300 cursor-pointer group/upload"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover/upload:scale-110 transition-transform duration-300">
                      <Upload className="w-8 h-8 text-purple-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-300">
                        Click to upload cover image
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                  </div>
                  <Input
                    id="coverUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={uploading}
                    className="sr-only"
                  />
                </label>
              )}
            </div>

            {/* Gallery */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Project Gallery
                <span className="text-xs text-gray-500">(Multiple images)</span>
              </Label>

              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryPreviews.map((url, index) => (
                    <div
                      key={index}
                      className="relative group/gal aspect-square rounded-xl overflow-hidden border border-white/10"
                    >
                      <Image
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/gal:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="w-8 h-8 rounded-lg bg-red-500/90 hover:bg-red-600 flex items-center justify-center transition-colors duration-200"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <label
                htmlFor="galleryUpload"
                className="relative block w-full py-8 rounded-xl border-2 border-dashed border-white/20 
                         bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/40 
                         transition-all duration-300 cursor-pointer group/upload"
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover/upload:scale-110 transition-transform duration-300">
                    <Upload className="w-7 h-7 text-indigo-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-300">
                      Upload gallery images
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Select multiple images to upload
                    </p>
                  </div>
                </div>
                <Input
                  id="galleryUpload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  disabled={uploading}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>

        {/* STICKY SAVE BAR */}
        <div
          className="sticky bottom-0 left-0 right-0 z-50 bg-[#0b0f1a]/95 backdrop-blur-xl 
                     border-t border-white/10 px-6 py-4 mt-8 -mx-6 md:-mx-8"
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading || uploading}
              className="bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/[0.05] 
                       hover:text-white transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>

            <div className="flex items-center gap-3">
              {uploading && (
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                  Uploading...
                </span>
              )}

              <Button
                type="submit"
                disabled={loading || uploading}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 
                         text-white font-medium px-8 shadow-lg shadow-purple-500/25 
                         hover:shadow-purple-500/40 transition-all duration-300 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEdit ? "Update Project" : "Create Project"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
