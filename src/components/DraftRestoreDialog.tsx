"use client";

import { formatSaveTime } from "@/hooks/use-draft-storage";
import { motion, AnimatePresence } from "framer-motion";

interface DraftRestoreDialogProps {
  isOpen: boolean;
  draftAge: number; // timestamp
  onRestore: () => void;
  onDiscard: () => void;
}

export default function DraftRestoreDialog({
  isOpen,
  draftAge,
  onRestore,
  onDiscard,
}: DraftRestoreDialogProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onDiscard}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="mx-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-transparent p-[1px]">
              <div className="rounded-2xl bg-[#0b0f1a] backdrop-blur-xl p-6 space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Draft Found
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400 ml-[52px]">
                    We found a saved draft from {formatSaveTime(draftAge)}. Would
                    you like to continue where you left off?
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onDiscard}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-medium transition-all"
                  >
                    Start Fresh
                  </button>
                  <button
                    onClick={onRestore}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Restore Draft
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
