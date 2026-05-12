import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combine multiple class value inputs into a single Tailwind-aware class string.
 *
 * @param inputs - Class values (strings, arrays, or conditional objects) to combine
 * @returns A single space-separated class string with conflicting Tailwind classes resolved and merged
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
