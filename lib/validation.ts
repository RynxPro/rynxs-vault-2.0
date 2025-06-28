import { z } from "zod";

/**
 * Validation schema for game creation form
 */
export const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .trim()
    .refine((val) => val.length > 0, "Title is required"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description must be less than 500 characters")
    .trim()
    .refine((val) => val.length > 0, "Description is required"),
  category: z
    .string()
    .min(3, "Category must be at least 3 characters")
    .max(20, "Category must be less than 20 characters")
    .trim()
    .refine((val) => val.length > 0, "Category is required"),
  image: z
    .string()
    .url("Please provide a valid image URL")
    .min(1, "Image is required")
    .trim(),
  gameUrl: z
    .string()
    .url("Please provide a valid game URL")
    .min(1, "Game URL is required")
    .trim(),
});

/**
 * Validation schema for post creation form
 */
export const postFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .trim()
    .refine((val) => val.length > 0, "Title is required"),
  content: z
    .string()
    .min(20, "Content must be at least 20 characters")
    .max(5000, "Content must be less than 5000 characters")
    .trim()
    .refine((val) => val.length > 0, "Content is required"),
  game: z
    .string()
    .min(1, "Please select a game")
    .trim(),
  image: z
    .string()
    .url("Please provide a valid image URL")
    .optional()
    .or(z.literal("")),
});

/**
 * Validation schema for comment creation
 */
export const commentSchema = z.object({
  comment: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be less than 1000 characters")
    .trim(),
  postId: z
    .string()
    .min(1, "Post ID is required"),
});

/**
 * Validation schema for search queries
 */
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(100, "Search query too long")
    .trim()
    .optional(),
});

/**
 * Game categories for validation
 */
export const GAME_CATEGORIES = [
  "Action",
  "Adventure", 
  "Puzzle",
  "Strategy",
  "RPG",
  "Simulation",
  "Sports",
  "Racing",
  "Arcade",
  "Other"
] as const;

export type GameCategory = typeof GAME_CATEGORIES[number];

/**
 * Validation schema for game category
 */
export const categorySchema = z.enum(GAME_CATEGORIES, {
  errorMap: () => ({ message: "Please select a valid category" }),
});
