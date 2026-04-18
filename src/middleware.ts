import { auth } from "@/auth";

export default auth ((req: any) => {
    if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
        return Response.redirect(new URL("/login", req.url));
    }
});

export const config = {
    matcher: ["/dashboard/:path*"],
};