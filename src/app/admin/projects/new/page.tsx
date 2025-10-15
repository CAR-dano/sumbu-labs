import ProjectForm from "@/components/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Project</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Fill in the details to create a new project
          </p>
        </div>
        <ProjectForm />
      </div>
    </div>
  );
}
