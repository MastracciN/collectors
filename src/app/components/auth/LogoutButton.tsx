"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button 
            className="py-2 cursor-pointer w-full"
            onClick={() => signOut()}>
            Sign out
        </button>
    );
}