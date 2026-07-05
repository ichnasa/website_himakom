import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { protectedRoutesPrefixes } from "./app/config/sidebar";

const protectedRoutes = ['/dashboard'];
const unprotectedRoutes = ['/login', '/event']

export function proxy(request: NextRequest) {
    const token = request.cookies.get('jwt_token')?.value;
    const { pathname } = request.nextUrl;

    if(!token && protectedRoutes.some(route => pathname.startsWith(route))) {
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

