"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import { useToast } from "@/hooks/use-toast";
import { IProject } from "@/types/project";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Star,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Layers,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "published"
  >("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });

      if (search) params.append("q", search);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const res = await fetch(`/api/projects?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setProjects(data.projects);
      setTotalPages(data.pagination.totalPages);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });

      fetchProjects();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "error",
      });
    }
  };

  const toggleFeatured = async (project: IProject) => {
    try {
      const res = await fetch(`/api/projects/${String(project._id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !project.featured }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast({
        title: "Success",
        description: `Project ${
          project.featured ? "unfeatured" : "featured"
        } successfully`,
      });

      fetchProjects();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-gray-400 font-roboto font-light">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <LayoutGrid className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-roboto font-bold text-white tracking-tight">
                Projects Dashboard
              </h1>
              <p className="text-gray-400 text-sm font-roboto font-light mt-1">
                Manage and organize your portfolio projects
              </p>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                placeholder="Search projects by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-11 bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 rounded-xl font-roboto font-light focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Status Filter Pills */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-xl font-roboto font-light text-sm transition-all duration-300 ${
                  statusFilter === "all"
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                    : "bg-white/[0.03] text-gray-400 hover:bg-white/[0.05] border border-white/10"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("published")}
                className={`px-4 py-2 rounded-xl font-roboto font-light text-sm transition-all duration-300 flex items-center gap-2 ${
                  statusFilter === "published"
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                    : "bg-white/[0.03] text-gray-400 hover:bg-white/[0.05] border border-white/10"
                }`}
              >
                <Eye className="w-4 h-4" />
                Published
              </button>
              <button
                onClick={() => setStatusFilter("draft")}
                className={`px-4 py-2 rounded-xl font-roboto font-light text-sm transition-all duration-300 flex items-center gap-2 ${
                  statusFilter === "draft"
                    ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/25"
                    : "bg-white/[0.03] text-gray-400 hover:bg-white/[0.05] border border-white/10"
                }`}
              >
                <EyeOff className="w-4 h-4" />
                Draft
              </button>
            </div>

            {/* New Project Button */}
            <Link href="/admin/projects/new">
              <Button className="h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-roboto font-medium rounded-xl px-6 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                New Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-400 font-roboto font-medium">
                    Image
                  </TableHead>
                  <TableHead className="text-gray-400 font-roboto font-medium">
                    Title
                  </TableHead>
                  <TableHead className="text-gray-400 font-roboto font-medium">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-400 font-roboto font-medium">
                    Tags
                  </TableHead>
                  <TableHead className="text-gray-400 font-roboto font-medium">
                    Categories
                  </TableHead>
                  <TableHead className="text-gray-400 font-roboto font-medium text-center">
                    Order
                  </TableHead>
                  <TableHead className="text-gray-400 font-roboto font-medium text-center">
                    Featured
                  </TableHead>
                  <TableHead className="text-gray-400 font-roboto font-medium">
                    Updated
                  </TableHead>
                  <TableHead className="text-gray-400 font-roboto font-medium text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow className="hover:bg-transparent border-white/10">
                    <TableCell colSpan={9} className="text-center py-16">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                          <LayoutGrid className="w-8 h-8 text-purple-400" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-gray-400 font-roboto font-medium text-lg">
                            No projects yet
                          </p>
                          <p className="text-gray-600 font-roboto font-light text-sm">
                            Create your first project to get started
                          </p>
                        </div>
                        <Link href="/admin/projects/new">
                          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-roboto font-medium rounded-xl px-6">
                            <Plus className="w-5 h-5 mr-2" />
                            Create Project
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project, index) => (
                    <TableRow
                      key={String(project._id)}
                      className="border-white/10 hover:bg-white/[0.02] transition-colors duration-200 group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell>
                        {project.coverImage ? (
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-purple-500/50 transition-all duration-300">
                            <Image
                              src={project.coverImage.url}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 ring-1 ring-white/10 flex items-center justify-center">
                            <span className="text-2xl text-purple-400 font-roboto font-bold">
                              {project.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="font-roboto font-medium text-white group-hover:text-purple-400 transition-colors duration-200">
                          {project.title}
                        </p>
                        <p className="text-xs text-gray-600 font-roboto font-light mt-1">
                          {project.slug}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            project.status === "published"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          } font-roboto font-light border rounded-full px-3`}
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1.5 flex-wrap max-w-xs">
                          {project.tags.slice(0, 2).map((tag, i) => (
                            <Badge
                              key={i}
                              className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-roboto font-light text-xs rounded-lg px-2 py-0.5"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 2 && (
                            <Badge className="bg-white/5 text-gray-400 border-white/10 font-roboto font-light text-xs rounded-lg px-2 py-0.5">
                              +{project.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1.5 flex-wrap max-w-xs">
                          {(project.categories || [])
                            .slice(0, 2)
                            .map((cat, i) => (
                              <Badge
                                key={i}
                                className="bg-purple-500/10 text-purple-400 border-purple-500/20 font-roboto font-light text-xs rounded-lg px-2 py-0.5"
                              >
                                {cat}
                              </Badge>
                            ))}
                          {(project.categories || []).length > 2 && (
                            <Badge className="bg-white/5 text-gray-400 border-white/10 font-roboto font-light text-xs rounded-lg px-2 py-0.5">
                              +{(project.categories || []).length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-white font-roboto font-medium">
                          {project.order}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => toggleFeatured(project)}
                          className="group/star p-2 hover:bg-white/5 rounded-lg transition-all duration-200"
                        >
                          <Star
                            className={`w-5 h-5 transition-all duration-300 ${
                              project.featured
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-600 group-hover/star:text-yellow-400"
                            }`}
                          />
                        </button>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-400 font-roboto font-light text-sm">
                          {new Date(project.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() =>
                              router.push(
                                `/admin/projects/${String(project._id)}`
                              )
                            }
                            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors duration-200 group/edit"
                          >
                            <Edit3 className="w-4 h-4 text-purple-400 group-hover/edit:scale-110 transition-transform duration-200" />
                          </button>
                          <button
                            onClick={() => handleDelete(String(project._id))}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors duration-200 group/delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400 group-hover/delete:scale-110 transition-transform duration-200" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <p className="text-sm text-gray-400 font-roboto font-light">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-white/[0.03] border border-white/10 text-gray-400 hover:bg-white/[0.05] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg bg-white/[0.03] border border-white/10 text-gray-400 hover:bg-white/[0.05] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

