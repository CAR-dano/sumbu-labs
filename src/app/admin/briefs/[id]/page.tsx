"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  Clock,
  FileText,
  Globe,
  Shield,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Brief {
  _id: string;
  fullName: string;
  company?: string;
  email: string;
  phone?: string;
  projectTitle?: string;
  projectType: string[];
  goals?: string;
  problems?: string;
  scopeFeatures?: string[];
  platforms?: string[];
  integrations?: string[];
  references?: Array<{ url: string; description?: string }>;
  budgetRange?: string;
  timeline?: string;
  startDateTarget?: string;
  locationTimezone?: string;
  ndaRequired: boolean;
  acceptPolicy: boolean;
  status: "new" | "reviewing" | "responded" | "archived";
  starred: boolean;
  internalNotes?: string;
  ua?: string;
  ipHash?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_OPTIONS = ["new", "reviewing", "responded", "archived"];

const STATUS_COLORS = {
  new: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  reviewing: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  responded: "bg-green-500/20 text-green-300 border-green-500/30",
  archived: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

const BUDGET_LABELS: Record<string, string> = {
  "under-5k": "Under $5,000",
  "5-10k": "$5,000 - $10,000",
  "10-25k": "$10,000 - $25,000",
  "25-50k": "$25,000 - $50,000",
  "50-100k": "$50,000 - $100,000",
  "100k-plus": "$100,000+",
};

export default function BriefDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<string>("");
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    fetchBrief();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.id]);

  const fetchBrief = async () => {
    try {
      const res = await fetch(`/api/briefs/${resolvedParams.id}`);
      if (!res.ok) throw new Error("Failed to fetch brief");

      const data = await res.json();
      setBrief(data);
      setNotes(data.internalNotes || "");
      setStatus(data.status);
      setStarred(data.starred);
    } catch (error) {
      console.error("Error fetching brief:", error);
      toast({
        title: "Error",
        description: "Failed to load brief",
        variant: "destructive",
      });
      router.push("/admin/briefs");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/briefs/${resolvedParams.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          starred,
          internalNotes: notes,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast({
        title: "Success",
        description: "Brief updated successfully",
      });
      fetchBrief();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update brief",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this brief?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/briefs/${resolvedParams.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast({
        title: "Success",
        description: "Brief deleted successfully",
      });
      router.push("/admin/briefs");
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete brief",
        variant: "destructive",
      });
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!brief) {
    return null;
  }

  return (
    <div className="relative">
      <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            className="text-gray-400 hover:text-white mb-4"
          >
            <Link href="/admin/briefs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Briefs
            </Link>
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {brief.projectTitle || "Untitled Project"}
              </h1>
              <p className="text-gray-400">
                Submitted on {new Date(brief.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setStarred(!starred)}
                variant="outline"
                className={`${
                  starred
                    ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-300"
                    : "bg-white/[0.03] border-white/10 text-gray-300"
                }`}
              >
                <Star className={`w-4 h-4 ${starred ? "fill-current" : ""}`} />
              </Button>
              <Button
                onClick={() => (window.location.href = `mailto:${brief.email}`)}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Mail className="w-4 h-4 mr-2" />
                Reply
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <a
                      href={`mailto:${brief.email}`}
                      className="text-white hover:text-purple-400 transition-colors"
                    >
                      {brief.email}
                    </a>
                  </div>
                </div>

                {brief.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-400 text-sm">Phone</p>
                      <p className="text-white">{brief.phone}</p>
                    </div>
                  </div>
                )}

                {brief.company && (
                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-400 text-sm">Company</p>
                      <p className="text-white">{brief.company}</p>
                    </div>
                  </div>
                )}

                {brief.locationTimezone && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-400 text-sm">Location</p>
                      <p className="text-white">{brief.locationTimezone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Project Details
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Project Types</p>
                  <div className="flex flex-wrap gap-2">
                    {brief.projectType.map((type) => (
                      <Badge
                        key={type}
                        className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {brief.goals && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Goals</p>
                    <p className="text-white whitespace-pre-wrap">
                      {brief.goals}
                    </p>
                  </div>
                )}

                {brief.problems && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">
                      Current Challenges
                    </p>
                    <p className="text-white whitespace-pre-wrap">
                      {brief.problems}
                    </p>
                  </div>
                )}

                {brief.scopeFeatures && brief.scopeFeatures.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Features</p>
                    <ul className="list-disc list-inside space-y-1">
                      {brief.scopeFeatures.map((feature, i) => (
                        <li key={i} className="text-white">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {brief.platforms && brief.platforms.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Platforms</p>
                    <div className="flex flex-wrap gap-2">
                      {brief.platforms.map((platform) => (
                        <Badge
                          key={platform}
                          variant="outline"
                          className="bg-purple-500/10 text-purple-300 border-purple-500/30"
                        >
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {brief.integrations && brief.integrations.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Integrations</p>
                    <div className="flex flex-wrap gap-2">
                      {brief.integrations.map((integration) => (
                        <Badge
                          key={integration}
                          variant="outline"
                          className="bg-green-500/10 text-green-300 border-green-500/30"
                        >
                          {integration}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {brief.references && brief.references.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">References</p>
                    <div className="space-y-2">
                      {brief.references.map((ref, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Globe className="w-4 h-4 text-gray-400 mt-1" />
                          <div>
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300 break-all"
                            >
                              {ref.url}
                            </a>
                            {ref.description && (
                              <p className="text-gray-400 text-sm">
                                {ref.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Budget & Timeline */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Budget & Timeline
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {brief.budgetRange && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-gray-400 text-sm">Budget Range</p>
                      <p className="text-white font-medium">
                        {BUDGET_LABELS[brief.budgetRange] || brief.budgetRange}
                      </p>
                    </div>
                  </div>
                )}

                {brief.timeline && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-gray-400 text-sm">Timeline</p>
                      <p className="text-white font-medium">{brief.timeline}</p>
                    </div>
                  </div>
                )}

                {brief.startDateTarget && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <p className="text-gray-400 text-sm">Start Date</p>
                      <p className="text-white font-medium">
                        {new Date(brief.startDateTarget).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {brief.ndaRequired && (
                <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <Shield className="w-5 h-5 text-yellow-400" />
                  <p className="text-yellow-300 text-sm font-medium">
                    NDA Required
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 mb-4"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
              <Badge
                className={`${
                  STATUS_COLORS[status as keyof typeof STATUS_COLORS]
                } w-full justify-center`}
              >
                {status}
              </Badge>
            </div>

            {/* Internal Notes */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Internal Notes
              </h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add private notes about this submission..."
                rows={6}
                className="bg-white/[0.03] border-white/10 text-white resize-none"
              />
            </div>

            {/* Actions */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updating ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={deleting}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {deleting ? "Deleting..." : "Delete Brief"}
                </Button>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Metadata
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-400">Submitted</p>
                  <p className="text-white">
                    {new Date(brief.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Last Updated</p>
                  <p className="text-white">
                    {new Date(brief.updatedAt).toLocaleString()}
                  </p>
                </div>
                {brief.ipHash && (
                  <div>
                    <p className="text-gray-400">IP Hash</p>
                    <p className="text-white font-mono text-xs">
                      {brief.ipHash}
                    </p>
                  </div>
                )}
                {brief.ua && (
                  <div>
                    <p className="text-gray-400">User Agent</p>
                    <p className="text-white text-xs break-all">{brief.ua}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
