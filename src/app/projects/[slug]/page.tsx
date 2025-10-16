import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  try {
    // Server-side: use internal URL (localhost:PORT)
    // Client-side: use NEXT_PUBLIC_BASE_URL
    const isServer = typeof window === "undefined";
    const port = process.env.PORT || "3000";
    const baseUrl = isServer
      ? `http://localhost:${port}`
      : process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${port}`;

    const res = await fetch(`${baseUrl}/api/projects-by-slug/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch project ${slug}: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Sumbu Labs`,
    description: project.shortDescription || project.description,
    openGraph: {
      title: project.title,
      description: project.shortDescription || project.description,
      images: project.coverImage?.url
        ? [
            {
              url: project.coverImage.url,
              width: project.coverImage.width || 1200,
              height: project.coverImage.height || 630,
              alt: project.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.shortDescription || project.description,
      images: project.coverImage?.url ? [project.coverImage.url] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project || project.status !== "published") {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
