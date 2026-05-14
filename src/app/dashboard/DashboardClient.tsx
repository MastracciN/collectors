"use client";

import { useState, useEffect, useRef } from "react";
import LogoutButton from "../components/auth/LogoutButton";
import BarcodeScanner from "../components/BarcodeScanner";
import ListUserProducts from "../components/ListUserProducts";
import ProductForm from "../components/ProductForm";

export default function DashboardClient({ session }: any) {

    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="min-h-screen text-white flex flex-col bg-[#1f1f1f] font-sans">
            <div className="flex items-center space-x-2 justify-between p-4 border-b-2 border-[#4d4d4d]">
                <h1 className="text-xl">Dashboard</h1>
                <div className="flex items-center space-x-2">
                    <p>{session?.user?.name || session?.user?.email}</p>
                    <div className="relative" ref={menuRef}>
                        <img 
                            src={session?.user?.image ?? "images/avatar-placeholder.png"} 
                            alt="profile" 
                            className="w-12 h-12 rounded-full cursor-pointer"
                            onClick={() => setOpen(!open)}
                        />

                        {open && (
                            <div className="absolute right-1 top-14 bg-[#2a2a2a] border border-gray-600 rounded-lg shadow-lg w-50">
                                <LogoutButton/>
                            </div>
                        )}
                    </div>

                </div>
            </div>
            <div className="flex flex-col space-y-2">
                <div className="flex space-x-2 p-4">
                    <BarcodeScanner />
                    <ProductForm />
                </div>

                <ListUserProducts />
                
            </div>
        </div>
    );
}