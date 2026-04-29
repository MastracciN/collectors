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
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm text-left border border-gray-500">
                <thead className="">
                    <tr>
                        <th className="px-4 py-3 border border-gray-500">Title</th>
                        <th className="px-4 py-3 border border-gray-500">Brand</th>
                        <th className="px-4 py-3 border border-gray-500">Category</th>
                        <th className="px-4 py-3 border border-gray-500">Quantity</th>
                        <th className="px-4 py-3 border border-gray-500">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {userProducts.map((up: any) => (
                        <tr 
                            key={up.id}
                            className="hover:bg-gray-800"
                        >
                            <td className="px-4 py-3 border border-gray-500">
                                {up.product?.title}
                            </td>
                            <td className="px-4 py-3 border border-gray-500">
                                {up.product?.brand}
                            </td>
                            <td className="px-4 py-3 border border-gray-500">
                                {up.product?.category || "N/A"}
                            </td>
                            <td className="px-4 py-3 border border-gray-500">
                                {up.quantity}
                            </td>
                            <td className="px-4 py-3 border border-gray-500">
                                <button 
                                    onClick={() => deleteProduct(up.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
