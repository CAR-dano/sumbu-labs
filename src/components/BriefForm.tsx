"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useDraftStorage } from "@/hooks/use-draft-storage";
import { User, Briefcase, DollarSign, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import DraftRestoreDialog from "@/components/DraftRestoreDialog";
import DraftBadge from "@/components/DraftBadge";

const STEPS = [
  { id: 1, name: "About You", icon: User },
  { id: 2, name: "Project Details", icon: Briefcase },
  { id: 3, name: "Budget & Timeline", icon: DollarSign },
  { id: 4, name: "Final Details", icon: Shield },
];

const PROJECT_TYPES = [
  "Web Development",
  "Mobile App",
  "UI/UX Design",
  "Custom Software",
  "Blockchain",
  "AI/ML",
];

const BUDGET_OPTIONS = [
  { value: "under-5k", label: "Under $5,000" },
  { value: "5-10k", label: "$5,000 - $10,000" },
  { value: "10-25k", label: "$10,000 - $25,000" },
  { value: "25-50k", label: "$25,000 - $50,000" },
  { value: "50-100k", label: "$50,000 - $100,000" },
  { value: "100k-plus", label: "$100,000+" },
];

const TIMELINE_OPTIONS = [
  { value: "asap", label: "ASAP" },
  { value: "1-2 months", label: "1-2 Months" },
  { value: "3-6 months", label: "3-6 Months" },
  { value: "flexible", label: "Flexible" },
];

interface BriefFormData extends Record<string, unknown> {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  projectTitle: string;
  projectType: string[];
  goals: string;
  problems: string;
  budgetRange: string;
  timeline: string;
  ndaRequired: boolean;
  acceptPolicy: boolean;
  website: string; // honeypot
}

export default function BriefForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const { toast } = useToast();
  const router = useRouter();

  // Draft storage
  const draftStorage = useDraftStorage<BriefFormData>();
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<ReturnType<
    typeof draftStorage.read
  > | null>(null);

  const [formData, setFormData] = useState<BriefFormData>({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    projectTitle: "",
    projectType: [],
    goals: "",
    problems: "",
    budgetRange: "",
    timeline: "",
    ndaRequired: false,
    acceptPolicy: false,
    website: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof BriefFormData, string>>
  >({});

  // Check for draft on mount
  useEffect(() => {
    const draft = draftStorage.read();
    if (draft) {
      setPendingDraft(draft);
      setShowRestoreDialog(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save with debouncing
  useEffect(() => {
    if (!draftStorage.isEnabled) return;

    const timeoutId = setTimeout(() => {
      setSaveStatus("saving");
      draftStorage.write(formData, currentStep);
      setSaveStatus("saved");

      // Show brief toast
      toast({
        title: "Draft saved",
        description: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        duration: 2000,
      });
    }, 800); // 800ms debounce

    return () => clearTimeout(timeoutId);
  }, [formData, currentStep, draftStorage, toast]);

  const handleRestoreDraft = useCallback(() => {
    if (pendingDraft) {
      setFormData(pendingDraft.data);
      setCurrentStep(pendingDraft.step);
      setShowRestoreDialog(false);
      setPendingDraft(null);
      toast({
        title: "Draft restored",
        description: "Your previous work has been restored.",
      });
    }
  }, [pendingDraft, toast]);

  const handleDiscardDraft = useCallback(() => {
    draftStorage.clear();
    setShowRestoreDialog(false);
    setPendingDraft(null);
    toast({
      title: "Draft discarded",
      description: "Starting with a fresh form.",
    });
  }, [draftStorage, toast]);

  const handleSaveNow = useCallback(() => {
    setSaveStatus("saving");
    draftStorage.write(formData, currentStep);
    setSaveStatus("saved");
    toast({
      title: "Draft saved manually",
      description: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  }, [draftStorage, formData, currentStep, toast]);

  const updateField = (
    field: keyof BriefFormData,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleProjectType = (type: string) => {
    const current = formData.projectType;
    const newTypes = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    updateField("projectType", newTypes);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof BriefFormData, string>> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Invalid email";
    } else if (step === 2) {
      if (formData.projectType.length === 0)
        newErrors.projectType = "Select at least one project type";
      if (!formData.goals.trim() || formData.goals.trim().length < 5)
        newErrors.goals = "Please describe your goals (min 5 characters)";
    } else if (step === 3) {
      if (!formData.budgetRange)
        newErrors.budgetRange = "Budget range is required";
      if (!formData.timeline) newErrors.timeline = "Timeline is required";
    } else if (step === 4) {
      if (!formData.acceptPolicy)
        newErrors.acceptPolicy = "You must accept the privacy policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(4, prev + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(4)) return;

    // Honeypot check
    if (formData.website) {
      toast({
        title: "Error",
        description: "Invalid submission",
        variant: "destructive",
      });
      return;
    }

    // Time check
    const elapsed = Date.now() - startTime;
    if (elapsed < 3000) {
      toast({
        title: "Error",
        description: "Please take your time to fill the form",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/briefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Submission failed");
      }

      // Clear draft on success
      draftStorage.clear();

      toast({
        title: "Success!",
        description: "Your project brief has been submitted successfully.",
      });

      router.push(`/brief/success?id=${result.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to submit brief",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] relative">
      {/* Draft Restore Dialog */}
      <DraftRestoreDialog
        isOpen={showRestoreDialog}
        draftAge={pendingDraft?.updatedAt || Date.now()}
        onRestore={handleRestoreDraft}
        onDiscard={handleDiscardDraft}
      />

      {/* Draft Badge */}
      <DraftBadge
        status={saveStatus}
        lastSaved={draftStorage.lastSaved}
        onSaveNow={handleSaveNow}
        onDiscard={handleDiscardDraft}
      />

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:1.5s]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 md:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <Briefcase className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              Project Brief
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent">
            Start Your Project
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tell us about your vision. This should take about 5-10 minutes.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex-1 relative">
                  {index > 0 && (
                    <div
                      className={`absolute top-5 right-1/2 w-full h-0.5 -z-10 transition-all duration-500 ${
                        isCompleted ? "bg-purple-500" : "bg-white/10"
                      }`}
                    />
                  )}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-purple-500 scale-110 shadow-lg shadow-purple-500/50"
                          : isCompleted
                          ? "bg-purple-500/50"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <Icon
                          className={`w-5 h-5 ${
                            isActive ? "text-white" : "text-gray-500"
                          }`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium hidden md:block transition-colors duration-300 ${
                        isActive
                          ? "text-white"
                          : isCompleted
                          ? "text-purple-300"
                          : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Honeypot */}
          <input
            type="text"
            value={formData.website}
            onChange={(e) => updateField("website", e.target.value)}
            className="sr-only"
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Step 1: About You */}
          {currentStep === 1 && (
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  About You
                </h2>
                <p className="text-gray-400">
                  Let&apos;s start with your contact information
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-gray-300">
                    Full Name <span className="text-purple-400">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="John Doe"
                    className="mt-2 bg-white/[0.03] border-white/10 text-white focus:border-purple-500/40"
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300">
                    Email <span className="text-purple-400">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="john@example.com"
                    className="mt-2 bg-white/[0.03] border-white/10 text-white focus:border-purple-500/40"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="company" className="text-gray-300">
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => updateField("company", e.target.value)}
                    placeholder="Acme Inc."
                    className="mt-2 bg-white/[0.03] border-white/10 text-white focus:border-purple-500/40"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-300">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="mt-2 bg-white/[0.03] border-white/10 text-white focus:border-purple-500/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Project Details */}
          {currentStep === 2 && (
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Project Details
                </h2>
                <p className="text-gray-400">Tell us about your project</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="projectTitle" className="text-gray-300">
                    Project Title
                  </Label>
                  <Input
                    id="projectTitle"
                    value={formData.projectTitle}
                    onChange={(e) =>
                      updateField("projectTitle", e.target.value)
                    }
                    placeholder="E.g., E-commerce Platform"
                    className="mt-2 bg-white/[0.03] border-white/10 text-white focus:border-purple-500/40"
                  />
                </div>

                <div>
                  <Label className="text-gray-300 mb-3 block">
                    Project Type <span className="text-purple-400">*</span>
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {PROJECT_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleProjectType(type)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          formData.projectType.includes(type)
                            ? "border-purple-500/60 bg-purple-500/10"
                            : "border-white/10 bg-white/[0.02] hover:border-white/20"
                        }`}
                      >
                        <span className="text-sm font-medium text-gray-300">
                          {type}
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.projectType && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.projectType}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="goals" className="text-gray-300">
                    Goals <span className="text-purple-400">*</span>
                  </Label>
                  <Textarea
                    id="goals"
                    value={formData.goals}
                    onChange={(e) => updateField("goals", e.target.value)}
                    placeholder="What do you want to achieve with this project?"
                    rows={4}
                    className="mt-2 bg-white/[0.03] border-white/10 text-white focus:border-purple-500/40 resize-none"
                  />
                  {errors.goals && (
                    <p className="text-red-400 text-sm mt-1">{errors.goals}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="problems" className="text-gray-300">
                    Current Challenges
                  </Label>
                  <Textarea
                    id="problems"
                    value={formData.problems}
                    onChange={(e) => updateField("problems", e.target.value)}
                    placeholder="What problems are you trying to solve?"
                    rows={4}
                    className="mt-2 bg-white/[0.03] border-white/10 text-white focus:border-purple-500/40 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Budget & Timeline */}
          {currentStep === 3 && (
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Budget & Timeline
                </h2>
                <p className="text-gray-400">
                  Help us understand your constraints
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-gray-300 mb-3 block">
                    Budget Range <span className="text-purple-400">*</span>
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {BUDGET_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField("budgetRange", option.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          formData.budgetRange === option.value
                            ? "border-purple-500/60 bg-purple-500/10"
                            : "border-white/10 bg-white/[0.02] hover:border-white/20"
                        }`}
                      >
                        <span className="text-sm font-medium text-white">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.budgetRange && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.budgetRange}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-300 mb-3 block">
                    Timeline <span className="text-purple-400">*</span>
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {TIMELINE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField("timeline", option.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                          formData.timeline === option.value
                            ? "border-purple-500/60 bg-purple-500/10"
                            : "border-white/10 bg-white/[0.02] hover:border-white/20"
                        }`}
                      >
                        <span className="text-sm font-medium text-white">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.timeline && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.timeline}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Final Details */}
          {currentStep === 4 && (
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Final Details
                </h2>
                <p className="text-gray-400">Just a few more things</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <Switch
                    id="ndaRequired"
                    checked={formData.ndaRequired}
                    onCheckedChange={(checked) =>
                      updateField("ndaRequired", checked)
                    }
                    className="data-[state=checked]:bg-purple-500"
                  />
                  <Label
                    htmlFor="ndaRequired"
                    className="text-gray-300 cursor-pointer"
                  >
                    NDA Required
                  </Label>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <input
                    type="checkbox"
                    id="acceptPolicy"
                    checked={formData.acceptPolicy}
                    onChange={(e) =>
                      updateField("acceptPolicy", e.target.checked)
                    }
                    className="mt-1 w-5 h-5 rounded border-purple-500 bg-white/5 checked:bg-purple-500"
                  />
                  <Label
                    htmlFor="acceptPolicy"
                    className="text-gray-300 cursor-pointer"
                  >
                    I accept the privacy policy and terms of service{" "}
                    <span className="text-purple-400">*</span>
                  </Label>
                </div>
                {errors.acceptPolicy && (
                  <p className="text-red-400 text-sm">{errors.acceptPolicy}</p>
                )}

                {/* Remember Device Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex-1">
                    <Label className="text-gray-300 font-medium">
                      Remember this device
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Auto-save your progress as you type. Drafts expire after
                      30 days.
                    </p>
                  </div>
                  <Switch
                    checked={draftStorage.isEnabled}
                    onCheckedChange={draftStorage.setIsEnabled}
                    className="ml-4"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            {currentStep > 1 && (
              <Button
                type="button"
                onClick={prevStep}
                variant="outline"
                className="bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/[0.05]"
              >
                Previous
              </Button>
            )}

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="ml-auto bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={submitting}
                className="ml-auto bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Brief"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
