"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
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
  Edit3,
  Save,
  Plus,
  Key,
  UserCircle,
  Shield,
  User as UserIcon,
  ExternalLink,
  Sparkles,
  Upload,
} from "lucide-react";
import LinksManager, { type TeamLink } from "@/components/admin/LinksManager";
import { motion } from "framer-motion";

interface Role {
  _id: string;
  name: string;
}

interface TeamMember {
  id: string;
  fullName: string;
  nickname?: string;
  role: {
    id: string;
    name: string;
  };
  category: "Core" | "Member";
  skills?: string[];
  bio?: string;
  slogan?: string;
  photoUrl?: string;
  links?: TeamLink[];
  isActive: boolean;
}

export default function TeamMemberDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [roles, setRoles] = useState<Role[]>([]);
  const [member, setMember] = useState<TeamMember | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    category: string;
    id: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPinChange, setShowPinChange] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    role: "",
    category: "Member" as "Core" | "Member",
    skills: [] as string[],
    bio: "",
    slogan: "",
    photoUrl: "",
    links: [] as TeamLink[],
    newPin: "",
    confirmNewPin: "",
  });
  const router = useRouter();
  const { toast } = useToast();

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUser({ category: data.member.category, id: data.member.id });
      }
    } catch {
      console.error("Failed to fetch current user");
    }
  }, []);

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
        variant: "error",
      });
    }
  }, [toast]);

  const fetchMember = useCallback(async () => {
    try {
      const res = await fetch(`/api/teams/${id}`);
      const data = await res.json();

      if (res.ok) {
        setMember(data.member);
        setFormData({
          fullName: data.member.fullName,
          nickname: data.member.nickname || "",
          role: data.member.role.id,
          category: data.member.category,
          skills: data.member.skills || [],
          bio: data.member.bio || "",
          slogan: data.member.slogan || "",
          photoUrl: data.member.photoUrl || "",
          links: data.member.links || [],
          newPin: "",
          confirmNewPin: "",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load team member",
          variant: "error",
        });
        router.push("/admin/teams");
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "error",
      });
      router.push("/admin/teams");
    } finally {
      setLoading(false);
    }
  }, [id, router, toast]);

  useEffect(() => {
    fetchCurrentUser();
    fetchRoles();
    fetchMember();
  }, [fetchCurrentUser, fetchRoles, fetchMember]);

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

  // Permission logic:
  // - ALL users (including Core): Can ONLY edit their OWN profile
  // - Core members: Have additional privilege to toggle member status (in list page)
  // - If viewing another member's profile: VIEW ONLY (no edit button)
  const canEditSelf = currentUser?.id === id;
  const canEdit = canEditSelf;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Security check: Only allow if user has permission
    if (!canEdit) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit this member",
        variant: "error",
      });
      setIsEditMode(false); // Force exit edit mode
      return;
    }

    if (showPinChange) {
      if (formData.newPin.length !== 6) {
        toast({
          title: "Validation Error",
          description: "PIN must be exactly 6 digits",
          variant: "error",
        });
        return;
      }

      if (formData.newPin !== formData.confirmNewPin) {
        toast({
          title: "Validation Error",
          description: "PINs do not match",
          variant: "error",
        });
        return;
      }

      if (!/^\d+$/.test(formData.newPin)) {
        toast({
          title: "Validation Error",
          description: "PIN must contain only numbers",
          variant: "error",
        });
        return;
      }
    }

    setSaving(true);

    try {
      const updateData: Record<string, unknown> = {
        fullName: formData.fullName,
        nickname: formData.nickname || undefined,
        skills: formData.skills,
        bio: formData.bio || undefined,
        photoUrl: formData.photoUrl || undefined,
        slogan: formData.slogan || undefined,
        links: formData.links || [],
      };

      // Note: Role and Category cannot be changed by users
      // Only admins can change these via separate admin controls

      // Add PIN if changing
      if (showPinChange && formData.newPin) {
        updateData.pin = formData.newPin;
      }

      const res = await fetch(`/api/teams/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to update team member",
          variant: "error",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Team member updated successfully",
      });

      setIsEditMode(false);
      setShowPinChange(false);
      fetchMember();
    } catch {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin" />
          <div className="absolute inset-0 blur-xl bg-purple-500/20 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]">
        <div className="text-center">
          <p className="text-white/70 mb-4">Member not found</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/admin/teams")}
            className="px-6 py-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 ring-1 ring-purple-500/50 text-purple-200 font-medium transition-all duration-300"
          >
            Back to Teams
          </motion.button>
        </div>
      </div>
    );
  }

  // VIEW MODE
  if (!isEditMode) {
    return (
      <div className="min-h-screen p-6 bg-[#0b0f1a]">
        {/* Ambient Background */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[30%] left-[15%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse [animation-delay:1.5s]" />
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm ring-1 ring-white/10 hover:ring-purple-500/50 flex items-center justify-center transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </motion.button>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  Team Member Profile
                </h1>
                <p className="text-white/50 text-sm font-light mt-1">
                  View member information
                </p>
              </div>
            </div>

            {canEdit && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditMode(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 ring-2 ring-purple-500/50 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300 flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </motion.button>
            )}

            {!canEdit && (
              <div className="px-4 py-2 rounded-xl bg-white/5 ring-1 ring-white/10 text-white/50 text-sm flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                View Only
              </div>
            )}
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative rounded-3xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-8 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                {member.photoUrl ? (
                  <div className="w-40 h-40 rounded-2xl overflow-hidden ring-4 ring-purple-500/30">
                    <Image
                      src={member.photoUrl}
                      alt={member.fullName}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 ring-4 ring-white/10 flex items-center justify-center">
                    <UserCircle className="w-24 h-24 text-white/30" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 ring-1 ring-white/10">
                  {member.isActive ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm text-green-400 font-medium">
                        Active
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-sm text-red-400 font-medium">
                        Inactive
                      </span>
                    </>
                  )}
                </div>

                {/* Category Badge */}
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    member.category === "Core"
                      ? "bg-purple-500/10 ring-1 ring-purple-500/30"
                      : "bg-blue-500/10 ring-1 ring-blue-500/30"
                  }`}
                >
                  {member.category === "Core" ? (
                    <>
                      <Shield className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-purple-300 font-medium">
                        Core Team
                      </span>
                    </>
                  ) : (
                    <>
                      <UserIcon className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-blue-300 font-medium">
                        Member
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Name & Role */}
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">
                    {member.fullName}
                  </h2>
                  {member.nickname && (
                    <p className="text-lg text-white/50 mb-3">
                      @{member.nickname}
                    </p>
                  )}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 ring-1 ring-indigo-500/30">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-sm text-indigo-300 font-medium">
                      {member.role.name}
                    </span>
                  </div>
                </div>

                {/* Slogan */}
                {member.slogan && (
                  <div className="px-4 py-3 rounded-xl bg-white/5 border-l-4 border-purple-500/50">
                    <p className="text-white/70 italic">
                      &ldquo;{member.slogan}&rdquo;
                    </p>
                  </div>
                )}

                {/* Bio */}
                {member.bio && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40 font-medium mb-2">
                      About
                    </p>
                    <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                      {member.bio}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {member.skills && member.skills.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40 font-medium mb-3">
                      Skills & Expertise
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, index) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="px-3 py-1.5 bg-white/10 ring-1 ring-white/20 backdrop-blur-sm rounded-full text-sm text-white/90"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                {member.links && member.links.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40 font-medium mb-3">
                      Links
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {member.links.map((link, index) => (
                        <motion.a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 ring-1 ring-white/10 hover:ring-purple-500/50 rounded-xl transition-all duration-300 group"
                        >
                          <ExternalLink className="w-4 h-4 text-white/50 group-hover:text-purple-400 transition-colors" />
                          <span className="text-sm text-white/70 group-hover:text-white">
                            {link.label}
                          </span>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // EDIT MODE
  // Security guard: Redirect to view mode if no permission
  if (isEditMode && !canEdit) {
    // Use useEffect to avoid state update during render
    setTimeout(() => {
      setIsEditMode(false);
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit this profile",
        variant: "error",
      });
    }, 0);
    return null; // Return nothing while redirecting
  }

  if (isEditMode) {
    return (
      <div className="min-h-screen p-6 bg-[#0b0f1a]">
        {/* Ambient Background */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[30%] left-[15%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse [animation-delay:1.5s]" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsEditMode(false);
                setShowPinChange(false);
                fetchMember();
              }}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm ring-1 ring-white/10 hover:ring-purple-500/50 flex items-center justify-center transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-white/70" />
            </motion.button>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 ring-1 ring-purple-500/20 mb-2">
                <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-medium text-purple-300 tracking-wider uppercase">
                  Edit Mode
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Edit Profile
              </h1>
              <p className="text-white/50 text-sm font-light mt-1">
                Update member information
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="max-w-5xl mx-auto space-y-6 pb-32"
        >
          {/* Avatar & Profile Section */}
          <div className="relative rounded-3xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-8 overflow-hidden hover:bg-white/[0.06] transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-4">
                <p className="text-xs uppercase tracking-wider text-white/40 font-medium">
                  Profile Picture
                </p>
                <div className="relative group">
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
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
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
                      <Label
                        htmlFor="nickname"
                        className="text-white/70 text-sm"
                      >
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
                        disabled={true}
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
                      <p className="text-xs text-white/40">
                        Role is managed by system administrators
                      </p>
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
                        disabled={true}
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
                      <p className="text-xs text-white/40">
                        Category is managed by system administrators
                      </p>
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
                  className="px-6 h-11 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 ring-1 ring-purple-500/50 text-purple-200 font-medium transition-all duration-300 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20 flex items-center justify-center">
                    <Key className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40 font-medium">
                      Security PIN
                    </p>
                    <p className="text-xs text-white/50">
                      Change your 6-digit authentication code
                    </p>
                  </div>
                </div>

                {!showPinChange && (
                  <motion.button
                    type="button"
                    onClick={() => setShowPinChange(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 text-white/70 hover:text-white text-sm font-medium transition-all duration-300"
                  >
                    Change PIN
                  </motion.button>
                )}
              </div>

              {showPinChange && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 pt-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="newPin"
                        className="text-white/70 text-sm flex items-center gap-2"
                      >
                        New PIN <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="newPin"
                        type="password"
                        value={formData.newPin}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 6) {
                            setFormData({ ...formData, newPin: value });
                          }
                        }}
                        placeholder="••••••"
                        maxLength={6}
                        pattern="[0-9]{6}"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 h-11 font-mono text-center text-2xl tracking-widest"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmNewPin"
                        className="text-white/70 text-sm flex items-center gap-2"
                      >
                        Confirm New PIN <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="confirmNewPin"
                        type="password"
                        value={formData.confirmNewPin}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 6) {
                            setFormData({ ...formData, confirmNewPin: value });
                          }
                        }}
                        placeholder="••••••"
                        maxLength={6}
                        pattern="[0-9]{6}"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 h-11 font-mono text-center text-2xl tracking-widest"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowPinChange(false);
                      setFormData({
                        ...formData,
                        newPin: "",
                        confirmNewPin: "",
                      });
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 text-white/70 hover:text-white text-sm font-medium transition-all duration-300"
                  >
                    Cancel PIN Change
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sticky Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="fixed bottom-0 left-0 right-0 px-8 py-6 bg-[#0b0f1a]/95 backdrop-blur-xl border-t border-white/10 flex items-center justify-end gap-4"
          >
            <motion.button
              type="button"
              onClick={() => {
                setIsEditMode(false);
                setShowPinChange(false);
                fetchMember();
              }}
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 h-11 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 text-white/70 hover:text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 h-11 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 ring-2 ring-purple-500/50 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    );
  }
}
