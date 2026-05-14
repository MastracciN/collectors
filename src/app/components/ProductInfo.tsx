"use client";

import Image from "next/image";
import { useEffect } from "react";

type SideMenuProps = {
    open: boolean;
    onClose: () => void;
}

export default function ProductInfo({ userProduct , valuation, open, onClose}: { userProduct: any} & { valuation: any} & SideMenuProps) {

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
        }, [open]);

    return (
        <>
            {open && (
                <div 
                    className='fixed inset-0 bg-black/40 z-40'
                    onClick={onClose}
                />
            )}

            <div
                className={`fixed right-0 top-0 z-50 flex h-full w-full overflow-y-auto md:max-w-5/6 lg:max-w-4/6 xl:max-w-2/6 transform 
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

                {/* <Image
                    src={userProduct.product.images?.[0] ?? "/images/avatar-placeholder.png"}
                    alt={userProduct.product?.title ?? "Product image"}
                    width={450}
                    height={450}
                /> */}
                <img 
                    src={userProduct.product.images?.[0] ?? "/images/avatar-placeholder.png"}
                    width={450}
                    height={450}
                    className="mx-auto"
                    alt={userProduct.product?.title ?? "Product image"}
                    onError={(e) => {
                        e.currentTarget.src="images/avatar-placeholder.png";
                    }}
                />

                <div className='p-4 grid grid-cols-[100px_1fr] gap-y-3 gap-x-4 border-b border-b-gray-500'>
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

                <div className="p-4 text-2xl">eBay Listing Stats</div>
                <div className="p-4 grid grid-cols-[250px_1fr] gap-y-3 gap-x-4 border-b-gray-500">
                    <p>Number of listings</p>
                    <p>{valuation?.sampleSize != null
                        ? `$${valuation.sampleSize}`
                        : "N/A"}
                    </p>

                    <p>eBay Average Listing Price</p>
                    <p>{valuation?.average != null
                        ? `$${valuation.average}`
                        : "N/A"}
                    </p>

                    <p>eBay Minimum Listing Price</p>
                    <p>{valuation?.min != null
                        ? `$${valuation.min}`
                        : "N/A"}
                    </p>

                    <p>eBay Maximum Listing Price</p>
                    <p>{valuation?.max != null
                        ? `$${valuation.max}`
                        : "N/A"}
                    </p>

                    
                </div>


            </div>
        </>
    )
}