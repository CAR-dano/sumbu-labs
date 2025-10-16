"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  category: string;
  image: string;
  slug?: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Handle mouse enter - set initial position di tengah card
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
    setIsHovered(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || !isHovered || isTouchDevice) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePosition({ x, y });
    };

    if (isHovered && !isTouchDevice) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHovered, isTouchDevice]);

  const calculateTilt = () => {
    if (!cardRef.current || !isHovered || isTouchDevice) return {};

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((mousePosition.y - centerY) / centerY) * -8;
    const tiltY = ((mousePosition.x - centerX) / centerX) * 8;

    return {
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px) scale(1.02)`,
    };
  };

  return (
    <Link
      href={project.slug ? `/projects/${project.slug}` : "#"}
      className="block"
    >
      <div
        ref={cardRef}
        className="project-card-wrapper"
        style={{
          animationDelay: `${index * 0.1}s`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Outer wrapper - holds border-radius + overflow, NO transform */}
        <div className="relative rounded-2xl overflow-hidden isolate [contain:paint] [background-clip:padding-box] bg-[#0A1320]">
          {/* Gradient Border Effect - static, not transformed */}
          <div
            className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(170, 106, 254, 0.15), transparent 40%)`,
            }}
          />

          {/* Inner layer - this one gets transformed */}
          <div
            className="relative rounded-2xl overflow-hidden will-change-transform [backface-visibility:hidden] [transform:translateZ(0)] transition-all duration-300 ease-out"
            style={calculateTilt()}
          >
            {/* Image Section */}
            <div className="relative w-full h-44 sm:h-48 md:h-52 bg-gradient-to-br from-[#6750A4] to-[#aa6afe] overflow-hidden rounded-t-2xl">
              {/* Project Image */}
              {project.image && !imageError ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover block [clip-path:inset(0_round_1rem_1rem_0_0)]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={() => {
                    console.error(`Failed to load image: ${project.image}`);
                    setImageError(true);
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/20 text-6xl font-bold font-roboto">
                    {project.title.charAt(0)}
                  </div>
                </div>
              )}

              {/* Overlay on hover - separate layer, no backdrop-filter on transformed element */}
              <div
                className={`absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="text-white font-roboto font-light text-sm px-4 py-2 border border-white/30 rounded-full backdrop-blur-sm bg-black/20">
                  View Project
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 sm:p-6 relative z-10">
              <h3 className="text-white font-roboto font-medium text-lg sm:text-xl mb-2 sm:mb-3 leading-tight line-clamp-2">
                {project.title}
              </h3>
              <p className="text-gray-300 font-roboto font-light text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 sm:px-3 py-1 text-xs font-roboto font-light text-[#debcff] bg-[#6750A4]/20 border border-[#6750A4]/40 rounded-full transition-all duration-300 hover:bg-[#6750A4]/30 hover:border-[#aa6afe]/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Subtle glow effect at bottom - static, not transformed */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#aa6afe] to-transparent transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

