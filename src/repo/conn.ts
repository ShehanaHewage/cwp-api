import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config();

const sql = postgres({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    database: process.env.DB_NAME || "postgres",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
});

export default sql;