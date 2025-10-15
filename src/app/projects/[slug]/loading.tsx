import { Navigation } from "@/components/LandingPage/Navigation";
import Footer from "@/components/LandingPage/Footer";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0D1425] to-[#0A1320]">
      <Navigation />

      {/* Hero Skeleton */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6750A4]/20 to-[#aa6afe]/20 animate-pulse" />
        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-end pb-16 md:pb-20">
          {/* Breadcrumb skeleton */}
          <div className="h-4 w-40 bg-white/10 rounded mb-6 animate-pulse" />

          {/* Title skeleton */}
          <div className="space-y-4 mb-6">
            <div className="h-12 w-3/4 bg-white/10 rounded animate-pulse" />
            <div className="h-12 w-1/2 bg-white/10 rounded animate-pulse" />
          </div>

          {/* Description skeleton */}
          <div className="space-y-2 mb-8 max-w-3xl">
            <div className="h-6 w-full bg-white/10 rounded animate-pulse" />
            <div className="h-6 w-4/5 bg-white/10 rounded animate-pulse" />
          </div>

          {/* Buttons skeleton */}
          <div className="flex gap-4">
            <div className="h-12 w-32 bg-[#aa6afe]/30 rounded-full animate-pulse" />
            <div className="h-12 w-40 bg-white/10 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <div className="container mx-auto px-6 py-16">
        {/* Meta Bar Skeleton */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-8 rounded-2xl mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-4 w-20 bg-white/10 rounded mb-3 animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-8 w-24 bg-white/10 rounded-full animate-pulse" />
                  <div className="h-8 w-28 bg-white/10 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tech Stack Skeleton */}
        <div className="mb-16">
          <div className="h-10 w-48 bg-white/10 rounded mb-8 animate-pulse" />
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-10 w-24 bg-white/10 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Content Cards Skeleton */}
        <div className="space-y-12 mb-16">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="bg-white/5 backdrop-blur-lg border-white/10 p-8 md:p-10 rounded-2xl"
            >
              <div className="h-8 w-48 bg-white/10 rounded mb-4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
