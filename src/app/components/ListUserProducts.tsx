"use client";

import { useEffect, useState } from "react";

export default function ProductsClient() {
    const [userProducts, setUserProducts] = useState([]);

    async function loadProducts() {
        const res = await fetch("/api/userProducts");
        const data = await res.json();
        setUserProducts(data);
    }

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        const handler = () => loadProducts();

        window.addEventListener("product-added", handler);
        return () => window.removeEventListener("product-added", handler);
    }, []);

    async function deleteProduct(id: string) {
        const res = await fetch(`/api/userProducts/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            setUserProducts(prev => prev.filter((p: any) => p.id !== id));
        } 
    }

    return (
        <div className="flex flex-col gap-4">
            {userProducts.map((up: any) => (
                <div 
                    key={up.id}
                >
                    {/* <img 
                        src={up.product?.image?.[0]}
                        alt={up.product?.title}
                        className="w-12 h-12 object-contain rounded"    
                    /> */}
                    {up.product?.title}
                    {up.product?.upc}
                    <button 
                        onClick={() => deleteProduct(up.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}
