import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
    const token = await getToken({ req });

    const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

    if (!token && isDashboard) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};