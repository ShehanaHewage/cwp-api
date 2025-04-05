import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../models/dtos/common.ts";

dotenv.config();

export async function generateJwtToken(jwtPayload: JwtPayload): Promise<string> {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    const expiresIn = process.env.JWT_EXPIRES_IN;
    if (!expiresIn) {
        throw new Error("JWT_EXPIRES_IN is not defined");
    }

    const token = jwt.sign(jwtPayload, secret, {
        expiresIn
    });
    return token;
}

export async function verifyJwtToken(token: string): Promise<JwtPayload | null> {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    try {
        const payload = jwt.verify(token, secret) as JwtPayload;
        return payload;
    } catch (error) {
        return null;
    }
}