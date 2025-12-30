/**
 * Utility Functions
 *
 * Shared utility functions for the enterprise platform.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge
 * This is the standard utility from shadcn/ui
 *
 * @example
 * cn("px-2 py-1", isActive && "bg-blue-500", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Re-export ClassValue for convenience
export type { ClassValue };
