"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideSidebar = pathname?.startsWith("/admin/login");

  return (
    <div className="min-h-screen bg-[#0b0f1a] relative">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:1.5s]" />
      </div>

      {/* Floating Sidebar - Only show on dashboard pages */}
      {!hideSidebar && <AdminSidebar />}

      {/* Main Content with Left Padding for Desktop */}
      <main
        className={
          hideSidebar ? "pb-24 lg:pb-0" : "lg:pl-[120px] pb-24 lg:pb-8"
        }
      >
        {children}
      </main>

      <Toaster />
    </div>
  );
}
