export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

// Security helpers for Brief Submissions
export function hashIP(ip: string): string {
  // Simple hash function for IP (for rate limiting)
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

export function sanitizeString(str: string): string {
  // Remove HTML tags and trim
  return str.replace(/<[^>]*>/g, "").trim();
}

export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export function formatBudgetRange(range: string): string {
  const ranges: Record<string, string> = {
    "under-5k": "Under $5,000",
    "5-10k": "$5,000 - $10,000",
    "10-25k": "$10,000 - $25,000",
    "25-50k": "$25,000 - $50,000",
    "50-100k": "$50,000 - $100,000",
    "100k-plus": "$100,000+",
  };
  return ranges[range] || range;
}

export function formatTimeline(timeline: string): string {
  const timelines: Record<string, string> = {
    asap: "ASAP",
    "1-2 months": "1-2 Months",
    "3-6 months": "3-6 Months",
    flexible: "Flexible",
  };
  return timelines[timeline] || timeline;
}
