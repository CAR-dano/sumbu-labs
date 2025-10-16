"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/LandingPage/Navigation";
import Footer from "@/components/LandingPage/Footer";
import ProjectCard from "@/components/Projects/ProjectCard";
import FilterChips from "@/components/Projects/FilterChips";
import MetaBalls from "@/components/ReactBits/MetaBalls/MetaBalls";

interface ApiProject {
  _id: string;
  title: string;
  shortDescription: string;
  tags: string[];
  categories: string[];
  coverImage?: {
    url: string;
  };
  slug: string;
}

interface UiProject {
  id: number;
  title: string;
  description: string;
  tags: string[];
  categories: string[];
  category: string;
  image: string;
  slug: string;
}

const categories = [
  { id: "all", label: "All Projects" },
  { id: "software development", label: "Software Development" },
  { id: "ui/ux design", label: "UI/UX Design" },
  { id: "artificial intelligent", label: "Artificial Intelligent" },
  { id: "blockchain", label: "Blockchain" },
  { id: "other", label: "Other" },
];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [projects, setProjects] = useState<UiProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          "/api/projects?status=published&sort=order&order=asc&limit=100"
        );
        if (res.ok) {
          const data = await res.json();

          // Transform API projects to UI format
          const uiProjects: UiProject[] = data.projects.map(
            (project: ApiProject, index: number) => {
              return {
                id: index + 1,
                title: project.title,
                description: project.shortDescription,
                tags: project.tags,
                categories: project.categories || ["other"],
                category: (project.categories || ["other"])[0],
                image:
                  project.coverImage?.url || "/assets/projects/placeholder.jpg",
                slug: project.slug,
              };
            }
          );

          setProjects(uiProjects);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) =>
          project.categories.includes(selectedCategory)
        );

  return (
    <div className="min-h-screen bg-backgroundprimary relative overflow-hidden">
      <Navigation />

      {/* MetaBalls Background - Top Right */}
      <div className="absolute top-[100px] right-0 w-full sm:w-[500px] h-[300px] sm:h-[500px] opacity-20 sm:opacity-30 pointer-events-none z-0">
        <MetaBalls
          color="#aa6afe"
          cursorBallColor="#debcff"
          cursorBallSize={2}
          ballCount={20}
          animationSize={25}
          enableMouseInteraction={true}
          enableTransparency={true}
          hoverSmoothness={0.15}
          clumpFactor={1.1}
          speed={0.3}
        />
      </div>

      {/* MetaBalls Background - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-full sm:w-96 h-64 sm:h-96 opacity-15 sm:opacity-20 pointer-events-none z-0">
        <MetaBalls
          color="#debcff"
          cursorBallColor="#aa6afe"
          cursorBallSize={2}
          ballCount={15}
          animationSize={20}
          enableMouseInteraction={true}
          enableTransparency={true}
          hoverSmoothness={0.15}
          clumpFactor={1.1}
          speed={0.4}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-scale">
            <h1 className="gradient-text mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl">
              Our Projects
            </h1>
            <p className="hero-text max-w-3xl mx-auto text-base sm:text-lg">
              We craft{" "}
              <span className="highlight">
                research-driven digital products
              </span>{" "}
              that blend innovative design, robust development, and
              human-centered thinking. From immersive VR experiences to
              blockchain solutions, each project reflects our commitment to{" "}
              <span className="highlight">excellence</span> and{" "}
              <span className="highlight">impact</span>.
            </p>
          </div>

          {/* Filter Section */}
          <FilterChips
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
            {loading ? (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-400 text-lg">Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-400 text-lg">No projects found.</p>
              </div>
            ) : (
              filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))
            )}
          </div>

          {/* CTA Section */}
          <div className="text-center py-12 sm:py-16 px-4 animate-slide-in-up">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-roboto font-light text-white mb-4 sm:mb-6">
                Want to build something{" "}
                <span className="gradient-text inline-block">amazing</span> with
                us?
              </h2>
              <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 font-roboto font-light">
                Let&apos;s align your vision with our expertise and create
                something extraordinary together.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    document
                      .getElementById("footer")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn-cta text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
                >
                  Let&apos;s Work Together
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
