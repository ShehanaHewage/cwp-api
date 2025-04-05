import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { extname, join } from 'path';
import { existsSync, createReadStream } from 'fs';
import { stat } from 'fs/promises';


const fileRoutes = new Hono();

const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    // Add others if needed
};

fileRoutes.get('/files/:filename', async (c) => {
    const filename = c.req.param('filename');
    const filePath = join('./storage', filename);

    // Check if file exists
    if (!existsSync(filePath)) {
        return c.text('File not found', StatusCodes.NOT_FOUND);
    }

    // Get file info
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
        return c.text('Not a file', StatusCodes.BAD_REQUEST);
    }

    const ext = extname(filename).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    const stream = createReadStream(filePath);
    return new Response(stream as any, {
        headers: {
            'Content-Type': contentType,
            'Content-Length': fileStat.size.toString(),
        },
    });
});

export default fileRoutes;
