import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import fs from "node:fs/promises";
import path from "node:path";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const storagePath = path.resolve("storage");

const uploadRoute = new Hono();

uploadRoute.post("/upload", async (c) => {
    const contentType = c.req.header("content-type");
    if (!contentType?.startsWith("multipart/form-data")) {
        return c.text("Unsupported content type", 415);
    }

    const formData = await c.req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
        return c.text("File not found in form data", 400);
    }

    if (file.size > MAX_FILE_SIZE) {
        return c.text("File too large. Max size is 5MB", 413);
    }

    const mime = file.type;
    const extMap: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
        "application/pdf": "pdf",
    };

    const extension = extMap[mime];
    if (!extension) {
        return c.text("Unsupported file type", 415);
    }

    const fileBytes = new Uint8Array(await file.arrayBuffer());
    const filename = `${uuidv4()}.${extension}`;
    const savePath = path.join(storagePath, filename);

    // Ensure storage folder exists
    await fs.mkdir(storagePath, { recursive: true });
    await fs.writeFile(savePath, fileBytes);

    return c.json({ filename });
});

export default uploadRoute;
