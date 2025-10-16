"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Grid3x3, FileText, Users, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  {
    name: "Projects",
    href: "/admin",
    icon: Grid3x3,
  },
  {
    name: "Briefs",
    href: "/admin/briefs",
    icon: FileText,
  },
  {
    name: "Teams",
    href: "/admin/teams",
    icon: Users,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "Logged out successfully",
        });
        router.push("/admin/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "error",
      });
    }
  };

  return (
    <>
      {/* Desktop Sidebar - Floating Rail */}
      <motion.nav
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        aria-label="Admin Navigation"
        className="hidden lg:fixed lg:left-6 lg:top-6 lg:z-40 lg:flex lg:h-[calc(100vh-3rem)] lg:w-20 lg:flex-col lg:items-center lg:justify-start lg:rounded-3xl lg:bg-white/5 lg:backdrop-blur-sm lg:ring-1 lg:ring-white/10 lg:shadow-[0_8px_40px_rgba(0,0,0,0.35)] lg:py-6"
      >
        {/* Gradient Glow Behind */}
        <div className="pointer-events-none absolute -z-10 inset-0 rounded-3xl">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col items-center gap-3 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="group relative w-full"
              >
                {/* Tooltip */}
                <div className="pointer-events-none absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                  <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-sm font-medium whitespace-nowrap ring-1 ring-white/20">
                    {item.name}
                  </div>
                </div>

                {/* Button */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`
                    flex h-14 w-full items-center justify-center rounded-2xl
                    transition-all duration-200
                    ${
                      active
                        ? "bg-white/10 ring-1 ring-white/15 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),0_10px_20px_-8px_rgba(124,58,237,0.35)]"
                        : "hover:bg-white/5 hover:ring-1 hover:ring-white/8"
                    }
                  `}
                >
                  {/* Active Indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 w-1 h-8 bg-gradient-to-b from-purple-400 to-indigo-400 rounded-r-full"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}

                  <Icon
                    className={`w-6 h-6 transition-colors duration-200 ${
                      active
                        ? "text-white"
                        : "text-gray-400 group-hover:text-gray-300"
                    }`}
                  />
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Logout Button - Bottom of Sidebar */}
        <div className="mt-auto w-full px-2">
          <button
            onClick={handleLogout}
            className="group relative w-full"
            title="Logout"
          >
            {/* Tooltip */}
            <div className="pointer-events-none absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-sm font-medium whitespace-nowrap ring-1 ring-white/20">
                Logout
              </div>
            </div>

            {/* Button */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex h-14 w-full items-center justify-center rounded-2xl transition-all duration-200 hover:bg-red-500/10 hover:ring-1 hover:ring-red-500/20"
            >
              <LogOut className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors duration-200" />
            </motion.div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Bottom Dock */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        aria-label="Admin Navigation"
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center gap-4 px-6 py-3 rounded-full bg-white/5 backdrop-blur-md ring-1 ring-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
      >
        {/* Gradient Glow Behind */}
        <div className="pointer-events-none absolute -z-10 inset-0 rounded-full">
          <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl" />
          <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl" />
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="group relative"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl
                  transition-all duration-200
                  ${
                    active
                      ? "bg-white/10 ring-1 ring-white/15"
                      : "hover:bg-white/5"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    active
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-300"
                  }`}
                />
                <span
                  className={`text-xs font-medium transition-colors duration-200 ${
                    active
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-300"
                  }`}
                >
                  {item.name}
                </span>
              </motion.div>
            </Link>
          );
        })}

        {/* Logout Button - Mobile */}
        <button onClick={handleLogout} className="group relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors duration-200" />
            <span className="text-xs font-medium text-red-400 group-hover:text-red-300 transition-colors duration-200">
              Logout
            </span>
          </motion.div>
        </button>
      </motion.nav>
    </>
  );
}

