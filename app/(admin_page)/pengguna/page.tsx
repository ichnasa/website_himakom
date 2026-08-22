"use client"

import { createUserAction, deleteUserAction, getCurrentUser, getUserByIdAction, getUsersAction, updateUserAction } from "@/app/action/pengguna/action"
import CreateUserModal from "@/app/components/pengguna/CreateUserModal";
import UpdateUserModal from "@/app/components/pengguna/UpdateUserModal";
import { useActionState, useEffect, useState, useTransition } from "react"
import { CreateUserState, UpdateUserState, User } from "@/app/types/pengguna"

const createUserActionInitialState: CreateUserState = {
    success: false,
    error: "",
    inserted: null,
    fieldErrors: {
        username: [],
        password: [],
        role: [],
    }
}

const updateUserActionInitialState: UpdateUserState = {
    success: false,
    error: "",
    fieldErrors: {
        username: [],
        password: [],
        role: [],
    }
}

export default function Pengguna() {
    const [createUserState, createUserFormAction, createUserActionPending] = useActionState<CreateUserState, FormData>(createUserAction, createUserActionInitialState)
    const [updateUserState, updateUserFormAction, updateUserActionPending] = useActionState<UpdateUserState, FormData>(updateUserAction, updateUserActionInitialState)
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
    const [isTransitionPending, startTransition] = useTransition();
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [userDataToUpdate, setUserDataToUpdate] = useState<any | null>(null);

    const fetchUsers = async () => {
        const data = await getUsersAction();
        const user = await getCurrentUser();
        setCurrentUser(user as Partial<User> | null);
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

    useEffect(() => {
        if (createUserState.success && createUserState.inserted) {
            fetchUsers();
            setIsCreateUserModalOpen(false);
        }
        if (updateUserState.success) {
            fetchUsers();
            setIsUpdateModalOpen(false)
            updateUserState.success = false;
        }
    }, [createUserState.success, createUserState.inserted, updateUserState.success])

    useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <div className="min-h-screen bg-white pb-12 pt-8 font-sans text-zinc-900">
            <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Manajemen Pengguna</h1>
                        <p className="mt-2 text-sm text-zinc-500">
                            Kelola akun pengguna, peran, dan hak akses untuk sistem Himakom.
                        </p>
                    </div>
                    {(currentUser?.role !== 'pengguna' || (currentUser as any)?.permissions?.includes('manage_users')) && (
                        <button 
                            onClick={handleCreateUserModal} 
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Buat Akun
                        </button>
                    )}
                </div>

                {isCreateUserModalOpen && (
                    <CreateUserModal
                        handleClose={() => setIsCreateUserModalOpen(false)}
                        createUserState={createUserState}
                        createUserFormAction={createUserFormAction}
                        createUserActionPending={createUserActionPending}
                    />
                )}
                {isUpdateModalOpen && (
                    <UpdateUserModal
                        setUserDataToUpdate={setUserDataToUpdate}
                        userDataToUpdate={userDataToUpdate}
                        handleClose={() => setIsUpdateModalOpen(false)}
                        updateUserState={updateUserState}
                        updateUserFormAction={updateUserFormAction}
                        updateUserActionPending={updateUserActionPending}
                    />
                )}
            </section>

            <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="border-b border-zinc-200 bg-zinc-50/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3.5 text-xs font-medium text-zinc-500">
                                        Username
                                    </th>
                                    <th scope="col" className="px-6 py-3.5 text-xs font-medium text-zinc-500">
                                        Peran (Role)
                                    </th>
                                    <th scope="col" className="px-6 py-3.5 text-right text-xs font-medium text-zinc-500">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 bg-white">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-sm text-zinc-500">
                                            Belum ada pengguna terdaftar.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="group transition-colors hover:bg-zinc-50">
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-zinc-900">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-zinc-100 text-xs font-bold uppercase text-zinc-700">
                                                        {user.username.charAt(0)}
                                                    </div>
                                                    {user.username}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                                                    user.role === "super_admin"
                                                        ? "bg-zinc-800 text-zinc-100"
                                                        : user.role === "admin"
                                                        ? "bg-zinc-200 text-zinc-800"
                                                        : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right">
                                                {(currentUser?.role !== 'pengguna' || (currentUser as any)?.permissions?.includes('manage_users')) ? (
                                                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
                                                        <button 
                                                            onClick={() => handleOpenUpdateUserModal(user.id)} 
                                                            className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none active:bg-zinc-200"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            disabled={user.username === currentUser?.username} 
                                                            onClick={() => {
                                                                if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna ${user.username}?`)) {
                                                                    startTransition(() => handleDeleteUser(user.username))
                                                                }
                                                            }} 
                                                            className={`inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none ${
                                                                user.username === currentUser?.username 
                                                                ? 'border-zinc-200 bg-zinc-50 text-zinc-400 cursor-not-allowed' 
                                                                : 'border-zinc-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-200 active:bg-red-100'
                                                            }`}
                                                        >
                                                            {isTransitionPending ? "Proses..." : "Hapus"}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-zinc-400 italic">Tidak ada akses</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    )
}