import { z } from 'zod'
import type { User } from '../entities/user.ts';

export const userFormSchema = z.object({
    username: z.string()
        .min(5, "Username must be at least 5 characters long")
        .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric"),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().optional()
});

export type UserFormDto = z.infer<typeof userFormSchema>;

export const loginFormSchema = z.object({
    username: z.string(),
    password: z.string()
});

export type LoginFormDto = z.infer<typeof loginFormSchema>;


export const userDto = z.object({
    userId: z.string(),
    username: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string().optional()
});

export type UserDto = z.infer<typeof userDto>;

export function convertUserToUserDto(user: User): UserDto {
    return {
        userId: user.userId,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName ?? undefined
    };
}

export const getUserSchema = z.object({
    userId: z.string(),
})
export const userUpdateSchema = z.object({
    email: z.string().email().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    password: z.string().min(6).optional(),
});