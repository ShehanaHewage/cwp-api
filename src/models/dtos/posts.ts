import { z } from 'zod';

export const postSchema = z.object({
    author: z.string().min(1, 'Author is required'),
    description: z.string().optional(),
    likes: z.number().min(0, 'Likes must be a non-negative integer').default(0),
    shares: z.number().min(0, 'Shares must be a non-negative integer').default(0),
});
const updatePostSchema = z.object({
    author: z.string().optional(),
    description: z.string().optional(),
    likes: z.number().optional(),
    shares: z.number().optional(),
});