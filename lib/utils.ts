import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getElapsedTime(createdAt?: string) {
  if (!createdAt) return null;
  const start = new Date(createdAt);
  const now = new Date();
  const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function getSourceBubbleClass(source: string) {
  const s = source.toLowerCase();
  if (s.includes("arxiv")) {
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-700";
  }
  if (s.includes("semantic scholar")) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700";
  }
  if (s.includes("scopus")) {
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700";
  }
  if (s.includes("springer")) {
    return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-700";
  }
  if (s.includes("ieee")) {
    return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-700";
  }
  if (s.includes("acm")) {
    return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-700";
  }
  // Default
  return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600";
}

export function getSourceHomepage(source: string) {
  const s = source.toLowerCase();
  if (s.includes("arxiv")) return "https://arxiv.org";
  if (s.includes("semantic scholar")) return "https://www.semanticscholar.org";
  if (s.includes("scopus")) return "https://www.scopus.com";
  if (s.includes("springer")) return "https://www.springer.com";
  if (s.includes("ieee")) return "https://ieeexplore.ieee.org";
  if (s.includes("acm")) return "https://dl.acm.org";
  return "#";
}

export function getDurationBetween(start?: string, end?: string) {
  if (!start || !end) return null;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;

  let diffInSeconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  if (diffInSeconds < 0) diffInSeconds = 0;

  const seconds = diffInSeconds % 60;
  const minutes = Math.floor((diffInSeconds / 60) % 60);
  const hours = Math.floor(diffInSeconds / 3600);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}
