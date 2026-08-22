import { UpdateUserState, User } from "@/app/types/pengguna";
import CloseButton from "../CloseButton";

interface UpdateUserModalProps {
    handleClose: () => void;
    updateUserState: UpdateUserState;
    updateUserFormAction: (payload: FormData) => void;
    updateUserActionPending: boolean;
    userDataToUpdate: User;
    setUserDataToUpdate: (value: any) => void;
}

export default function UpdateUserModal(props: UpdateUserModalProps) {
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
                <div className="relative z-10 w-full max-w-sm rounded-md border border-zinc-200 bg-white shadow-xl overflow-hidden font-sans">
                    <div className="flex flex-row items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white">
                        <div>
                            <h2 className="text-base font-semibold text-zinc-900">Edit Akun</h2>
                        </div>
                        <CloseButton onClick={props.handleClose} />
                    </div>
                    <div className="px-6 py-6">
                        {props.updateUserState?.error && (
                            <div className="mb-5 flex items-start gap-3 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                                <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                </svg>
                                <span>{props.updateUserState.error}</span>
                            </div>
                        )}
                        {props.updateUserState?.success && (
                            <div className="mb-5 flex items-start gap-3 border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                                <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                                <span>Akun berhasil diperbarui.</span>
                            </div>
                        )}
                        <form action={props.updateUserFormAction} className="space-y-5">
                            <div className="space-y-1.5">
                                <input type="hidden" name="id" value={props.userDataToUpdate.id.toString()} />
                                <label htmlFor="username" className="block text-xs font-medium text-zinc-600">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    autoComplete="off"
                                    value={props.userDataToUpdate.username}
                                    onChange={(e) => props.setUserDataToUpdate({ ...props.userDataToUpdate, username: e.target.value })}
                                    placeholder="Masukkan username"
                                    className="block w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                                />
                                {props.updateUserState.fieldErrors.username?.[0] && (
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                                        <svg className="h-3.5 w-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                            <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-10a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 5zm0 6.5a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75z" clipRule="evenodd" />
                                        </svg>
                                        {props.updateUserState.fieldErrors.username[0]}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="password" className="block text-xs font-medium text-zinc-600">
                                    Password (opsional)
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    placeholder="Kosongkan jika tidak diubah"
                                    className="block w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                                />
                                {props.updateUserState.fieldErrors.password?.[0] && (
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                                        <svg className="h-3.5 w-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                            <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-10a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 5zm0 6.5a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75z" clipRule="evenodd" />
                                        </svg>
                                        {props.updateUserState.fieldErrors.password[0]}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="role" className="block text-xs font-medium text-zinc-600">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    className="block w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                                >
                                    <option value="pengguna">Pengguna</option>
                                    <option value="admin">Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                                {props.updateUserState.fieldErrors.role?.[0] && (
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                                        <svg className="h-3.5 w-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                            <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-10a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 5zm0 6.5a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75z" clipRule="evenodd" />
                                        </svg>
                                        {props.updateUserState.fieldErrors.role[0]}
                                    </span>
                                )}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={props.updateUserActionPending}
                                    className="w-full flex items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {props.updateUserActionPending ? "Menyimpan..." : "Simpan Perubahan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}