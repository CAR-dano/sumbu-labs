import { useState, useEffect, useCallback } from "react";

const DRAFT_KEY = "brief:draft:v1";
const SCHEMA_VERSION = 1;
const MAX_DRAFT_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAX_TEXT_LENGTH = 10000; // 10k chars per field

interface DraftData<T> {
  version: number;
  updatedAt: number;
  step: number;
  data: T;
  rememberDevice: boolean;
}

interface UseDraftStorageReturn<T> {
  read: () => DraftData<T> | null;
  write: (data: T, step: number) => void;
  clear: () => void;
  lastSaved: number | null;
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
}

// Truncate large text fields
function sanitizeData<T extends Record<string, unknown>>(data: T): T {
  const sanitized = { ...data };
  
  Object.keys(sanitized).forEach((key) => {
    const value = sanitized[key];
    
    if (typeof value === "string" && value.length > MAX_TEXT_LENGTH) {
      (sanitized as Record<string, unknown>)[key] = value.slice(0, MAX_TEXT_LENGTH);
    }
    
    // Remove file objects (only keep metadata if needed)
    if (value instanceof File || value instanceof Blob) {
      delete (sanitized as Record<string, unknown>)[key];
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      (sanitized as Record<string, unknown>)[key] = value.map((item) => {
        if (typeof item === "string" && item.length > MAX_TEXT_LENGTH) {
          return item.slice(0, MAX_TEXT_LENGTH);
        }
        if (item instanceof File || item instanceof Blob) {
          return null;
        }
        return item;
      }).filter(Boolean);
    }
  });
  
  return sanitized;
}

export function useDraftStorage<T extends Record<string, unknown>>(): UseDraftStorageReturn<T> {
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  // Load preference from localStorage
  useEffect(() => {
    try {
      const preference = localStorage.getItem("brief:remember-device");
      if (preference !== null) {
        setIsEnabled(preference === "true");
      }
    } catch (error) {
      console.error("Failed to load draft preference:", error);
    }
  }, []);

  // Save preference to localStorage
  const clear = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      setLastSaved(null);
    } catch (error) {
      console.error("Failed to clear draft:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("brief:remember-device", String(isEnabled));
      if (!isEnabled) {
        clear();
      }
    } catch (error) {
      console.error("Failed to save draft preference:", error);
    }
  }, [isEnabled, clear]);

  const read = useCallback((): DraftData<T> | null => {
    if (!isEnabled) return null;

    try {
      const stored = localStorage.getItem(DRAFT_KEY);
      if (!stored) return null;

      const draft: DraftData<T> = JSON.parse(stored);

      // Check schema version
      if (draft.version !== SCHEMA_VERSION) {
        console.warn("Draft schema version mismatch, clearing old draft");
        localStorage.removeItem(DRAFT_KEY);
        return null;
      }

      // Check expiry (30 days)
      const age = Date.now() - draft.updatedAt;
      if (age > MAX_DRAFT_AGE_MS) {
        console.info("Draft expired (>30 days), clearing");
        localStorage.removeItem(DRAFT_KEY);
        return null;
      }

      setLastSaved(draft.updatedAt);
      return draft;
    } catch (error) {
      console.error("Failed to read draft:", error);
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
  }, [isEnabled]);

  const write = useCallback(
    (data: T, step: number) => {
      if (!isEnabled) return;

      try {
        const sanitized = sanitizeData(data);
        const draft: DraftData<T> = {
          version: SCHEMA_VERSION,
          updatedAt: Date.now(),
          step,
          data: sanitized,
          rememberDevice: isEnabled,
        };

        const serialized = JSON.stringify(draft);
        
        // Check storage size (stay under 5MB for safety)
        if (serialized.length > 5 * 1024 * 1024) {
          console.warn("Draft too large, skipping save");
          return;
        }

        localStorage.setItem(DRAFT_KEY, serialized);
        setLastSaved(draft.updatedAt);
      } catch (error) {
        console.error("Failed to write draft:", error);
      }
    },
    [isEnabled]
  );

  return {
    read,
    write,
    clear,
    lastSaved,
    isEnabled,
    setIsEnabled,
  };
}

// Format timestamp for "Saved at 12:34"
export function formatSaveTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");

  return `${displayHours}:${displayMinutes} ${ampm}`;
}
