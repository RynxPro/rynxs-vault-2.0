import { z } from "zod";

export const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description must be less than 500 characters"),
  category: z
    .string()
    .min(3, "Category must be at least 3 characters")
    .max(20, "Category must be less than 20 characters"),
  image: z.instanceof(File).refine((file) => file instanceof File, {
    message: "Image is required",
  }),
});
