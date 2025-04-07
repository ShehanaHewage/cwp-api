import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { v4 as uuidv4 } from 'uuid';
import sql from "../repo/conn.ts"; // Assuming db.ts for DB connection
import { z } from 'zod'; // To define the validation schema for post creation

// Define the validation schema for creating a post
const postSchema = z.object({
    author: z.string().min(1), // Ensure author is a non-empty string
    description: z.string().optional(), // description is optional
    likes: z.number().optional(), // likes are optional
    shares: z.number().optional(), // shares are optional
});

const postRoutes = new Hono();

postRoutes.post('/create', zValidator('json', postSchema), async (c) => {
    // Get post data from request body
    const { author, description, likes, shares } = c.req.valid('json');

    const postId = uuidv4(); // Generate a unique post ID

    // Correctly use tagged template literal for the query
    try {
        // Execute the query using tagged template literals
        const res = await sql`
            INSERT INTO posts (post_id, author, description, likes, shares)
            VALUES (${postId}, ${author}, ${description || null}, ${likes || 0}, ${shares || 0})
            RETURNING *;
        `;

        // If insertion is successful, return the created post
        const createdPost = res[0]; // `postgres` library returns an array of rows

        return c.json({ message: 'Post created successfully', post: createdPost });
    } catch (error) {
        console.error('Error creating post:', error);  // Log the error for debugging
        return c.json({ error: 'Failed to create post', details: error.message }, 500); // Return detailed error
    }
});
postRoutes.delete('/delete/:id', async (c) => {
    const postId = c.req.param('id'); // Get the post ID from URL params

    try {
        const result = await sql`
            DELETE FROM posts
            WHERE post_id = ${postId}
            RETURNING *;
        `;

        if (result.length === 0) {
            return c.json({ error: 'Post not found' }, 404);
        }

        return c.json({ message: 'Post deleted successfully', deletedPost: result[0] });
    } catch (error) {
        console.error('Error deleting post:', error);
        return c.json({ error: 'Failed to delete post', details: error.message }, 500);
    }
});

const updatePostSchema = z.object({
    author: z.string().optional(),
    description: z.string().optional(),
    likes: z.number().optional(),
    shares: z.number().optional(),
});
// PUT endpoint to update a post by ID
postRoutes.put('/edit/:id', zValidator('json', updatePostSchema), async (c) => {
    const postId = c.req.param('id');
    const data = c.req.valid('json');

    // Build the SET part of the query dynamically
    const fields = Object.keys(data);
    if (fields.length === 0) {
        return c.json({ error: 'No fields provided to update' }, 400);
    }

    const setClauses = fields.map((field, index) => `${field} = $${index + 2}`);
    const values = [postId, ...fields.map((f) => data[f as keyof typeof data])];

    const query = `
    UPDATE posts
    SET ${setClauses.join(', ')}
    WHERE post_id = $1
    RETURNING *;
  `;

    try {
        const result = await sql.unsafe(query, values);
        if (result.length === 0) {
            return c.json({ error: 'Post not found' }, 404);
        }

        return c.json({ message: 'Post updated successfully', post: result[0] });
    } catch (err) {
        console.error('Update error:', err);
        return c.json({ error: 'Failed to update post' }, 500);
    }
});

postRoutes.get('/:id', async (c) => {
    const postId = c.req.param('id'); // Get the post ID from the URL parameters

    try {
        const result = await sql`
            SELECT * FROM posts WHERE post_id = ${postId}
        `;

        if (result.length === 0) {
            return c.json({ error: 'Post not found' }, 404);
        }

        return c.json({ post: result[0] }); // Return the found post
    } catch (error) {
        console.error('Error fetching post:', error);
        return c.json({ error: 'Failed to fetch post', details: error.message }, 500);
    }
});

export default postRoutes;

