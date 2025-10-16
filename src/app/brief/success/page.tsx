"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Mail, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) {
      router.push("/brief");
    } else {
      setSubmissionId(id);
      localStorage.removeItem("briefDraft");
    }
  }, [searchParams, router]);

  if (!submissionId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] relative flex items-center justify-center px-6 py-12">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[10%] left-[15%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:1.5s]" />
      </div>

      <div className="relative max-w-2xl w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
            <CheckCircle className="w-20 h-20 text-green-400 relative" />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12 text-center space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent">
              Thank You!
            </h1>
            <p className="text-gray-400 text-lg">
              Your project brief has been submitted successfully.
            </p>
          </div>

          {/* Submission ID */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">Submission ID</p>
            <p className="text-white font-mono text-sm">{submissionId}</p>
          </div>

          {/* What's Next */}
          <div className="space-y-4 text-left">
            <h2 className="text-xl font-semibold text-white text-center">
              What Happens Next?
            </h2>

            <div className="space-y-3">
              <div className="flex gap-4 items-start p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">
                    Email Confirmation
                  </h3>
                  <p className="text-gray-400 text-sm">
                    You&apos;ll receive a confirmation email within a few
                    minutes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">
                    Review Process
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Our team will review your brief within 24-48 hours.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">
                    Initial Response
                  </h3>
                  <p className="text-gray-400 text-sm">
                    We&apos;ll reach out to discuss your project in more detail.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              asChild
              className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              <Link href="/">
                Back to Home
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/[0.05]"
            >
              <Link href="/projects">View Our Work</Link>
            </Button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Need immediate assistance?{" "}
          <a
            href="mailto:hello@sumbulabs.com"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Contact us directly
          </a>
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

