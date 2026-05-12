"use client";

import { UserProduct } from "@prisma/client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function ProductsClient() {
    const [userProducts, setUserProducts] = useState<UserProduct[]>([]);
    const [valuations, setValuations] = useState<Record<string, any>>({});
    const [search, setSearch] = useState("");

    const filteredProducts = userProducts.filter((up: any) =>
        up.product?.title.toLowerCase().includes(search.toLowerCase()) ||
        up.product?.brand.toLowerCase().includes(search.toLowerCase()) ||
        String(up.quantity).includes(search)
    );

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

            <div className="relative w-full">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2"/>
                <input 
                    type="text" 
                    placeholder="Search products" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-500 focus:outline-none"
                />

            </div>
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
                    {filteredProducts.map((up: any) => (
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
                                    className="px-3 py-1 rounded bg-[#9e0303] hover:opacity-75 transition-all duration-150 shadow-md hover:shadow-lg cursor-pointer"
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
