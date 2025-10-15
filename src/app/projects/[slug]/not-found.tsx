import Link from "next/link";
import { Navigation } from "@/components/LandingPage/Navigation";
import Footer from "@/components/LandingPage/Footer";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0D1425] to-[#0A1320]">
      <Navigation />

      <div className="container mx-auto px-6 py-32 flex flex-col items-center justify-center text-center min-h-[70vh]">
        <div className="relative mb-8">
          <div className="text-[150px] md:text-[200px] font-roboto font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6750A4] to-[#aa6afe] leading-none">
            404
          </div>
          <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-[#6750A4] to-[#aa6afe]" />
        </div>

        <h1 className="text-3xl md:text-5xl font-roboto font-bold text-white mb-4">
          Project Not Found
        </h1>
        <p className="text-lg text-gray-400 font-roboto font-light mb-8 max-w-md">
          The project you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-[#aa6afe] hover:bg-[#8e4fd6] text-white font-roboto font-medium rounded-full px-8 transition-all duration-300 hover:scale-105"
          >
            <Link href="/projects" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Back to Projects
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 font-roboto font-light rounded-full px-8 transition-all duration-300 hover:scale-105"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
