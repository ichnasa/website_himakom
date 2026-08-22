"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import {
    getGroupsAction,
    createGroupAction,
    deleteGroupAction,
    updateGroupAction,
    getGroupMembersAction,
    getUsersNotInGroupAction,
    addUserToGroupAction,
    removeUserFromGroupAction,
    getGroupModulesAction,
    toggleGroupModuleAction,
} from "@/app/action/groups/action";
import { Group, GroupMember, GroupModuleAccess, GroupState } from "@/app/types/groups";

/* ------------------------------------------------------------------ */
/*  Initial form state                                                  */
/* ------------------------------------------------------------------ */
const initialGroupState: GroupState = {
    success: false,
    error: "",
    fieldErrors: { name: [], description: [] },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`animate-pulse rounded-md bg-[#f2f2f0] ${className}`} />;
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "active" | "default" }) {
    const cls = variant === "active"
        ? "bg-zinc-900 text-white"
        : "bg-zinc-100 text-zinc-500";
    return (
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${cls}`}>
            {children}
        </span>
    );
}

/* ------------------------------------------------------------------ */
/*  Modal: Buat / Edit Group                                            */
/* ------------------------------------------------------------------ */
interface GroupModalProps {
    mode: "create" | "edit";
    initialData?: { id: number; name: string; description: string | null };
    onClose: () => void;
    onSuccess: () => void;
}

function GroupModal({ mode, initialData, onClose, onSuccess }: GroupModalProps) {
    const action = mode === "create" ? createGroupAction : updateGroupAction;
    const [state, formAction, pending] = useActionState<GroupState, FormData>(action, initialGroupState);

    useEffect(() => {
        if (state.success) onSuccess();
    }, [state.success]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border border-black/10 bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-[rgba(0,0,0,0.95)]">
                        {mode === "create" ? "Buat Group Baru" : "Edit Group"}
                    </h2>
                    <button onClick={onClose} className="rounded-full p-1 text-[#78736f] hover:bg-[#f9f9f8]">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                    </button>
                </div>

                {state.error && (
                    <div className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 border border-red-200">
                        {state.error}
                    </div>
                )}

                <form action={formAction} className="space-y-4">
                    {mode === "edit" && <input type="hidden" name="id" value={initialData?.id} />}

                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-[rgba(0,0,0,0.75)]">
                            Nama Group <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="group-name-input"
                            name="name"
                            type="text"
                            defaultValue={initialData?.name}
                            placeholder="contoh: Pengurus Inti"
                            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-[rgba(0,0,0,0.95)] placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                        />
                        {state.fieldErrors.name?.[0] && (
                            <p className="mt-1 text-xs text-red-500">{state.fieldErrors.name[0]}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-[rgba(0,0,0,0.75)]">
                            Deskripsi
                        </label>
                        <textarea
                            id="group-desc-input"
                            name="description"
                            defaultValue={initialData?.description ?? ""}
                            placeholder="Deskripsi singkat tentang group ini..."
                            rows={3}
                            className="w-full resize-none rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-[rgba(0,0,0,0.95)] placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium text-[rgba(0,0,0,0.75)] hover:bg-[#f9f9f8]"
                        >
                            Batal
                        </button>
                        <button
                            id="group-submit-btn"
                            type="submit"
                            disabled={pending}
                            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
                        >
                            {pending ? "Menyimpan…" : mode === "create" ? "Buat Group" : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Panel Detail: Anggota Tab                                           */
/* ------------------------------------------------------------------ */
function MembersTab({ groupId }: { groupId: number }) {
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [candidates, setCandidates] = useState<{ id: number; username: string; role: string }[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | "">("");
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const reload = async () => {
        setLoading(true);
        const [m, c] = await Promise.all([
            getGroupMembersAction(groupId),
            getUsersNotInGroupAction(groupId),
        ]);
        setMembers(m);
        setCandidates(c);
        setSelectedUserId("");
        setLoading(false);
    };

    useEffect(() => { reload(); }, [groupId]);

    const handleAdd = () => {
        if (!selectedUserId) return;
        startTransition(async () => {
            await addUserToGroupAction(Number(selectedUserId), groupId);
            await reload();
        });
    };

    const handleRemove = (userId: number) => {
        startTransition(async () => {
            await removeUserFromGroupAction(userId, groupId);
            await reload();
        });
    };

    if (loading) return (
        <div className="space-y-2 p-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
        </div>
    );

    return (
        <div className="p-4 space-y-4">
            {/* Tambah anggota */}
            {candidates.length > 0 && (
                <div className="flex gap-2">
                    <select
                        id="add-member-select"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value === "" ? "" : Number(e.target.value))}
                        className="flex-1 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-[rgba(0,0,0,0.95)] outline-none focus:border-zinc-900"
                    >
                        <option value="">Pilih pengguna...</option>
                        {candidates.map((u) => (
                            <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
                        ))}
                    </select>
                    <button
                        id="add-member-btn"
                        onClick={handleAdd}
                        disabled={!selectedUserId || isPending}
                        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
                    >
                        Tambah
                    </button>
                </div>
            )}

            {/* Daftar anggota */}
            {members.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-center">
                    <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="text-[#dfdcd9] mb-2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <p className="text-sm text-[#78736f]">Belum ada anggota di group ini.</p>
                </div>
            ) : (
                <ul className="divide-y divide-black/[0.06] rounded-xl border border-black/10 overflow-hidden">
                    {members.map((m) => (
                        <li key={m.user_id} className="flex items-center justify-between gap-3 px-4 py-3 bg-white hover:bg-[#f9f9f8]">
                            <div className="flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
                                    {m.username[0].toUpperCase()}
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-[rgba(0,0,0,0.95)]">{m.username}</p>
                                    <p className="text-xs capitalize text-[#78736f]">{m.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemove(m.user_id)}
                                disabled={isPending}
                                className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
                            >
                                Hapus
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Panel Detail: Akses Modul Tab                                       */
/* ------------------------------------------------------------------ */
function ModulesTab({ groupId }: { groupId: number }) {
    const [modules, setModules] = useState<GroupModuleAccess[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const reload = async () => {
        setLoading(true);
        const data = await getGroupModulesAction(groupId);
        setModules(data);
        setLoading(false);
    };

    useEffect(() => { reload(); }, [groupId]);

    const handleToggle = (moduleId: number, currentAccess: number) => {
        startTransition(async () => {
            await toggleGroupModuleAction(groupId, moduleId, currentAccess === 0);
            await reload();
        });
    };

    if (loading) return (
        <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
        </div>
    );

    return (
        <div className="p-4">
            <p className="mb-3 text-xs text-[#78736f]">
                Toggle modul yang bisa diakses oleh anggota group ini.
            </p>
            <ul className="divide-y divide-black/[0.06] rounded-xl border border-black/10 overflow-hidden">
                {modules.map((mod) => (
                    <li key={mod.module_id} className="flex items-center justify-between gap-3 px-4 py-3.5 bg-white">
                        <div>
                            <p className="text-sm font-medium text-[rgba(0,0,0,0.95)]">{mod.label}</p>
                            <p className="text-xs text-[#78736f]">{mod.href}</p>
                        </div>
                        <button
                            onClick={() => handleToggle(mod.module_id, mod.has_access)}
                            disabled={isPending}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 disabled:opacity-50 ${
                                mod.has_access ? "bg-zinc-900" : "bg-zinc-200"
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                    mod.has_access ? "translate-x-6" : "translate-x-1"
                                }`}
                            />
                            <span className="sr-only">{mod.has_access ? "Cabut akses" : "Beri akses"}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                           */
/* ------------------------------------------------------------------ */
export default function Groups() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [activeTab, setActiveTab] = useState<"members" | "modules">("members");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editGroup, setEditGroup] = useState<Group | null>(null);
    const [isPending, startTransition] = useTransition();

    const loadGroups = async () => {
        setLoadingGroups(true);
        const data = await getGroupsAction();
        setGroups(data);
        // sync selected group
        if (selectedGroup) {
            const updated = data.find((g) => g.id === selectedGroup.id);
            setSelectedGroup(updated ?? null);
        }
        setLoadingGroups(false);
    };

    useEffect(() => { loadGroups(); }, []);

    const handleDelete = (groupId: number) => {
        if (!confirm("Hapus group ini? Semua anggota dan akses modul akan ikut terhapus.")) return;
        startTransition(async () => {
            await deleteGroupAction(groupId);
            if (selectedGroup?.id === groupId) setSelectedGroup(null);
            await loadGroups();
        });
    };

    return (
        <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8 font-sans">
            {/* ── Header ── */}
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-[rgba(0,0,0,0.95)]">
                        Manajemen Group.
                    </h1>
                    <p className="mt-1 text-sm text-[rgba(0,0,0,0.60)]">
                        Kelola group, anggota, dan akses modul per group.
                    </p>
                </div>
                <button
                    id="create-group-btn"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-700 transition-colors"
                >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    Buat Group
                </button>
            </div>

            {/* ── Two-column layout ── */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">

                {/* ── Daftar Group (2/5) ── */}
                <section className="lg:col-span-2">
                    <div className="rounded-xl border border-black/10 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
                        <div className="border-b border-black/[0.06] px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-widest text-[#a39e98]">
                                Daftar Group
                            </p>
                        </div>

                        {loadingGroups ? (
                            <div className="divide-y divide-black/[0.06]">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="p-4 space-y-2">
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-3 w-3/4" />
                                    </div>
                                ))}
                            </div>
                        ) : groups.length === 0 ? (
                            <div className="flex flex-col items-center py-16 text-center">
                                <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="text-[#dfdcd9] mb-2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                                <p className="text-sm text-[#78736f]">Belum ada group.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-black/[0.06]">
                                {groups.map((g) => {
                                    const isSelected = selectedGroup?.id === g.id;
                                    return (
                                        <li
                                            key={g.id}
                                            onClick={() => { setSelectedGroup(g); setActiveTab("members"); }}
                                            className={`group cursor-pointer px-4 py-4 transition-colors ${
                                                isSelected
                                                    ? "bg-zinc-100 border-l-2 border-zinc-900"
                                                    : "hover:bg-zinc-50 border-l-2 border-transparent"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className={`truncate text-sm font-semibold ${isSelected ? "text-zinc-900" : "text-[rgba(0,0,0,0.95)]"}`}>
                                                        {g.name}
                                                    </p>
                                                    {g.description && (
                                                        <p className="mt-0.5 truncate text-xs text-[#78736f]">{g.description}</p>
                                                    )}
                                                    <div className="mt-2 flex gap-2">
                                                        <Badge variant={isSelected ? "active" : "default"}>
                                                            {g.member_count} anggota
                                                        </Badge>
                                                        <Badge>{g.module_count} modul</Badge>
                                                    </div>
                                                </div>
                                                {/* Aksi */}
                                                <div className="flex shrink-0 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setEditGroup(g); }}
                                                        className="rounded p-1 text-[#78736f] hover:bg-black/[0.06]"
                                                        title="Edit"
                                                    >
                                                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(g.id); }}
                                                        disabled={isPending}
                                                        className="rounded p-1 text-red-400 hover:bg-red-50 disabled:opacity-50"
                                                        title="Hapus"
                                                    >
                                                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </section>

                {/* ── Detail Group (3/5) ── */}
                <section className="lg:col-span-3">
                    {!selectedGroup ? (
                        <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-black/10 bg-white text-center">
                            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="text-[#dfdcd9] mb-3">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="text-sm font-medium text-[rgba(0,0,0,0.75)]">Pilih group untuk melihat detail</p>
                            <p className="mt-1 text-xs text-[#78736f]">Klik salah satu group di sebelah kiri</p>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-black/10 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
                            {/* Detail header */}
                            <div className="border-b border-black/[0.06] px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700">
                                        {selectedGroup.name[0].toUpperCase()}
                                    </span>
                                    <div>
                                        <p className="text-base font-semibold text-[rgba(0,0,0,0.95)]">{selectedGroup.name}</p>
                                        <p className="text-xs text-[#78736f]">
                                            {selectedGroup.description ?? "Tidak ada deskripsi"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-black/[0.06]">
                                {(["members", "modules"] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        id={`tab-${tab}`}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                                            activeTab === tab
                                                ? "border-b-2 border-zinc-900 text-zinc-900"
                                                : "text-zinc-400 hover:text-zinc-700"
                                        }`}
                                    >
                                        {tab === "members" ? "Anggota" : "Akses Modul"}
                                    </button>
                                ))}
                            </div>

                            {/* Tab content */}
                            {activeTab === "members" ? (
                                <MembersTab key={selectedGroup.id} groupId={selectedGroup.id} />
                            ) : (
                                <ModulesTab key={selectedGroup.id} groupId={selectedGroup.id} />
                            )}
                        </div>
                    )}
                </section>
            </div>

            {/* ── Modals ── */}
            {isCreateModalOpen && (
                <GroupModal
                    mode="create"
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={() => { setIsCreateModalOpen(false); loadGroups(); }}
                />
            )}
            {editGroup && (
                <GroupModal
                    mode="edit"
                    initialData={{ id: editGroup.id, name: editGroup.name, description: editGroup.description }}
                    onClose={() => setEditGroup(null)}
                    onSuccess={() => { setEditGroup(null); loadGroups(); }}
                />
            )}
        </main>
    );
}