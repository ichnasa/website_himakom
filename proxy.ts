import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getModulesAction } from "./app/action/sidebar/action";

const unprotectedRoutes = ['/login', '/event']

export async function proxy(request: NextRequest) {
    const modules = await getModulesAction();
    const protectedRoutes = modules.map((module) => {
        return module.href;
    })
    const allowedRoutes = modules.filter((module) => module.is_active === 1);

    const token = request.cookies.get('jwt_token')?.value;
    const { pathname } = request.nextUrl;

    if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/peminjaman-barang/:path*',
        '/fitur/:path*',
        '/pengaturan/:path*',
    ],
}

