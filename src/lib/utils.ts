/**
 * UTILITY FUNCTIONS FOR SAROS DLMM ANALYTICS
 * 
 * Collection of utility functions used throughout the application for:
 * - CSS class management and styling
 * - Token amount calculations and conversions
 * - Data transformation and formatting
 * 
 * These utilities ensure consistent behavior across components and
 * provide reusable functionality for common operations.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * CLASS NAME UTILITY
 * 
 * Combines and merges CSS classes using clsx and tailwind-merge.
 * This utility ensures proper Tailwind CSS class precedence and
 * handles conditional styling throughout the application.
 * 
 * @param inputs - Array of class values (strings, objects, conditionals)
 * @returns Merged and optimized class string
 * 
 * @example
 * ```typescript
 * const classes = cn(
 *   'base-class',
 *   condition && 'conditional-class',
 *   { 'object-class': isActive }
 * );
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * NUMBER FORMATTING UTILITY
 * 
 * Formats numbers into human-readable strings with appropriate suffixes.
 * Handles large numbers by converting them to K, M notation for better UX.
 * 
 * @param value - The number or string to format
 * @returns Formatted string representation
 */
export const formatNumber = (value: string | number): string => {
  const num = Number(value);
  if (!isFinite(num)) return "N/A";

  const abs = Math.abs(num);
  if (abs >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
};

/**
 * TOKEN AMOUNT CALCULATOR
 * 
 * Converts raw blockchain token amounts to human-readable decimal format.
 * Handles the conversion from blockchain's integer representation to
 * decimal format based on token's decimal configuration.
 * 
 * @param amount - Raw token amount from blockchain (integer)
 * @param decimals - Number of decimal places for the token
 * @returns Human-readable decimal amount
 * 
 * @example
 * ```typescript
 * // Convert 1,000,000 raw USDC (6 decimals) to 1.0 USDC
 * const readableAmount = calculateTokenAmount(1000000, 6); // Returns 1.0
 * 
 * // Convert 1,000,000,000 raw SOL (9 decimals) to 1.0 SOL
 * const solAmount = calculateTokenAmount(1000000000, 9); // Returns 1.0
 * ```
 */
export function calculateTokenAmount(amount: number, decimals: number): number {
  return amount / Math.pow(10, decimals);
}
