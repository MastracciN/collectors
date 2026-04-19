"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button 
            className="border-2 rounded-lg p-2"
            onClick={() => signOut()}>
            Logout
        </button>
    );
}