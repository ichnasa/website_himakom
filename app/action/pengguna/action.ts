"use server"

import { verifyJWT } from "@/app/utils/auth";
import db from "@/app/utils/database";
import { error } from "console";
import { cookies } from "next/headers";
import z, { success } from "zod";
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
    role: z.enum(['pengguna', 'admin'])
})

const emptyFieldErrors = {
    username: [],
    password: [],
    role: [],
};

export async function createUserAction(initialState: any, formData: FormData): Promise<UserState> {
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
    const hashedPassword = await bcrypt.hash(result.data?.password, 10)

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

    return {
        ...payload
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
    const result = db.prepare('DELETE FROM user WHERE username = :username').run({ username });

    if (result.changes === 0) {
        return { error: "Failed to delete user" }
    }

    return { success: true }
}

export async function updateUserAction(formData: FormData) {
    // Get userId and formData
    const userFormData = UserSchema.safeParse({
        id: formData.get("id"),
        username: formData.get("username"),
        password: formData.get("password"),
        role: formData.get("role")
    })

    // check if user with that id exist, if exist continue else return error
    const user = db.prepare(`SELECT * FROM user WHERE id = ?`).get(userFormData.data.id);

    if (!user) return { error: "User doesn't exist!" }

    // check what field is user want to update by looping trough given key value
    // build SQL for that
    let sql = "UPDATE user SET"
    const queryParts = Object.entries(userFormData.data)
        .filter(([key, value]) => {
            return value
        })
        .map(([key]) => `${key} = ?`)

    sql += " " + queryParts.join(", ") + " WHERE id = ?";

    const values = Object.entries(userFormData.data).map(([key, value]) => {
        return value ?? undefined
    })

    // give placeholder value (stored value). Use ? not :var, so we can give placeholder value without worrying about the value order
    const result = db.prepare(sql).run([...values, userFormData.data?.id]);

    // Run the query, if affect changes 0 return error else success
    if (result.changes === 0) return { error: "Failed to update user!" }

    return { succes: true }
}

export async function getUserByIdAction(id: string) {
    const result = db.prepare("SELECT * FROM user WHERE id = :id").get({ id: id });
    return result;
}
