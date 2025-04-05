import type { User } from "../models/entities/user.ts";
import { snakeToCamelCase } from "../utils/objectUtils.ts";
import sql from "./conn.ts";

export async function getUserByUsername(
  username: string
): Promise<User | null> {
  const users = await sql<
    User[]
  >`SELECT * FROM users WHERE username = ${username}`;
  if (users.length === 0) {
    return null;
  }
  return snakeToCamelCase(users[0]);
}

export async function getUserByUsernameOrEmail(
  username: string,
  email: string
): Promise<User | null> {
  const users = await sql<
    User[]
  >`SELECT * FROM users WHERE username = ${username} OR email = ${email}`;
  if (users.length === 0) {
    return null;
  }
  return snakeToCamelCase(users[0]);
}

export async function createUser(user: User): Promise<User> {
  const [newUser] = await sql<User[]>`
        INSERT INTO users (user_id, username, password_hash, email, first_name, last_name)
        VALUES (${user.userId}, ${user.username}, ${user.passwordHash}, ${user.email}, ${user.firstName}, ${user.lastName})
        RETURNING *
    `;
  return snakeToCamelCase(newUser);
}

export async function getUserById(userId: string): Promise<User | null> {
  const users = await sql<
    User[]
  >`SELECT * FROM users WHERE user_id = ${userId}`;
  if (users.length === 0) {
    return null;
  }
  return snakeToCamelCase(users[0]);
}
