import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge class names; resolves Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalize a link's `rel` for its `target`. Any `target="_blank"` link always
 * gets `noopener noreferrer` (tab-nabbing / referrer-leak protection) merged
 * with whatever `rel` the data supplies (e.g. `nofollow`).
 */
export function safeRel(target?: string, rel?: string): string | undefined {
  const parts = new Set((rel ?? "").split(/\s+/).filter(Boolean));
  if (target === "_blank") {
    parts.add("noopener");
    parts.add("noreferrer");
  }
  return parts.size ? [...parts].join(" ") : undefined;
}
