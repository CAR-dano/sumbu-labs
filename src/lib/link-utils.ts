import type { TeamLink } from "@/models/TeamMember";

/**
 * Sanitize URL: enforce https://, block dangerous schemes
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();

  // Block dangerous schemes
  const dangerousSchemes = ["javascript:", "data:", "vbscript:", "file:"];
  for (const scheme of dangerousSchemes) {
    if (trimmed.toLowerCase().startsWith(scheme)) {
      throw new Error(`Dangerous URL scheme not allowed: ${scheme}`);
    }
  }

  // Ensure https://
  if (!trimmed.startsWith("https://") && !trimmed.startsWith("http://")) {
    return `https://${trimmed}`;
  }

  // Convert http:// to https://
  if (trimmed.startsWith("http://")) {
    return trimmed.replace("http://", "https://");
  }

  return trimmed;
}

/**
 * Infer icon from URL domain
 */
export function inferIcon(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Remove www. prefix
    const domain = hostname.replace(/^www\./, "");

    // Icon mapping
    if (domain.includes("github.com")) return "github";
    if (domain.includes("linkedin.com")) return "linkedin";
    if (domain.includes("x.com") || domain.includes("twitter.com"))
      return "twitter";
    if (domain.includes("notion.so")) return "file-text";
    if (domain.includes("behance.net")) return "palette";
    if (domain.includes("dribbble.com")) return "dribbble";
    if (
      domain.includes("youtube.com") ||
      domain.includes("youtu.be") ||
      domain.includes("youtube")
    )
      return "youtube";
    if (domain.includes("medium.com")) return "book-open";
    if (domain.includes("instagram.com")) return "instagram";
    if (domain.includes("facebook.com")) return "facebook";
    if (domain.includes("tiktok.com")) return "music";
    if (domain.includes("discord")) return "message-circle";
    if (domain.includes("telegram")) return "send";
    if (domain.includes("whatsapp")) return "message-square";
    if (domain.includes("figma.com")) return "figma";
    if (domain.includes("codepen.io")) return "code";
    if (domain.includes("stackoverflow.com")) return "help-circle";
    if (domain.includes("reddit.com")) return "message-circle";
    if (domain.includes("twitch.tv")) return "tv";

    // Default
    return "globe";
  } catch {
    return "globe";
  }
}

/**
 * Validate a single link
 */
export function validateLink(link: Partial<TeamLink>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate label
  if (!link.label || link.label.trim().length === 0) {
    errors.push("Link label is required");
  } else if (link.label.length > 40) {
    errors.push("Link label must be 40 characters or less");
  }

  // Validate URL
  if (!link.url || link.url.trim().length === 0) {
    errors.push("Link URL is required");
  } else {
    try {
      const sanitized = sanitizeUrl(link.url);
      if (sanitized.length > 300) {
        errors.push("Link URL must be 300 characters or less");
      }
      // Validate URL format
      new URL(sanitized);
    } catch (error) {
      if (error instanceof Error) {
        errors.push(error.message);
      } else {
        errors.push("Invalid URL format");
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate slogan
 */
export function validateSlogan(slogan: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (slogan && slogan.length > 0) {
    if (slogan.length < 2) {
      errors.push("Slogan must be at least 2 characters");
    }
    if (slogan.length > 120) {
      errors.push("Slogan must be 120 characters or less");
    }
    // Check for HTML tags
    if (/<[^>]*>/g.test(slogan)) {
      errors.push("Slogan cannot contain HTML tags");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Process links array: sanitize URLs, infer icons if not set, ensure order
 */
export function processLinks(links: Partial<TeamLink>[]): TeamLink[] {
  return links
    .map((link, index) => {
      const sanitizedUrl = sanitizeUrl(link.url || "");
      const icon = link.icon || inferIcon(sanitizedUrl);

      return {
        label: (link.label || "").trim().slice(0, 40),
        url: sanitizedUrl.slice(0, 300),
        icon,
        pinned: link.pinned || false,
        order: link.order !== undefined ? link.order : index,
      };
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Strip HTML tags from string
 */
export function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "").trim();
}
