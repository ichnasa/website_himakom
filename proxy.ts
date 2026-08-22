import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyJWT } from "./app/utils/auth";
import Database from "better-sqlite3";

export async function proxy(request: NextRequest) {
    const token = request.cookies.get('jwt_token')?.value;
    const { pathname } = request.nextUrl;

    const isLoginPage = pathname === '/login';
    const isNoAccessPage = pathname === '/no-access';

    // /no-access is always allowed for authenticated users (avoid redirect loop)
    if (isNoAccessPage) {
        if (!token) return NextResponse.redirect(new URL('/login', request.url));
        return NextResponse.next();
    }

    // Not logged in → redirect to login for protected routes
    if (!token) {
        if (!isLoginPage) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    // Verify JWT
    const payload = await verifyJWT(token);
    if (!payload) {
        const resp = NextResponse.redirect(new URL('/login', request.url));
        resp.cookies.delete('jwt_token');
        return resp;
    }

    // Already logged in → redirect away from login
    if (isLoginPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    const role = payload.role as string;
    const username = payload.username as string;

    // admin & super_admin have full access
    if (role === 'admin' || role === 'super_admin') {
        return NextResponse.next();
    }

    // For pengguna role: check group-based module access
    const db = new Database('local.db');
    try {
        // Get all modules this user can access via their groups
        const accessibleModules = db.prepare(`
            SELECT DISTINCT m.href
            FROM module m
            JOIN group_module gm ON gm.module_id = m.id
            JOIN user_group ug ON ug.group_id = gm.group_id
            JOIN user u ON u.id = ug.user_id
            WHERE u.username = ? AND m.is_active = 1
        `).all(username) as { href: string }[];

        const accessibleHrefs = accessibleModules.map(m => m.href);
        const hasAccess = accessibleHrefs.some(href => pathname.startsWith(href));

        if (!hasAccess) {
            return NextResponse.redirect(new URL('/no-access', request.url));
        }
    } finally {
        db.close();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/login',
        '/no-access',
        '/dashboard/:path*',
        '/kalender/:path*',
        '/feedback/:path*',
        '/peminjaman-barang/:path*',
        '/fitur/:path*',
        '/pengaturan/:path*',
        '/pengguna/:path*',
        '/groups/:path*',
    ],
}
