import { z } from "zod";

export const contentSchema = z.object({
  link: z.string().url(),
});
