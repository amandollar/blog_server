import {z} from 'zod';

//create zod schema for above mongoose schema

export const userZodSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(6).max(100),
  email: z.string().email(),
  blogs: z.array(z.string().uuid()).optional(),
});