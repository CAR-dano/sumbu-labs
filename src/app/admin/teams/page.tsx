"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Users,
  UserPlus,
  Edit,
  Eye,
  Power,
  PowerOff,
  Shield,
  User,
  Zap,
  UserCircle,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";

interface TeamLink {
  label: string;
  url: string;
  icon?: string;
  pinned?: boolean;
  order?: number;
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
  createdAt: string;
  updatedAt: string;
}

// Helper function to get icon component
const getLinkIcon = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    github: (
      <LucideIcons.Github className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
    linkedin: (
      <LucideIcons.Linkedin className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
    twitter: (
      <LucideIcons.Twitter className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
    youtube: (
      <LucideIcons.Youtube className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
    instagram: (
      <LucideIcons.Instagram className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
    facebook: (
      <LucideIcons.Facebook className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
    figma: (
      <LucideIcons.Figma className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
    globe: (
      <LucideIcons.Globe className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
    "file-text": (
      <LucideIcons.FileText className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
    "book-open": (
      <LucideIcons.BookOpen className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
    palette: (
      <LucideIcons.Palette className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
    dribbble: (
      <LucideIcons.Dribbble className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
    code: (
      <LucideIcons.Code className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
    "message-circle": (
      <LucideIcons.MessageCircle className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
    "message-square": (
      <LucideIcons.MessageSquare className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
    send: (
      <LucideIcons.Send className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
    music: (
      <LucideIcons.Music className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
    tv: (
      <LucideIcons.Tv className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
    "help-circle": (
      <LucideIcons.HelpCircle className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    ),
  };

  return iconMap[iconName] || iconMap.globe;
};

export default function AdminTeamsPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{
    category: string;
    id: string;
  } | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Helper function to get link icon component
  const getLinkIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      github: (
        <LucideIcons.Github className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
      linkedin: (
        <LucideIcons.Linkedin className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
      twitter: (
        <LucideIcons.Twitter className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
      youtube: (
        <LucideIcons.Youtube className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
      instagram: (
        <LucideIcons.Instagram className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
      facebook: (
        <LucideIcons.Facebook className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
      figma: (
        <LucideIcons.Figma className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
      "file-text": (
        <LucideIcons.FileText className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
      "book-open": (
        <LucideIcons.BookOpen className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
      palette: (
        <LucideIcons.Palette className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
      dribbble: (
        <LucideIcons.Dribbble className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
      code: (
        <LucideIcons.Code className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
      "message-circle": (
        <LucideIcons.MessageCircle className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
      "message-square": (
        <LucideIcons.MessageSquare className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
      send: (
        <LucideIcons.Send className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
      music: (
        <LucideIcons.Music className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
      tv: (
        <LucideIcons.Tv className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
      "help-circle": (
        <LucideIcons.HelpCircle className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
      globe: (
        <LucideIcons.Globe className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
      ),
    };

    return iconMap[iconName] || iconMap.globe;
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchMembers();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUser({ category: data.member.category, id: data.member.id });
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/teams");
      const data = await res.json();
      if (res.ok) {
        setMembers(data.members);
      } else {
        toast({
          title: "Error",
          description: "Failed to load team members",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMemberStatus = async (id: string, currentStatus: boolean) => {
    if (currentUser?.category !== "Core") {
      toast({
        title: "Permission Denied",
        description: "Only Core team members can change member status",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch(`/api/teams/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: `Member ${!currentStatus ? "activated" : "deactivated"}`,
        });
        fetchMembers();
      } else {
        toast({
          title: "Error",
          description: "Failed to update member status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-white/10 border-t-purple-500 rounded-full animate-spin" />
          <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-sm ring-1 ring-white/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide uppercase">
                TEAM MEMBERS
              </h1>
              <p className="text-white/50 text-sm font-light tracking-wider mt-1">
                Organization Control Panel
              </p>
            </div>
          </div>
          {currentUser?.category === "Core" && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => router.push("/admin/teams/new")}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-sm ring-1 ring-white/10 text-white hover:ring-purple-500/50 transition-all duration-300 rounded-xl px-6 py-6 shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Add Member
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Total Members */}
        <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm ring-1 ring-white/10 p-6 hover:bg-white/[0.07] transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <p className="text-white/50 text-sm font-light tracking-wider uppercase">
                Total Members
              </p>
              <p className="text-4xl font-bold text-white mt-1">
                {members.length}
              </p>
            </div>
          </div>
        </div>

        {/* Core Team */}
        <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm ring-1 ring-white/10 p-6 hover:bg-white/[0.07] transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-500/10 ring-1 ring-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <p className="text-white/50 text-sm font-light tracking-wider uppercase">
                Core Team
              </p>
              <p className="text-4xl font-bold text-white mt-1">
                {members.filter((m) => m.category === "Core").length}
              </p>
            </div>
          </div>
        </div>

        {/* Active Members */}
        <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm ring-1 ring-white/10 p-6 hover:bg-white/[0.07] transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-500/10 ring-1 ring-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Power className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <p className="text-white/50 text-sm font-light tracking-wider uppercase">
                Active
              </p>
              <p className="text-4xl font-bold text-white mt-1">
                {members.filter((m) => m.isActive).length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Members List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative rounded-2xl bg-white/5 backdrop-blur-sm ring-1 ring-white/10 overflow-hidden"
      >
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        <div className="p-6 space-y-4">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative overflow-visible"
            >
              <div className="relative rounded-xl bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm ring-1 ring-white/10 hover:ring-purple-500/30 p-5 transition-all duration-300 hover:scale-[1.01]">
                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-indigo-500/10 rounded-xl" />
                </div>

                <div className="relative flex items-center gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    {member.photoUrl ? (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden ring-2 ring-white/10 group-hover:ring-purple-500/50 transition-all duration-300">
                        <Image
                          src={member.photoUrl}
                          alt={member.fullName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 ring-2 ring-white/10 group-hover:ring-purple-500/50 flex items-center justify-center text-white font-bold text-xl transition-all duration-300">
                        {member.fullName.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {member.fullName}
                      </h3>
                      {member.nickname && (
                        <span className="text-sm text-white/50 font-light">
                          ({member.nickname})
                        </span>
                      )}
                    </div>
                    {member.slogan && (
                      <p className="text-sm text-white/40 italic mb-2 truncate">
                        &ldquo;{member.slogan}&rdquo;
                      </p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Role Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm text-xs font-medium text-white/90">
                        {member.role.name}
                      </span>

                      {/* Category Badge */}
                      {member.category === "Core" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 ring-1 ring-purple-500/30 backdrop-blur-sm text-xs font-medium text-purple-300">
                          <Shield className="w-3 h-3" />
                          Core
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm text-xs font-medium text-white/70">
                          <User className="w-3 h-3" />
                          Member
                        </span>
                      )}

                      {/* Status Badge */}
                      {member.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 ring-1 ring-green-500/30 backdrop-blur-sm text-xs font-medium text-green-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 ring-1 ring-red-500/30 backdrop-blur-sm text-xs font-medium text-red-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          Inactive
                        </span>
                      )}
                    </div>

                    {/* Skills */}
                    {member.skills && member.skills.length > 0 && (
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        {member.skills.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-md bg-white/5 ring-1 ring-white/10 text-xs text-white/60 font-light"
                          >
                            {skill}
                          </span>
                        ))}
                        {member.skills.length > 3 && (
                          <span className="px-2.5 py-1 rounded-md bg-white/5 ring-1 ring-white/10 text-xs text-white/60 font-light">
                            +{member.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Links */}
                  {member.links && member.links.length > 0 && (
                    <div className="flex items-center gap-2">
                      {member.links
                        .filter((link) => link.pinned)
                        .slice(0, 3)
                        .map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={link.label}
                            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-purple-500/20 ring-1 ring-white/10 hover:ring-purple-500/50 flex items-center justify-center transition-all duration-300 group/link"
                          >
                            {getLinkIcon(link.icon || "globe")}
                          </a>
                        ))}
                      {member.links.length > 3 && (
                        <span className="text-xs text-white/40">
                          +{member.links.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Everyone can only edit their OWN profile */}
                    {(() => {
                      const canEditSelf = currentUser?.id === member.id;

                      return (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            router.push(`/admin/teams/${member.id}`)
                          }
                          className={`w-10 h-10 rounded-lg ring-1 flex items-center justify-center transition-all duration-300 ${
                            canEditSelf
                              ? "bg-white/5 hover:bg-white/10 ring-white/10 hover:ring-purple-500/50"
                              : "bg-white/5 hover:bg-white/10 ring-white/10 hover:ring-blue-500/50"
                          }`}
                          title={canEditSelf ? "Edit Profile" : "View Profile"}
                        >
                          {canEditSelf ? (
                            <Edit className="w-4 h-4 text-white/70 group-hover:text-white" />
                          ) : (
                            <Eye className="w-4 h-4 text-white/70 group-hover:text-white" />
                          )}
                        </motion.button>
                      );
                    })()}
                    {/* Only Core members can toggle status */}
                    {currentUser?.category === "Core" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          toggleMemberStatus(member.id, member.isActive)
                        }
                        className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10 hover:ring-purple-500/50 flex items-center justify-center transition-all duration-300"
                        title={member.isActive ? "Deactivate" : "Activate"}
                      >
                        {member.isActive ? (
                          <PowerOff className="w-4 h-4 text-red-400" />
                        ) : (
                          <Power className="w-4 h-4 text-green-400" />
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
