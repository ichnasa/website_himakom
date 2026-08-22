import { EnumLike } from "zod/v3";

export interface User {
    id: string,
    username: string,
    password: string,
    role: "admin" | "pengguna" | "super_admin",
    created_at: string
}

export type CreateUserState = {
    success: boolean;
    error: string;
    inserted: unknown | null;
    fieldErrors: {
        username?: string[];
        password?: string[];
        role?: string[];
    };
}

export type UpdateUserState = {
    success: boolean;
    error: string;
    fieldErrors: {
        username: string[];
        password: string[];
        role: string[];
    };
};