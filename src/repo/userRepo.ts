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
export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  try {

    const { email, firstName, lastName, passwordHash } = updates;

    const safeUpdates: Partial<User> = {
      email: email ?? null, // If email is undefined, set it to null
      firstName: firstName ?? null, // If firstName is undefined, set it to null
      lastName: lastName ?? null, // If lastName is undefined, set it to null
      passwordHash: passwordHash ?? null, // If passwordHash is undefined, set it to null
    };

    // SQL query to update user
    const updatedUser = await sql<User[]>`
      UPDATE users
      SET
        email = COALESCE(${safeUpdates.email}, email),
        first_name = COALESCE(${safeUpdates.firstName}, first_name),
        last_name = COALESCE(${safeUpdates.lastName}, last_name),
        password_hash = COALESCE(${safeUpdates.passwordHash}, password_hash)
      WHERE user_id = ${userId}
        RETURNING *;
    `;

    // If no user was found, return null
    if (updatedUser.length === 0) {
      return null;
    }

    // Return the updated user data (converted to camelCase)
    return snakeToCamelCase(updatedUser[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}
