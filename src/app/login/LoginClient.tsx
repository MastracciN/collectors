"use client";

import { signIn } from "next-auth/react";

export default function LoginClient(){
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
                <h1 className="text-3xl">Login</h1>

                <button 
                    className="border-2 p-2 rounded-lg"
                    onClick={() => signIn("github")}
                >
                    Sign in with GitHub
                </button>
            </div>
        </div>
    );
}