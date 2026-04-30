"use client";

import { useState } from "react";

export default function ProductForm() {
    const [formData, setFormData] = useState({
        title: "",
        brand: "",
        category: "",
        quantity: 1,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const addProduct = async () => {
        if (!formData.title) {
            setMessage("Enter a Title");
            return;
        }
        if (!formData.brand) {
            setMessage("Enter a Brand");
            return;
        }
        if (!formData.category) {
            setMessage("Enter a Category");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const res = await fetch("/api/products/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed");
            }

            window.dispatchEvent(new Event("product-added"));

            setMessage("Added");
            setFormData({
                title: "",
                brand: "",
                category: "",
                quantity: 1,
            })

        } catch (err: any){
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        await addProduct();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 p-4"
        >
            <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                className="rounded-lg border px-3 py-2"
            />

            <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Brand"
                className="rounded-lg border px-3 py-2"
            />

            <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                className="rounded-lg border px-3 py-2"
            />

            <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min={1}
                className="rounded-lg border px-3 py-2"
            />

            <button 
                type="submit"
                disabled={loading}
                className="rounded-lg px-4 py-2 text-white bg-green-500"
            >
                {loading ? "Adding..." : "Add New Item"}
            </button>

            {message && (
                <p className="text-sm">{message}</p>
            )}

        </form>
    )
}