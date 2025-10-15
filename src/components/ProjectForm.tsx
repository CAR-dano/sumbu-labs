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
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

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
          variant: "destructive",
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

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return data.url;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile(file);
      setCoverPreview(url);
      setValue("coverImage", { url });
      toast({ title: "Success", description: "Cover image uploaded" });
    } catch {
      toast({
        title: "Error",
        description: "Upload failed",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const urls = await Promise.all(files.map((file) => uploadFile(file)));
      const newGallery = [
        ...(watch("gallery") || []),
        ...urls.map((url) => ({ url })),
      ];
      setValue("gallery", newGallery);
      setGalleryPreviews(newGallery.map((g) => g.url));
      toast({ title: "Success", description: "Images uploaded" });
    } catch {
      toast({
        title: "Error",
        description: "Upload failed",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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
          variant: "destructive",
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
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" {...register("title")} />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short Description *</Label>
          <Textarea
            id="shortDescription"
            {...register("shortDescription")}
            rows={3}
          />
          {errors.shortDescription && (
            <p className="text-sm text-red-500">
              {errors.shortDescription.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Markdown)</Label>
          <Textarea
            id="description"
            {...register("description")}
            rows={8}
            placeholder="Write your project description in markdown..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Tags (max 8)</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Add tag..."
              />
              <Button
                type="button"
                onClick={addTag}
                disabled={tags.length >= 8}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  className="cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Roles (max 8)</Label>
            <div className="flex gap-2">
              <Input
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addRole())
                }
                placeholder="Add role..."
              />
              <Button
                type="button"
                onClick={addRole}
                disabled={roles.length >= 8}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {roles.map((role) => (
                <Badge
                  key={role}
                  className="cursor-pointer"
                  onClick={() => removeRole(role)}
                >
                  {role} ×
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Categories * (Select one or more)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categoryOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => toggleCategory(option.value)}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-purple-500 ${
                  categories.includes(option.value)
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-gray-700 bg-gray-800/50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      categories.includes(option.value)
                        ? "border-purple-500 bg-purple-500"
                        : "border-gray-500"
                    }`}
                  >
                    {categories.includes(option.value) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              </div>
            ))}
          </div>
          {errors.categories && (
            <p className="text-sm text-red-500">{errors.categories.message}</p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={watch("status")}
              onValueChange={(value: "draft" | "published") =>
                setValue("status", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              {...register("order", { valueAsNumber: true })}
            />
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <Switch
              id="featured"
              checked={watch("featured")}
              onCheckedChange={(checked) => setValue("featured", checked)}
            />
            <Label htmlFor="featured">Featured</Label>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Links</Label>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="live" className="text-sm">
                Live URL
              </Label>
              <Input
                id="live"
                {...register("links.live")}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo" className="text-sm">
                Repository
              </Label>
              <Input
                id="repo"
                {...register("links.repo")}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caseStudy" className="text-sm">
                Case Study
              </Label>
              <Input
                id="caseStudy"
                {...register("links.caseStudy")}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <Label>Cover Image</Label>
          {coverPreview && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
              <Image
                src={coverPreview}
                alt="Cover"
                fill
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => {
                  setCoverPreview("");
                  setValue("coverImage", undefined);
                }}
              >
                Remove
              </Button>
            </div>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            disabled={uploading}
          />
        </div>

        <div className="space-y-4">
          <Label>Gallery</Label>
          {galleryPreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {galleryPreviews.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden"
                >
                  <Image
                    src={url}
                    alt={`Gallery ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeGalleryImage(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryUpload}
            disabled={uploading}
          />
        </div>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading || uploading} className="px-8">
          {loading ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
