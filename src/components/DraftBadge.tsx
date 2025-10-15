"use client";

import { formatSaveTime } from "@/hooks/use-draft-storage";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface DraftBadgeProps {
  status: SaveStatus;
  lastSaved: number | null;
  onSaveNow?: () => void;
  onDiscard?: () => void;
}

export default function DraftBadge({
  status,
  lastSaved,
  onSaveNow,
  onDiscard,
}: DraftBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't show if idle and no last save
  if (status === "idle" && !lastSaved) return null;

  const getStatusDisplay = () => {
    switch (status) {
      case "saving":
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-sm text-violet-300">Saving...</span>
          </div>
        );
      case "saved":
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-sm text-gray-300">
              {lastSaved ? `Saved ${formatSaveTime(lastSaved)}` : "Saved"}
            </span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-400" />
            <span className="text-sm text-red-300">Save failed</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gray-400" />
            <span className="text-sm text-gray-400">
              {lastSaved ? formatSaveTime(lastSaved) : "Out of date"}
            </span>
          </div>
        );
    }
  };

  return (
    <motion.div
      className="fixed top-6 right-6 z-40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div
        className="relative"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Glow effect when saving */}
        {status === "saving" && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-violet-500/30 blur-xl"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Main badge */}
        <div className="relative rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2.5">
          {getStatusDisplay()}
        </div>

        {/* Expanded actions */}
        <AnimatePresence>
          {isExpanded && (onSaveNow || onDiscard) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-48 rounded-lg bg-[#0b0f1a] backdrop-blur-xl border border-white/10 p-2 shadow-xl"
            >
              {onSaveNow && status !== "saving" && (
                <button
                  onClick={onSaveNow}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  💾 Save now
                </button>
              )}
              {onDiscard && (
                <button
                  onClick={onDiscard}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-red-500/10 text-sm text-gray-300 hover:text-red-400 transition-colors"
                >
                  🗑️ Discard draft
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
