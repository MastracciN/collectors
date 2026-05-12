"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    return (
        <button 
            className="flex items-center gap-2 p-2 cursor-pointer w-full hover:opacity-50"
            onClick={() => signOut()}
        >
            <LogOut size={20}/>
            Sign out
        </button>
    );
}