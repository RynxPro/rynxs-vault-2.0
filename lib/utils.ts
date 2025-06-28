/**
 * Format a date string to a human-readable format
 * @param date - ISO date string
 * @returns Formatted date string
 */
export function formatDate(date: string): string {
  if (!date) return "Unknown date";
  
  try {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

/**
 * Format follower count with appropriate suffixes
 * @param number - Follower count
 * @returns Formatted follower count string
 */
export function formatFollowNumber(number: number | null | undefined): string {
  if (number == null || number < 0) return "0";
  return number.toLocaleString("en-US");
}

/**
 * Format view count with appropriate suffixes (K, M)
 * @param number - View count
 * @returns Formatted view count string
 */
export function formatViewNumber(number: number | null | undefined): string {
  if (number == null || number < 0) return "0";
  if (number < 1000) return number.toString();
  if (number < 10000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  if (number < 1000000) return Math.floor(number / 1000) + "K";
  return (number / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
}

/**
 * Combine class names with proper filtering
 * @param inputs - Class names to combine
 * @returns Combined class string
 */
export function cn(...inputs: (string | false | null | undefined)[]): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Safely parse server action response
 * @param response - Response to parse
 * @returns Parsed response
 */
export function parseServerActionResponse<T>(response: T): T {
  try {
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    console.error("Error parsing server action response:", error);
    return response;
  }
}

/**
 * Debounce function for performance optimization
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate a random ID
 * @param length - Length of the ID
 * @returns Random ID string
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
