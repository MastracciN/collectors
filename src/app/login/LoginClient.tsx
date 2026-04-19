"use client";

import { signIn } from "next-auth/react";

export default function LoginClient(){
    return (
        <div>
            <h1>Login</h1>

            <button onClick={() => signIn("github")}>
                Sign in with GitHub
            </button>
        </div>
    );
}