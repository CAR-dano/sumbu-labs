"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "@/components/LandingPage/Navigation";
import Footer from "@/components/LandingPage/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ExternalLink,
  Github,
  FileText,
  ChevronRight,
  X,
  ArrowLeft,
} from "lucide-react";
import { IProject } from "@/types/project";

interface ProjectDetailClientProps {
  project: IProject;
}

interface RelatedProject {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  coverImage?: {
    url: string;
  };
  tags: string[];
}

export default function ProjectDetailClient({
  project,
}: ProjectDetailClientProps) {
  const [scrollY, setScrollY] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<RelatedProject[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Fetch related projects based on category
    const fetchRelated = async () => {
      try {
        const category = project.categories[0] || "other";
        const res = await fetch(
          `/api/projects?status=published&category=${category}&limit=4`
        );
        if (res.ok) {
          const data = await res.json();
          // Filter out current project
          const filtered = data.projects.filter(
            (p: RelatedProject) => p._id !== project._id
          );
          setRelatedProjects(filtered.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch related projects:", error);
      }
    };

    fetchRelated();
  }, [project]);

  // Parallax effect
  const parallaxOffset = scrollY * 0.5;

  // Parse description sections
  const descriptionSections = parseDescription(project.description || "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0D1425] to-[#0A1320]">
      <Navigation />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-[70vh] min-h-[600px] overflow-hidden"
      >
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${parallaxOffset}px)`,
          }}
        >
          {project.coverImage?.url ? (
            <Image
              src={project.coverImage.url}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#6750A4] to-[#aa6afe]" />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0F1C]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-end pb-16 md:pb-20">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              asChild
              variant="ghost"
              className="text-white hover:text-[#aa6afe] hover:bg-white/5 font-roboto font-light -ml-4"
            >
              <Link href="/projects" className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back to Projects
              </Link>
            </Button>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-roboto font-light">
            <Link
              href="/projects"
              className="hover:text-[#aa6afe] transition-colors"
            >
              Projects
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{project.title}</span>
          </nav>

          {/* Title & Description */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-roboto font-bold text-white mb-6 leading-tight max-w-4xl">
            {project.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-roboto font-light leading-relaxed mb-8 max-w-3xl">
            {project.shortDescription}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            {project.links?.live && (
              <Button
                asChild
                size="lg"
                className="bg-[#aa6afe] hover:bg-[#8e4fd6] text-white font-roboto font-medium rounded-full px-8 transition-all duration-300 hover:scale-105"
              >
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  Visit Live
                </a>
              </Button>
            )}
            {project.links?.repo && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white font-roboto font-light rounded-full px-8 transition-all duration-300 hover:scale-105"
              >
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="w-5 h-5" />
                  View Repository
                </a>
              </Button>
            )}
            {project.links?.caseStudy && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white font-roboto font-light rounded-full px-8 transition-all duration-300 hover:scale-105"
              >
                <a
                  href={project.links.caseStudy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Case Study
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        {/* Meta / Overview Bar */}
        <section className="mb-16">
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-8 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Categories */}
              <div>
                <h3 className="text-gray-400 text-sm font-roboto font-light uppercase tracking-wider mb-3">
                  Category
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.categories.map((cat) => (
                    <Badge
                      key={cat}
                      className="bg-[#6750A4]/20 text-[#debcff] border border-[#6750A4]/40 hover:bg-[#6750A4]/30 font-roboto font-light px-3 py-1 rounded-full"
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Roles */}
              {project.roles && project.roles.length > 0 && (
                <div>
                  <h3 className="text-gray-400 text-sm font-roboto font-light uppercase tracking-wider mb-3">
                    Roles
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.roles.map((role) => (
                      <Badge
                        key={role}
                        variant="outline"
                        className="border-white/20 text-white font-roboto font-light px-3 py-1 rounded-full"
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Status/Year */}
              <div>
                <h3 className="text-gray-400 text-sm font-roboto font-light uppercase tracking-wider mb-3">
                  Status
                </h3>
                <Badge
                  className={`${
                    project.status === "published"
                      ? "bg-green-500/20 text-green-300 border border-green-500/40"
                      : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                  } font-roboto font-light px-3 py-1 rounded-full`}
                >
                  {project.status}
                </Badge>
                <p className="text-gray-300 text-sm font-roboto font-light mt-2">
                  {new Date(project.createdAt).getFullYear()}
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Tech Stack Section */}
        {project.tags && project.tags.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-white mb-8">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="bg-white/5 text-white border border-white/10 hover:bg-white/10 font-roboto font-light px-4 py-2 text-base rounded-xl transition-all duration-300 hover:scale-105"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Case Study Body */}
        {descriptionSections.length > 0 && (
          <section className="mb-16">
            <div className="space-y-12">
              {descriptionSections.map((section, idx) => (
                <Card
                  key={idx}
                  className="bg-white/5 backdrop-blur-lg border-white/10 p-8 md:p-10 rounded-2xl hover:bg-white/[0.07] transition-all duration-300"
                >
                  <h2 className="text-2xl md:text-3xl font-roboto font-bold text-white mb-4">
                    {section.title}
                  </h2>
                  <div className="text-gray-300 font-roboto font-light leading-relaxed space-y-4">
                    {section.content.split("\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Metrics Section */}
        {project.metrics && Object.keys(project.metrics).length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-white mb-8">
              Impact & Metrics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(project.metrics).map(([key, value]) => (
                <Card
                  key={key}
                  className="bg-gradient-to-br from-[#6750A4]/20 to-[#aa6afe]/20 backdrop-blur-lg border-[#aa6afe]/30 p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300"
                >
                  <p className="text-4xl md:text-5xl font-roboto font-bold text-[#aa6afe] mb-2">
                    {typeof value === "number" ? formatNumber(value) : value}
                  </p>
                  <p className="text-gray-300 font-roboto font-light text-sm capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-white mb-8">
              Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.gallery.map((image, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(image.url)}
                >
                  <Image
                    src={image.url}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ExternalLink className="w-8 h-8 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-white mb-8">
              Related Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((related) => (
                <Link
                  key={related._id}
                  href={`/projects/${related.slug}`}
                  className="group"
                >
                  <Card className="bg-white/5 backdrop-blur-lg border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.07] transition-all duration-300 hover:scale-105">
                    <div className="relative aspect-video">
                      {related.coverImage?.url ? (
                        <Image
                          src={related.coverImage.url}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#6750A4] to-[#aa6afe]" />
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-roboto font-medium text-white mb-2 group-hover:text-[#aa6afe] transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-gray-400 font-roboto font-light text-sm line-clamp-2">
                        {related.shortDescription}
                      </p>
                      {related.tags && related.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {related.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              className="bg-[#6750A4]/20 text-[#debcff] border border-[#6750A4]/40 font-roboto font-light text-xs px-2 py-1 rounded-full"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="text-center py-16">
          <Card className="bg-gradient-to-br from-[#6750A4]/20 to-[#aa6afe]/20 backdrop-blur-lg border-[#aa6afe]/30 p-12 md:p-16 rounded-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-roboto font-bold text-white mb-6">
              Interested in working with us?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 font-roboto font-light mb-8 max-w-2xl mx-auto">
              Let&apos;s create something amazing together. Get in touch to
              discuss your project.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#aa6afe] hover:bg-[#8e4fd6] text-white font-roboto font-medium rounded-full px-10 py-6 text-lg transition-all duration-300 hover:scale-105"
            >
              <Link href="/#contact">Start a Project</Link>
            </Button>
          </Card>
        </section>

        {/* See Other Projects Button */}
        <section className="text-center pb-8">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white font-roboto font-light rounded-full px-10 py-6 text-base transition-all duration-300 hover:scale-105"
          >
            <Link href="/projects" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              See Other Projects
            </Link>
          </Button>
        </section>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 rounded-full bg-black/50 hover:bg-black/70"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
            <Image
              src={selectedImage}
              alt="Full size view"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// Helper function to parse description into sections
function parseDescription(description: string) {
  const sections = [];
  const lines = description.split("\n");
  let currentSection: { title: string; content: string } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    // Check if line is a heading (starts with # or is ALL CAPS)
    if (
      trimmed.startsWith("#") ||
      (trimmed.length > 0 &&
        trimmed === trimmed.toUpperCase() &&
        trimmed.length < 50)
    ) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: trimmed.replace(/^#+\s*/, ""),
        content: "",
      };
    } else if (currentSection && trimmed) {
      currentSection.content += (currentSection.content ? "\n" : "") + trimmed;
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  // If no sections found, create default ones
  if (sections.length === 0 && description.trim()) {
    sections.push({
      title: "Overview",
      content: description,
    });
  }

  return sections;
}

// Helper function to format numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
