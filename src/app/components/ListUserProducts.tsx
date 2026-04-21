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

    return (
        <div>
            {userProducts.map((up: any) => (
                <div key={up.id}>{up.product?.title}</div>
            ))}
        </div>
    );
}
