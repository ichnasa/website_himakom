"use client"

import { createUserAction, deleteUserAction, getCurrentUser, getUserByIdAction, getUsersAction, updateUserAction } from "@/app/action/pengguna/action"
import CloseButton from "@/app/components/CloseButton";
import { useActionState, useEffect, useState, useTransition } from "react"
import { success } from "zod";

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

const initialState = {
    success: false,
    error: "",
    inserted: null,
    fieldErrors: {
        username: [],
        password: [],
        role: [],
    }
}

export default function Pengguna() {
    const [state, formAction, pending] = useActionState<UserState, FormData>(createUserAction, initialState)
    const [updateUserState, updateUserFormAction, updateUserActionPending] = useActionState<any>(updateUserAction, {
        success: false,
        error: "",
    })
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUset] = useState([]);
    const [isTransitionPending, startTransition] = useTransition();
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [userDataToUpdate, setUserDataToUpdate] = useState<any | null>(null);

    const fetchUsers = async () => {
        const data = await getUsersAction();
        const user = await getCurrentUser();
        setCurrentUset(user);
        setUsers(data);
    }

    const handleCreateUserModal = () => {
        setIsCreateUserModalOpen(prev => !prev)
    }

    const handleOpenUpdateUserModal = async (userId: string) => {
        const data = await getUserByIdAction(userId);
        setUserDataToUpdate(data);
        setIsUpdateModalOpen(prev => !prev);
    }

    const handleDeleteUser = async (username: string) => {
        const result = await deleteUserAction(username);

        if (result.success) {
            fetchUsers();
        }
    }

    // Click btn
    // fetch async data
    // UI already trying to use the data before full completed being fetch
    useEffect(() => {
        if (state.success && state.inserted) {
            fetchUsers();
            setIsCreateUserModalOpen(false);
        }
        if (updateUserState.success) {
            fetchUsers();
            setIsUpdateModalOpen(false)
        }
    }, [state.success, state.inserted, isCreateUserModalOpen, updateUserState.success])

    useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <>
            <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Manajemen Pengguna</h1>
                </div>
                <button onClick={handleCreateUserModal} className="rounded-none bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
                    Buat Akun
                </button>
                {isCreateUserModalOpen && (
                    <>
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
                            <div className="relative z-10 min-w-xl rounded-none border border-slate-200 bg-white shadow-sm">
                                <div className="flex flex-row items-center justify-between px-6 py-5 border-b border-slate-400">
                                    <div className="">
                                        <h2 className="text-lg font-semibold text-slate-900">Tambah Akun Pengguna</h2>
                                    </div>
                                    <CloseButton onClick={handleCreateUserModal} />
                                </div>
                                <div className="px-6 py-6">
                                    {state?.error && (
                                        <div className="mb-5 flex items-start gap-3 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                            </svg>
                                            <span>{state.error}</span>
                                        </div>
                                    )}
                                    {state?.success && (
                                        <div className="mb-5 flex items-start gap-3 border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                            </svg>
                                            <span>Akun berhasil dibuat.</span>
                                        </div>
                                    )}

                                    <form action={formAction} className="space-y-5">
                                        <div className="space-y-1.5">
                                            <label htmlFor="username" className="block text-sm font-semibold text-slate-700">
                                                Nama pengguna
                                            </label>
                                            <input
                                                id="username"
                                                type="text"
                                                name="username"
                                                autoComplete="off"
                                                placeholder="Masukkan username…"
                                                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                            {state.fieldErrors.username?.[0] && (
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                                                    <svg className="h-3.5 w-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                                        <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-10a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 5zm0 6.5a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75z" clipRule="evenodd" />
                                                    </svg>
                                                    {state.fieldErrors.username[0]}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                                                Password
                                            </label>
                                            <input
                                                id="password"
                                                type="password"
                                                name="password"
                                                autoComplete="new-password"
                                                placeholder="Masukkan password…"
                                                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                            {state.fieldErrors.password?.[0] && (
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                                                    <svg className="h-3.5 w-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                                        <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-10a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 5zm0 6.5a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75z" clipRule="evenodd" />
                                                    </svg>
                                                    {state.fieldErrors.password[0]}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label htmlFor="role" className="block text-sm font-semibold text-slate-700">
                                                Role
                                            </label>
                                            <select
                                                id="role"
                                                name="role"
                                                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            >
                                                <option value="pengguna">Pengguna</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            {state.fieldErrors.role?.[0] && (
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                                                    <svg className="h-3.5 w-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                                        <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-10a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 5zm0 6.5a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75z" clipRule="evenodd" />
                                                    </svg>
                                                    {state.fieldErrors.role[0]}
                                                </span>
                                            )}
                                        </div>

                                        <div className="pt-1">
                                            <button
                                                type="submit"
                                                disabled={pending}
                                                className="rounded-none bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {pending ? "Submitting…" : "Submit"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {isUpdateModalOpen && (
                    <>
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
                            <div className="relative z-10 min-w-xl rounded-none border border-slate-200 bg-white shadow-sm">
                                <div className="flex flex-row items-center justify-between px-6 py-5 border-b border-slate-400">
                                    <div className="">
                                        <h2 className="text-lg font-semibold text-slate-900">Perbarui Akun Pengguna</h2>
                                    </div>
                                    <CloseButton onClick={() => setIsUpdateModalOpen(prev => !prev)} />
                                </div>
                                <div className="px-6 py-6">
                                    {state?.error && (
                                        <div className="mb-5 flex items-start gap-3 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                            </svg>
                                            <span>{state.error}</span>
                                        </div>
                                    )}
                                    {state?.success && (
                                        <div className="mb-5 flex items-start gap-3 border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                            </svg>
                                            <span>Akun berhasil dibuat.</span>
                                        </div>
                                    )}
                                    {Object.entries(userDataToUpdate).map(([key, value]) => (
                                        <h1 key={key}>{key} - {value}</h1>
                                    ))}
                                    <form action={updateUserAction} className="space-y-5">
                                        <div className="space-y-1.5">
                                            <input type="hidden" name="id" value={userDataToUpdate.id.toString()} />
                                            <label htmlFor="username" className="block text-sm font-semibold text-slate-700">
                                                Nama pengguna
                                            </label>
                                            <input
                                                id="username"
                                                type="text"
                                                name="username"
                                                autoComplete="off"
                                                value={userDataToUpdate.username}
                                                onChange={(e) => setUserDataToUpdate({ ...userDataToUpdate, username: e.target.value })}
                                                placeholder="Masukkan username…"
                                                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                            {state.fieldErrors.username?.[0] && (
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                                                    <svg className="h-3.5 w-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                                        <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-10a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 5zm0 6.5a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75z" clipRule="evenodd" />
                                                    </svg>
                                                    {state.fieldErrors.username[0]}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                                                Password
                                            </label>
                                            <input
                                                id="password"
                                                type="password"
                                                name="password"
                                                autoComplete="new-password"
                                                placeholder="Masukkan password…"
                                                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                            {state.fieldErrors.password?.[0] && (
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                                                    <svg className="h-3.5 w-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                                        <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-10a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 5zm0 6.5a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75z" clipRule="evenodd" />
                                                    </svg>
                                                    {state.fieldErrors.password[0]}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label htmlFor="role" className="block text-sm font-semibold text-slate-700">
                                                Role
                                            </label>
                                            <select
                                                id="role"
                                                name="role"
                                                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            >
                                                <option value="pengguna">Pengguna</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            {state.fieldErrors.role?.[0] && (
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                                                    <svg className="h-3.5 w-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                                        <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-10a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 5zm0 6.5a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75z" clipRule="evenodd" />
                                                    </svg>
                                                    {state.fieldErrors.role[0]}
                                                </span>
                                            )}
                                        </div>

                                        <div className="pt-1">
                                            <button
                                                type="submit"
                                                disabled={updateUserActionPending}
                                                className="rounded-none bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {updateUserActionPending ? "Submitting…" : "Submit"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                )}

            </section >

            <section className="mx-auto max-w-4xl px-4 pb-6 sm:px-6 lg:px-8">
                <div className="card-border rounded-none border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="text-lg font-semibold text-slate-900">Daftar     Pengguna</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Username
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-10 text-center text-sm text-slate-400">
                                            Belum ada pengguna terdaftar.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="even:bg-zinc-200 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">{user.username}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold border ${user.role === "admin"
                                                    ? "border-slate-900 bg-slate-900 text-white"
                                                    : "border-slate-300 bg-white text-slate-700"
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900 flex flex-row gap-3">
                                                <button disabled={user.username === currentUser.username ? true : false} onClick={() => startTransition(() => handleDeleteUser(user.username))} className={`${user.username === currentUser.username ? 'bg-red-100' : 'bg-red-400'} btn px-3 py-1.5 text-white active:bg-red-300`}>{isTransitionPending ? 'Deleting...' : 'Delete'}</button>
                                                <button onClick={() => handleOpenUpdateUserModal(user.id)} className={` btn text-black border-black border px-3 py-1.5 active:bg-zinc-300`}>Update</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    )
}