import { NextResponse } from "next/server";

export async function middleware(req: any) {
    const sessionCookie = req.cookies.get("next-auth.session-token");

    const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
    // const isLogin = req.nextUrl.pathname.startsWith("/login");

    if (!sessionCookie && isDashboard) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // if (sessionCookie && isLogin) {
    //     return NextResponse.redirect(new URL("/dashboard", req.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/login",
    ],
    // matcher : [],
};