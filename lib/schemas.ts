import * as z from "zod";

export const submitSolutionFormSchema = z.object({
  framework: z.enum(["Angular", "Svelte", "React", "Vue"]),
  liveAppUrl: z.string().url(),
  sourceCodeUrl: z.string().url(),
});

export const teamEnum = z.enum(["Earth", "Saturn", "Jupiter", "Mars"]);

export const userProfileSchema = z.object({
  username: z
    .string()
    .min(2)
    .max(50)
    .refine((s) => !s.includes(" "), "The username must not contain spaces!"),
  name: z.string().min(5).max(50),
  bio: z.string().min(20).max(500),
  team: teamEnum,
  location: z.string().min(3).max(20).optional(),
  twitter: z
    .string()
    .url("Should be a valid url")
    .startsWith("https://twitter.com/")
    .optional(),
  github: z
    .string()
    .url("Should be a valid url")
    .startsWith("https://github.com/")
    .optional(),
  youtube: z
    .string()
    .url("Should be a valid url")
    .startsWith("https://youtube.com/")
    .optional(),
  website: z.string().url("Should be a valid url").optional(),
});
