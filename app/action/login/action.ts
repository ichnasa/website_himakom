"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import db from "@/app/utils/database";
import { createJWT } from "@/app/utils/auth";
import * as z from "zod";

interface User {
    id: number,
    username: string,
    password: string,
    role: string,
    created_at: string
}

const Credential = z.object({
    username: z.string().min(3, "Username is too short"),
    password: z.string(),
})

export async function loginAction(initialState: any, formData: FormData) {
    const result = Credential.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
    });

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        return {
            error: fieldErrors.username?.[0] ?? "Unexcpected validation error"
        };
    }

    const { username, password } = result.data;
    const user = db.prepare("SELECT * FROM user WHERE username = ?").get(username) as User;

    if (!user) {
        return { error: "Username tidak ditemukan" };
    }

    if (user.password !== password) {
        return { error: "Password salah" };
    }

    try {
        const token = await createJWT({ username: user.username, role: user.role });
        const cookieStore = await cookies();
        cookieStore.set("jwt_token", token, { httpOnly: true, maxAge: 60 * 60 * 2, path: "/" });
    } catch (error) {
        return { error: "Gagal membuat token login" };
    }

    redirect("/dashboard");
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('jwt_token')
    redirect('/login')
}