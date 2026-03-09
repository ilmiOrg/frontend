/**
 * Merges class names. Supports strings and undefined/null.
 * Used by UI components (e.g. sparkles) for conditional styling.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
