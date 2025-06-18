import {z} from "zod";


//create a zod schema for the above mongoose schema
export const blogZodSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
  image: z.string().optional(), 
  likes: z.number().min(0).optional(),
  comments: z.array(
    z.object({
      user: z.string().uuid(),
      content: z.string().min(1),
      createdAt: z.date(),
    })
  ).optional(),
  tags: z.array(z.string()).optional(),
});