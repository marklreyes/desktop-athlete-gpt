import DOMPurify from "dompurify";

/**
 * Sanitizes user input using DOMPurify to prevent XSS attacks
 *
 * @param input - The user input string to sanitize
 * @returns A sanitized version of the input
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";

  // Trim whitespace
  let sanitized = input.trim();

  // Configure DOMPurify
  const purifyConfig = {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "div", "span", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target", "rel", "data-*", "class", "id"],
    ALLOW_DATA_ATTR: true,
    FORBID_TAGS: ["script", "style", "iframe", "form", "object", "embed", "input"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
    ADD_URI_SAFE_ATTR: ["target"],
    SANITIZE_DOM: true,
    USE_PROFILES: { html: true },
    // This ensures javascript:, data:, etc. URLs are removed
    FORBID_PROTOCOLS: ["javascript", "data", "vbscript", "file"]
  };

  // Apply DOMPurify sanitization
  sanitized = DOMPurify.sanitize(sanitized, purifyConfig);

  // Return sanitized input
  return sanitized;
}
