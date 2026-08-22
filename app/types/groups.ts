export interface Group {
    id: number;
    name: string;
    description: string | null;
    created_by: number | null;
    created_at: string;
    updated_at: string;
    /** jumlah anggota (dari JOIN) */
    member_count: number;
    /** jumlah modul yang diakses (dari JOIN) */
    module_count: number;
}

export interface GroupMember {
    user_id: number;
    username: string;
    role: string;
    joined_at: string;
}

export interface GroupModuleAccess {
    module_id: number;
    name: string;
    label: string;
    href: string;
    icon: string | null;
    is_active: number;
    has_access: number; // 1 = group punya akses, 0 = tidak
}

export interface Permission {
    id: number;
    name: string;
    label: string;
    description: string | null;
    created_at: string;
}

export type GroupState = {
    success: boolean;
    error: string;
    fieldErrors: {
        name?: string[];
        description?: string[];
    };
};
