"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Upload,
  UserCircle,
  Shield,
  User as UserIcon,
  Key,
  Sparkles,
} from "lucide-react";
import LinksManager, { type TeamLink } from "@/components/admin/LinksManager";
import { motion } from "framer-motion";

interface Role {
  _id: string;
  name: string;
  description?: string;
}

export default function NewTeamMemberPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    role: "",
    category: "Member" as "Core" | "Member",
    skills: [] as string[],
    bio: "",
    photoUrl: "",
    slogan: "",
    links: [] as TeamLink[],
    pin: "",
    confirmPin: "",
  });
  const router = useRouter();
  const { toast } = useToast();

  const fetchRoles = useCallback(async () => {
    try {
      const res = await fetch("/api/roles");
      const data = await res.json();
      if (res.ok) {
        setRoles(data.roles);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load roles",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.role || !formData.pin) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.pin.length !== 6) {
      toast({
        title: "Validation Error",
        description: "PIN must be exactly 6 digits",
        variant: "destructive",
      });
      return;
    }

    if (formData.pin !== formData.confirmPin) {
      toast({
        title: "Validation Error",
        description: "PINs do not match",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d+$/.test(formData.pin)) {
      toast({
        title: "Validation Error",
        description: "PIN must contain only numbers",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          nickname: formData.nickname || undefined,
          role: formData.role,
          category: formData.category,
          skills: formData.skills,
          bio: formData.bio || undefined,
          photoUrl: formData.photoUrl || undefined,
          slogan: formData.slogan || undefined,
          links: formData.links || [],
          pin: formData.pin,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to create team member",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Team member created successfully",
      });

      router.push("/admin/teams");
    } catch {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[30%] left-[15%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse [animation-delay:1.5s]" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto mb-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm ring-1 ring-white/10 hover:ring-purple-500/50 flex items-center justify-center transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </motion.button>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 ring-1 ring-purple-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-medium text-purple-300 tracking-wider uppercase">
                Team Building
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Add Team Member
            </h1>
            <p className="text-white/50 text-sm font-light mt-1">
              Create a new team profile for dashboard access
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Form Container */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Avatar & Profile Section */}
        <div className="relative rounded-3xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-8 overflow-hidden group hover:bg-white/[0.06] transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-xs uppercase tracking-wider text-white/40 font-medium">
                Profile Picture
              </p>
              <div className="relative">
                {formData.photoUrl ? (
                  <div className="w-32 h-32 rounded-2xl overflow-hidden ring-2 ring-purple-500/50 group-hover:ring-purple-400/60 transition-all duration-300">
                    <Image
                      src={formData.photoUrl}
                      alt="Avatar"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 ring-2 ring-white/10 flex items-center justify-center group-hover:ring-purple-500/50 transition-all duration-300">
                    <UserCircle className="w-20 h-20 text-white/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
                  <Upload className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="photoUrl" className="text-white/70 text-xs">
                  Photo URL
                </Label>
                <Input
                  id="photoUrl"
                  value={formData.photoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, photoUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/40 font-medium mb-4">
                  Profile Details
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-white/70 text-sm flex items-center gap-2"
                    >
                      Full Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="John Doe"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nickname" className="text-white/70 text-sm">
                      Nickname (Display Name)
                    </Label>
                    <Input
                      id="nickname"
                      value={formData.nickname}
                      onChange={(e) =>
                        setFormData({ ...formData, nickname: e.target.value })
                      }
                      placeholder="John"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 h-11"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-white/40 font-medium mb-4">
                  Role & Access
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="role"
                      className="text-white/70 text-sm flex items-center gap-2"
                    >
                      Role <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 h-11">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1f2e] border-white/10">
                        {roles.map((role) => (
                          <SelectItem
                            key={role._id}
                            value={role._id}
                            className="text-white focus:bg-purple-500/20 focus:text-white"
                          >
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="text-white/70 text-sm flex items-center gap-2"
                    >
                      Category <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: "Core" | "Member") =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1f2e] border-white/10">
                        <SelectItem
                          value="Core"
                          className="text-white focus:bg-purple-500/20 focus:text-white"
                        >
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-purple-400" />
                            Core Team (Full Access)
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="Member"
                          className="text-white focus:bg-purple-500/20 focus:text-white"
                        >
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-blue-400" />
                            Member (Limited Access)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="relative rounded-3xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-8 overflow-hidden hover:bg-white/[0.06] transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-wider text-white/40 font-medium">
              Skills & Expertise
            </p>

            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Add a skill and press Enter"
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 h-11"
              />
              <motion.button
                type="button"
                onClick={addSkill}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 h-11 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 ring-1 ring-purple-500/50 text-purple-200 font-medium transition-all duration-300"
              >
                Add
              </motion.button>
            </div>

            {formData.skills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2"
              >
                {formData.skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 ring-1 ring-white/20 backdrop-blur-sm rounded-full text-sm text-white/90"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-400 transition-colors duration-200"
                    >
                      ×
                    </button>
                  </motion.span>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Bio & Slogan Section */}
        <div className="relative rounded-3xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-8 overflow-hidden hover:bg-white/[0.06] transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          <div className="space-y-6">
            <p className="text-xs uppercase tracking-wider text-white/40 font-medium">
              About & Tagline
            </p>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white/70 text-sm">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Write a short bio about yourself..."
                rows={4}
                className="resize-none bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
              />
              <p className="text-xs text-white/40">
                Markdown formatting is supported
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slogan" className="text-white/70 text-sm">
                Slogan / Tagline
              </Label>
              <Input
                id="slogan"
                value={formData.slogan}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 120) {
                    setFormData({ ...formData, slogan: value });
                  }
                }}
                placeholder="Your personal motto or tagline..."
                maxLength={120}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 h-11"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/40">
                  A short phrase that describes you
                </p>
                <p className="text-xs text-white/50 font-mono">
                  {formData.slogan.length}/120
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="relative rounded-3xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-8 overflow-hidden hover:bg-white/[0.06] transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/40 font-medium mb-1">
                External Links
              </p>
              <p className="text-sm text-white/50">
                Add your social media profiles and other links
              </p>
            </div>
            <LinksManager
              links={formData.links}
              onChange={(newLinks) =>
                setFormData({ ...formData, links: newLinks })
              }
              maxLinks={10}
            />
          </div>
        </div>

        {/* Security Section */}
        <div className="relative rounded-3xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-8 overflow-hidden hover:bg-white/[0.06] transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20 flex items-center justify-center">
                <Key className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-white/40 font-medium">
                  Security PIN
                </p>
                <p className="text-xs text-white/50">
                  6 digit authentication code
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="pin"
                  className="text-white/70 text-sm flex items-center gap-2"
                >
                  Create PIN <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="pin"
                  type="password"
                  value={formData.pin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 6) {
                      setFormData({ ...formData, pin: value });
                    }
                  }}
                  placeholder="••••••"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 h-11 font-mono text-center text-2xl tracking-widest"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPin"
                  className="text-white/70 text-sm flex items-center gap-2"
                >
                  Confirm PIN <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="confirmPin"
                  type="password"
                  value={formData.confirmPin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 6) {
                      setFormData({ ...formData, confirmPin: value });
                    }
                  }}
                  placeholder="••••••"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 h-11 font-mono text-center text-2xl tracking-widest"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="sticky bottom-0 -mx-6 -mb-6 px-8 py-6 bg-[#0b0f1a]/95 backdrop-blur-xl border-t border-white/10 flex items-center justify-end gap-4"
        >
          <motion.button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 h-11 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 text-white/70 hover:text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 h-11 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 ring-2 ring-purple-500/50 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create Member
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.form>
    </div>
  );
}
