export interface Item {
    id: number;
    name: string;
    description: string | null;
    quantity: number;
    available: number;
    image_url: string | null;
    category: string | null;
    created_at: string;
    updated_at: string;
}

export type BorrowingStatus = 'menunggu' | 'disetujui' | 'ditolak' | 'dikembalikan';

export interface Borrowing {
    id: number;
    item_id: number;
    item_name: string; // From JOIN
    borrower_name: string;
    borrower_nim: string;
    borrower_phone: string | null;
    purpose: string;
    quantity: number;
    borrow_date: string;
    return_date: string;
    status: BorrowingStatus;
    note: string | null;
    created_at: string;
    updated_at: string;
}

export type ItemState = {
    success: boolean;
    error: string;
    fieldErrors: {
        name?: string[];
        description?: string[];
        quantity?: string[];
        category?: string[];
        image?: string[];
    };
};

export type BorrowingState = {
    success: boolean;
    error: string;
    fieldErrors: {
        item_id?: string[];
        borrower_name?: string[];
        borrower_nim?: string[];
        borrower_phone?: string[];
        purpose?: string[];
        quantity?: string[];
        borrow_date?: string[];
        return_date?: string[];
    };
};
