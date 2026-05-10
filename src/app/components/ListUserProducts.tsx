"use client";

import { useEffect, useState } from "react";

export default function ProductsClient() {
    const [userProducts, setUserProducts] = useState([]);
    const [valuations, setValuations] = useState<Record<string, any>>({});

    async function loadProducts() {
        const res = await fetch("/api/userProducts");
        const data = await res.json();
        setUserProducts(data);

        data.forEach((p: any) => {
            const name = p.product?.title;
            if (name) {
                fetchValuation(name, p.id);
            }
        });
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

    async function fetchValuation(name: string, id: string) {
        try {
            const res = await fetch(
                `/api/ebay/sold-price?q=${encodeURIComponent(name)}`
            );

            const data = await res.json();

            setValuations((prev) => ({
                ...prev,
                [id]: data.result,
            }));
        } catch (err) {
            console.error("valuation error", err);
        }
    }

    return (
        <div className="overflow-x-auto font-sans">
            <table className="min-w-full table-auto text-sm text-left border border-gray-500">
                <thead className="">
                    <tr className="bg-[#303030]">
                        <th className="px-4 py-3 border border-gray-500">Title</th>
                        <th className="px-4 py-3 border border-gray-500">Brand</th>
                        {/* <th className="px-4 py-3 border border-gray-500">Category</th> */}
                        <th className="px-4 py-3 border border-gray-500">Quantity</th>
                        <th className="px-4 py-3 border border-gray-500">Estimated Value</th>
                        <th className="px-4 py-3 border border-gray-500">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {userProducts.map((up: any) => (
                        <tr 
                            key={up.id}
                            className="hover:bg-[#303030]"
                        >
                            <td className="px-4 py-3 border border-gray-500">
                                {up.product?.title}
                            </td>
                            <td className="px-4 py-3 border border-gray-500">
                                {up.product?.brand}
                            </td>
                            {/* <td className="px-4 py-3 border border-gray-500">
                                {up.product?.category || "N/A"}
                            </td> */}
                            <td className="px-4 py-3 border border-gray-500">
                                {up.quantity}
                            </td>
                            <td className="px-4 py-3 border border-gray-500">
                                {valuations[up.id]?.average
                                    ? `$${valuations[up.id].average}`
                                    : "-"}
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
