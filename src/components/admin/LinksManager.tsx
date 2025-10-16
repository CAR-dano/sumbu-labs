"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GripVertical,
  X,
  Plus,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Facebook,
  Figma,
  Globe,
  FileText,
  BookOpen,
  Palette,
  Dribbble,
  Code,
  MessageCircle,
  MessageSquare,
  Send,
  Music,
  Tv,
  HelpCircle,
  Star,
} from "lucide-react";

export interface TeamLink {
  label: string;
  url: string;
  icon?: string;
  pinned?: boolean;
  order?: number;
}

interface LinksManagerProps {
  links: TeamLink[];
  onChange: (links: TeamLink[]) => void;
  maxLinks?: number;
}

const iconOptions = [
  { value: "github", label: "GitHub", icon: Github },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "twitter", label: "X / Twitter", icon: Twitter },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "figma", label: "Figma", icon: Figma },
  { value: "file-text", label: "Notion", icon: FileText },
  { value: "book-open", label: "Medium / Blog", icon: BookOpen },
  { value: "palette", label: "Behance", icon: Palette },
  { value: "dribbble", label: "Dribbble", icon: Dribbble },
  { value: "code", label: "CodePen", icon: Code },
  { value: "message-circle", label: "Discord / Reddit", icon: MessageCircle },
  { value: "message-square", label: "WhatsApp", icon: MessageSquare },
  { value: "send", label: "Telegram", icon: Send },
  { value: "music", label: "TikTok", icon: Music },
  { value: "tv", label: "Twitch", icon: Tv },
  { value: "help-circle", label: "StackOverflow", icon: HelpCircle },
  { value: "globe", label: "Website / Other", icon: Globe },
];

export default function LinksManager({
  links,
  onChange,
  maxLinks = 10,
}: LinksManagerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addLink = () => {
    if (links.length >= maxLinks) return;

    const newLink: TeamLink = {
      label: "",
      url: "",
      icon: "globe",
      pinned: false,
      order: links.length,
    };

    onChange([...links, newLink]);
  };

  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    onChange(
      newLinks.map((link, i) => ({
        ...link,
        order: i,
      }))
    );
  };

  const updateLink = (
    index: number,
    field: keyof TeamLink,
    value: string | boolean
  ) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange(newLinks);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newLinks = [...links];
    const draggedLink = newLinks[draggedIndex];
    newLinks.splice(draggedIndex, 1);
    newLinks.splice(index, 0, draggedLink);

    // Update order
    const reorderedLinks = newLinks.map((link, i) => ({
      ...link,
      order: i,
    }));

    setDraggedIndex(index);
    onChange(reorderedLinks);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const getIconComponent = (iconValue: string) => {
    const option = iconOptions.find((opt) => opt.value === iconValue);
    return option ? option.icon : Globe;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-semibold text-white">
            External Links
          </Label>
          <p className="text-sm text-white/50 mt-1">
            Add your social media, portfolio, or any external links (max{" "}
            {maxLinks})
          </p>
        </div>
        <Badge variant="outline" className="border-white/20 text-white/70">
          {links.length} / {maxLinks}
        </Badge>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        {links.map((link, index) => {
          const IconComponent = getIconComponent(link.icon || "globe");

          return (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`group rounded-xl bg-white/5 backdrop-blur-sm ring-1 ring-white/10 p-4 transition-all ${
                draggedIndex === index ? "opacity-50" : ""
              } hover:ring-purple-500/40`}
            >
              <div className="flex items-start gap-3">
                {/* Drag Handle */}
                <div className="cursor-move pt-2 opacity-40 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-5 h-5 text-white/40" />
                </div>

                {/* Link Fields */}
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Icon Selector */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-white/50">Icon</Label>
                      <Select
                        value={link.icon || "globe"}
                        onValueChange={(value) =>
                          updateLink(index, "icon", value)
                        }
                      >
                        <SelectTrigger className="h-9 bg-white/5 border-white/10 text-white focus:ring-purple-500/40">
                          <SelectValue>
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4" />
                              <span className="text-sm">
                                {
                                  iconOptions.find(
                                    (opt) => opt.value === link.icon
                                  )?.label
                                }
                              </span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1f2e] border-white/10">
                          {iconOptions.map((option) => {
                            const OptionIcon = option.icon;
                            return (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="text-white focus:bg-purple-500/20 focus:text-white"
                              >
                                <div className="flex items-center gap-2">
                                  <OptionIcon className="w-4 h-4" />
                                  <span>{option.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Label */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-white/50">
                        Label <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        value={link.label}
                        onChange={(e) =>
                          updateLink(index, "label", e.target.value)
                        }
                        placeholder="e.g., My GitHub"
                        maxLength={40}
                        className="h-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:ring-purple-500/40"
                      />
                    </div>

                    {/* Pinned Toggle */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-white/50">Featured</Label>
                      <div className="flex items-center gap-2 h-9">
                        <Switch
                          checked={link.pinned || false}
                          onCheckedChange={(checked) =>
                            updateLink(index, "pinned", checked)
                          }
                        />
                        {link.pinned && (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* URL */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-white/50">
                      URL <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      value={link.url}
                      onChange={(e) => updateLink(index, "url", e.target.value)}
                      placeholder="https://..."
                      maxLength={300}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:ring-purple-500/40"
                    />
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="mt-2 w-9 h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 ring-1 ring-red-500/30 hover:ring-red-500/50 text-red-400 hover:text-red-300 transition-all duration-300 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Link Button */}
      {links.length < maxLinks && (
        <button
          type="button"
          onClick={addLink}
          className="w-full h-11 rounded-xl border-2 border-dashed border-white/20 hover:border-purple-500/50 bg-white/5 hover:bg-purple-500/10 text-white/70 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </button>
      )}

      {links.length >= maxLinks && (
        <p className="text-sm text-yellow-500 text-center">
          Maximum {maxLinks} links reached
        </p>
      )}
    </div>
  );
}
