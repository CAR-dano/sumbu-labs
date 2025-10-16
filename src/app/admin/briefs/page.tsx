"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Star,
  Download,
  Search,
  Mail,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Brief {
  _id: string;
  fullName: string;
  company?: string;
  email: string;
  projectTitle?: string;
  projectType: string[];
  budgetRange?: string;
  timeline?: string;
  status: "new" | "reviewing" | "responded" | "archived";
  starred: boolean;
  createdAt: string;
}

const STATUS_COLORS = {
  new: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  reviewing: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  responded: "bg-green-500/20 text-green-300 border-green-500/30",
  archived: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

const BUDGET_LABELS: Record<string, string> = {
  "under-5k": "< $5k",
  "5-10k": "$5-10k",
  "10-25k": "$10-25k",
  "25-50k": "$25-50k",
  "50-100k": "$50-100k",
  "100k-plus": "$100k+",
};

export default function AdminBriefsPage() {
  const router = useRouter();
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [starredFilter, setStarredFilter] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchBriefs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, search, statusFilter, starredFilter]);

  const fetchBriefs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search) params.append("q", search);
      if (statusFilter) params.append("status", statusFilter);
      if (starredFilter) params.append("starred", "true");

      const res = await fetch(`/api/briefs?${params}`);
      if (!res.ok) throw new Error("Failed to fetch briefs");

      const data = await res.json();
      setBriefs(data.briefs);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching briefs:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStar = async (id: string, currentStarred: boolean) => {
    try {
      const res = await fetch(`/api/briefs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ starred: !currentStarred }),
      });

      if (res.ok) {
        fetchBriefs();
      }
    } catch (error) {
      console.error("Error toggling star:", error);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("q", search);
      if (statusFilter) params.append("status", statusFilter);
      if (starredFilter) params.append("starred", "true");

      const res = await fetch(`/api/briefs/export?${params}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `briefs-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting:", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
              <FileText className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">
                Project Briefs
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Brief Submissions
            </h1>
          </div>

          <Button
            onClick={handleExport}
            disabled={exporting}
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Download className="w-4 h-4 mr-2" />
            {exporting ? "Exporting..." : "Export CSV"}
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  placeholder="Search by name, email, company..."
                  className="pl-10 bg-white/[0.03] border-white/10 text-white"
                />
              </div>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="w-full px-4 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="responded">Responded</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <Button
                onClick={() => {
                  setStarredFilter(!starredFilter);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                variant={starredFilter ? "default" : "outline"}
                className={`w-full ${
                  starredFilter
                    ? "bg-purple-500 hover:bg-purple-600"
                    : "bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/[0.05]"
                }`}
              >
                <Star className="w-4 h-4 mr-2" />
                {starredFilter ? "Starred Only" : "All Briefs"}
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">Loading...</div>
            </div>
          ) : briefs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <FileText className="w-12 h-12 text-gray-600 mb-4" />
              <p className="text-gray-400 mb-2">No briefs found</p>
              <p className="text-gray-500 text-sm mb-4">
                Share the brief link to start receiving submissions
              </p>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/brief`
                  );
                }}
                variant="outline"
                className="bg-white/[0.03] border-white/10 text-gray-300"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Copy Brief Link
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-gray-400">Star</TableHead>
                    <TableHead className="text-gray-400">Contact</TableHead>
                    <TableHead className="text-gray-400">Project</TableHead>
                    <TableHead className="text-gray-400">Budget</TableHead>
                    <TableHead className="text-gray-400">Timeline</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {briefs.map((brief) => (
                    <TableRow
                      key={brief._id}
                      className="border-white/10 hover:bg-white/[0.02] cursor-pointer"
                      onClick={() => router.push(`/admin/briefs/${brief._id}`)}
                    >
                      <TableCell>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(brief._id, brief.starred);
                          }}
                          className="text-gray-400 hover:text-yellow-400 transition-colors"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              brief.starred
                                ? "fill-yellow-400 text-yellow-400"
                                : ""
                            }`}
                          />
                        </button>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-white font-medium">
                            {brief.fullName}
                          </p>
                          <p className="text-gray-400 text-sm">{brief.email}</p>
                          {brief.company && (
                            <p className="text-gray-500 text-xs">
                              {brief.company}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {brief.projectTitle && (
                            <p className="text-white font-medium mb-1">
                              {brief.projectTitle}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {brief.projectType.slice(0, 2).map((type) => (
                              <Badge
                                key={type}
                                variant="outline"
                                className="text-xs bg-indigo-500/10 text-indigo-300 border-indigo-500/30"
                              >
                                {type}
                              </Badge>
                            ))}
                            {brief.projectType.length > 2 && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-gray-500/10 text-gray-400 border-gray-500/30"
                              >
                                +{brief.projectType.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-gray-300 text-sm">
                          {brief.budgetRange
                            ? BUDGET_LABELS[brief.budgetRange] ||
                              brief.budgetRange
                            : "-"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-gray-300 text-sm">
                          {brief.timeline || "-"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_COLORS[brief.status]}>
                          {brief.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-gray-400 text-sm">
                          {new Date(brief.createdAt).toLocaleDateString()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `mailto:${brief.email}`;
                          }}
                          className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                  <p className="text-gray-400 text-sm">
                    Page {pagination.page} of {pagination.totalPages} (
                    {pagination.total} total)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pagination.page === 1}
                      onClick={() =>
                        setPagination((p) => ({ ...p, page: p.page - 1 }))
                      }
                      className="bg-white/[0.03] border-white/10 text-gray-300 disabled:opacity-30"
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() =>
                        setPagination((p) => ({ ...p, page: p.page + 1 }))
                      }
                      className="bg-white/[0.03] border-white/10 text-gray-300 disabled:opacity-30"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

