import ProjectForm from "@/components/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-[#0b0f1a]">
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-sm font-medium text-purple-300">
              Project Creation
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent">
            Create New Project
          </h1>
          <p className="text-gray-400 text-lg">
            Fill in the details to showcase your work in the portfolio
          </p>
        </div>
        <ProjectForm />
      </div>
    </div>
  );
}
