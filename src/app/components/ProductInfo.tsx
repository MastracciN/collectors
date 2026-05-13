"use client";

import { useState } from 'react';

type SideMenuProps = {
    open: boolean;
    onClose: () => void;
}

export default function ProductInfo({ userProduct , open, onClose}: { userProduct: any} & SideMenuProps) {

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
                <div className='relative'>
                    <div className="p-4 pt-8 text-4xl border-b border-[#4d4d4d]">Product Info</div>
                    <div
                        className='absolute top-10 right-5 text-2xl cursor-pointer hover:opacity-75'
                        onClick={onClose}
                    >
                        X
                    </div>
                </div>
                <div className='p-4 grid grid-cols-[100px_1fr] gap-y-3 gap-x-4'>
                    <p>Title</p>
                    <p>{userProduct.product?.title}</p>

                    <p>UPC</p>
                    <p>{userProduct.product?.upc}</p>

                    <p>Brand</p>
                    <p>{userProduct.product?.brand}</p>

                    <p>Category</p>
                    <p>{userProduct.product?.category}</p>

                    <p>Quantity</p>
                    <p>{userProduct.quantity}</p>
                </div>
            </div>
        </>
    )
}