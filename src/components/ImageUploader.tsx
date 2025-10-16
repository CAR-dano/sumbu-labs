"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string, metadata?: ImageMetadata) => void;
  folder?: string;
  maxSizeMB?: number;
  aspectRatio?: number;
  className?: string;
  disabled?: boolean;
}

interface ImageMetadata {
  width?: number;
  height?: number;
  mime?: string;
  size?: number;
}

export default function ImageUploader({
  value,
  onChange,
  folder = "",
  maxSizeMB = 8,
  aspectRatio,
  className = "",
  disabled = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<void> => {
    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(`File size must be less than ${maxSizeMB}MB`);
    }

    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
      formData.append("folder", folder);
    }

    const res = await fetch("/api/uploads/image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Upload failed");
    }

    const data = await res.json();
    const metadata: ImageMetadata = {
      width: data.file.width,
      height: data.file.height,
      mime: data.file.mime,
      size: data.file.size,
    };

    setPreview(data.file.url);
    onChange(data.file.url, metadata);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadImage(file);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Upload failed",
        variant: "error",
      });
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
  };

  return (
    <div className={className}>
      {preview ? (
        <div className="relative group">
          <div
            className="relative w-full rounded-xl overflow-hidden border border-white/10"
            style={{
              aspectRatio: aspectRatio || "16/9",
            }}
          >
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={disabled || uploading}
                className="bg-red-500/90 hover:bg-red-600 border-0"
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor={`image-upload-${folder}`}
          className={`relative block w-full rounded-xl border-2 border-dashed border-white/20 
                     bg-white/[0.02] hover:bg-white/[0.05] hover:border-purple-500/40 
                     transition-all duration-300 cursor-pointer group
                     ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                     ${uploading ? "pointer-events-none" : ""}`}
          style={{
            aspectRatio: aspectRatio || "16/9",
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                <p className="text-sm font-medium text-gray-300">
                  Uploading...
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-300">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WebP up to {maxSizeMB}MB
                  </p>
                </div>
              </>
            )}
          </div>
          <input
            id={`image-upload-${folder}`}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={disabled || uploading}
            className="sr-only"
          />
        </label>
      )}
    </div>
  );
}
