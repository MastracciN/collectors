"use client";

import { useState } from 'react';

type SideMenuProps = {
    open: boolean;
    onClose: () => void;
}

export default function ProductInfo({ userProduct , open, onClose}: { userProduct: any} & SideMenuProps) {
    // const [open, setOpen] = useState(false);

    return (
        <>
            {open && (
                <div 
                    className='fixed inset-0 bg-black/40 z-40'
                    onClick={onClose}
                />
            )}

            <div
                className={`fixed right-0 top-0 z-50 flex h-full w-full md:max-w-5/6 lg:max-w-4/6 xl:max-w-2/6 transform 
                    flex-col bg-[#1f1f1f] shadow-2xl transition-transform duration-300
                ${ open 
                    ? "translate-x-0" 
                    : "translate-x-full"
                }`}
            >
                <div className="p-4 pt-8 text-4xl border-b border-[#4d4d4d]">Product Info</div>
            </div>
        </>
    )
}