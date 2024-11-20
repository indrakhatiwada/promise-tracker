import { z } from "zod";

export const promiseFormSchema = z.object({
  promiserName: z.string()
    .min(2, "Promiser name must be at least 2 characters")
    .max(100, "Promiser name cannot exceed 100 characters"),
  
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
  
  party: z.string()
    .min(1, "Party must be selected"),
  
  articleLink: z.string()
    .url("Please enter a valid URL")
    .min(5, "Article link is required"),
  
  screenshot: z.string()
    .optional(),
  
  promisedDate: z.string()
    .transform((str) => new Date(str))
    .refine((date) => date <= new Date(), "Promise date cannot be in the future")
    .refine((date) => date >= new Date("2000-01-01"), "Promise date cannot be before year 2000"),
  
  imageUrl: z.string()
    .url("Please enter a valid image URL")
    .optional(),
});
