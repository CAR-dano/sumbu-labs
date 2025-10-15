"use client";

import { useState } from "react";
import { Navigation } from "@/components/LandingPage/Navigation";
import Footer from "@/components/LandingPage/Footer";
import ProjectCard from "@/components/Projects/ProjectCard";
import FilterChips from "@/components/Projects/FilterChips";
import MetaBalls from "@/components/ReactBits/MetaBalls/MetaBalls";

// Project data
const projects = [
  {
    id: 1,
    title: "Kansei VR Product Design",
    description:
      "VR platform helping MSMEs ideate product concepts using emotional metrics and immersive visualization.",
    tags: ["UI/UX", "Research", "VR Development"],
    category: "design",
    image: "/assets/projects/kansei-vr.jpg", // placeholder
  },
  {
    id: 2,
    title: "Car-dano Blockchain Automotive",
    description:
      "Inspect and certify used cars using smart contracts with real-time PDF generation and blockchain verification.",
    tags: ["Development", "Blockchain", "Backend"],
    category: "development",
    image: "/assets/projects/car-dano.jpg",
  },
  {
    id: 3,
    title: "UMKM Geo Portal",
    description:
      "Interactive mapping platform for local tourism and MSMEs in Nusa Penida with real-time data visualization.",
    tags: ["UI/UX", "Development", "GIS"],
    category: "design",
    image: "/assets/projects/umkm-geo.jpg",
  },
  {
    id: 4,
    title: "Mental Health Assessment Platform",
    description:
      "Research-driven digital platform for mental health screening using validated psychological frameworks.",
    tags: ["Research", "UI/UX", "Healthcare"],
    category: "research",
    image: "/assets/projects/mental-health.jpg",
  },
  {
    id: 5,
    title: "Supply Chain Analytics Dashboard",
    description:
      "Real-time analytics dashboard for supply chain optimization with predictive insights and KPI tracking.",
    tags: ["Development", "Data Visualization", "Analytics"],
    category: "development",
    image: "/assets/projects/supply-chain.jpg",
  },
  {
    id: 6,
    title: "User Experience Research Framework",
    description:
      "Comprehensive UX research methodology toolkit for conducting and analyzing user behavior studies.",
    tags: ["Research", "UI/UX", "Documentation"],
    category: "research",
    image: "/assets/projects/ux-framework.jpg",
  },
];

const categories = [
  { id: "all", label: "All Projects" },
  { id: "design", label: "Design" },
  { id: "development", label: "Development" },
  { id: "research", label: "Research" },
];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <div className="min-h-screen bg-backgroundprimary relative overflow-hidden">
      <Navigation />

      {/* MetaBalls Background - Top Right */}
      <div className="absolute top-[100px] right-0 w-[500px] h-[500px] opacity-30 pointer-events-none z-0">
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
      <div className="absolute bottom-0 left-0 w-96 h-96 opacity-20 pointer-events-none z-0">
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
          <div className="text-center mb-16 animate-fade-in-scale">
            <h1 className="gradient-text mb-6">Our Projects</h1>
            <p className="hero-text max-w-3xl mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center py-16 px-4 animate-slide-in-up">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-roboto font-light text-white mb-6">
                Want to build something{" "}
                <span className="gradient-text inline-block">amazing</span> with
                us?
              </h2>
              <p className="text-gray-300 text-lg mb-8 font-roboto font-light">
                Let&apos;s align your vision with our expertise and create
                something extraordinary together.
              </p>
              <button
                onClick={() => {
                  document
                    .getElementById("footer")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-cta inline-flex"
              >
                Let&apos;s Work Together
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
