import NextAuth from "next-auth";
import { authOptions } from "@/auth";
import GitHubProvider from "next-auth/providers/github";

// const handler = NextAuth({
//     providers: [
//         GitHubProvider({
//             clientId: process.env.GITHUB_ID!,
//             clientSecret: process.env.GITHUB_SECRET!,
//         }),
//     ],
//     session: {
//         strategy:"database",
//     },
// });

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST};