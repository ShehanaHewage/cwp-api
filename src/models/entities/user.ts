
export type User = {
    userId: string;
    username: string;
    passwordHash: string;
    email: string;
    firstName: string;
    lastName: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}