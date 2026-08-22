"use server"

import { verifyJWT } from "@/app/utils/auth";
import db from "@/app/utils/database";
import { cookies } from "next/headers";
import z from "zod";
import bcrypt from 'bcryptjs';

type UserState = {
    success: boolean;
    error: string;
    inserted: unknown | null;
    fieldErrors: {
        username?: string[];
        password?: string[];
        role?: string[];
    };
}

const UserSchema = z.object({
    id: z.string().optional(),
    username: z.string().min(3, "Username too short"),
    password: z.string().min(8, "Password too short!"),
    role: z.enum(['pengguna', 'admin', 'super_admin'])
})

const UpdateUserSchema = z.object({
    id: z.string(),
    username: z.string().min(3, "Username too short"),
    password: z.string().min(8, "Password too short!").optional().or(z.literal('')),
    role: z.enum(['pengguna', 'admin', 'super_admin'])
})

const emptyFieldErrors = {
    username: [],
    password: [],
    role: [],
};

export async function createUserAction(initialState: any, formData: FormData): Promise<UserState> {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role === 'pengguna' && !currentUser.permissions?.includes('manage_users'))) {
        return { success: false, error: "Akses ditolak: Anda tidak memiliki izin untuk mengelola pengguna.", inserted: null, fieldErrors: emptyFieldErrors };
    }

    const result = UserSchema.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
        role: formData.get("role")
    })

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;

        return {
            success: false,
            error: "Validasi gagal",
            inserted: null,
            fieldErrors: {
                username: fieldErrors.username ?? [],
                password: fieldErrors.password ?? [],
                role: fieldErrors.role ?? [],
            },
        };
    }

    const isUsernameExist = db.prepare(`SELECT * FROM user WHERE username = ?;`).get(result.data?.username);

    if (isUsernameExist) {
        return { success: false, inserted: null, error: "Username already exist!", fieldErrors: emptyFieldErrors }
    }

    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(result.data?.password, saltRound)

    const stmt = db.prepare(`
            INSERT INTO user (username, password, role)
            VALUES (:username, :password, :role)
            RETURNING *;
        `).get({ username: result.data?.username, password: hashedPassword, role: result.data?.role })

    if (!stmt) {
        return { success: false, error: "Fail to create user", inserted: null, fieldErrors: emptyFieldErrors };
    }

    return { success: true, error: "", inserted: stmt, fieldErrors: emptyFieldErrors }
}

export async function getCurrentUser() {
    // TODO!: Bug when token is expired and next js show error
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt_token')?.value;

    if (!token) return null;

    const payload = await verifyJWT(token);
    if (!payload) return null;

    let permissions: string[] = [];
    const user = db.prepare('SELECT id FROM user WHERE username = ?').get(payload.username) as { id: number } | undefined;
    if (user) {
        const perms = db.prepare(`
            SELECT p.name FROM user_group ug
            JOIN group_permission gp ON ug.group_id = gp.group_id
            JOIN permission p ON gp.permission_id = p.id
            WHERE ug.user_id = ?
        `).all(user.id) as { name: string }[];
        permissions = perms.map(p => p.name);
    }

    return {
        ...payload,
        permissions
    }
}

export async function getUsersAction(): Promise<any> {
    const result = db.prepare(`SELECT * FROM user;`).all();

    if (!result) {
        return { error: "Failed to get users" }
    }

    return result;
}

export async function deleteUserAction(username: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role === 'pengguna' && !currentUser.permissions?.includes('manage_users'))) {
        return { error: "Akses ditolak: Anda tidak memiliki izin untuk mengelola pengguna." };
    }

    const result = db.prepare('DELETE FROM user WHERE username = :username').run({ username });

    if (result.changes === 0) {
        return { error: "Failed to delete user" }
    }

    return { success: true }
}

export async function updateUserAction(initialState: any, formData: FormData) {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role === 'pengguna' && !currentUser.permissions?.includes('manage_users'))) {
        return { success: false, error: "Akses ditolak: Anda tidak memiliki izin untuk mengelola pengguna.", fieldErrors: emptyFieldErrors };
    }

    const userFormData = UpdateUserSchema.safeParse({
        id: formData.get("id"),
        username: formData.get("username"),
        password: formData.get("password"),
        role: formData.get("role")
    })

    if (!userFormData.success) {
        const fieldErrors = userFormData.error.flatten().fieldErrors;

        return {
            success: false,
            error: "Validasi gagal",
            fieldErrors: {
                username: fieldErrors.username ?? [],
                password: fieldErrors.password ?? [],
                role: fieldErrors.role ?? [],
            },
        };
    }

    // check if user with that id exist, if exist continue else return error
    const user = db.prepare(`SELECT * FROM user WHERE id = ?`).get(userFormData.data?.id) as { id: number; username: string; password: string; role: string } | undefined;
    if (!user) return { success: false, error: "User doesn't exist!", fieldErrors: emptyFieldErrors }

    let sql = "UPDATE user SET username = :username, password = :password, role = :role WHERE id = :id"

    let newPassword = user.password;
    if (userFormData.data?.password && userFormData.data.password !== "") {
        newPassword = await bcrypt.hash(userFormData.data.password, 10);
    }

    const result = db.prepare(sql).run({
        id: user.id,
        username: userFormData.data?.username ? userFormData.data?.username : user.username,
        password: newPassword,
        role: userFormData.data?.role ? userFormData.data?.role : user.role,
    });

    if (result.changes === 0) return { success: false, error: "Failed to update user!", fieldErrors: emptyFieldErrors }

    return { success: true, error: "", fieldErrors: emptyFieldErrors }
}

export async function getUserByIdAction(id: string) {
    const result = db.prepare("SELECT * FROM user WHERE id = :id").get({ id: id });
    return result;
}
