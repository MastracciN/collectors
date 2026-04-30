"use client";

import { useState } from "react";

export default function ProductForm() {
    const [formData, setFormData] = useState({
        title: "",
        brand: "",
        category: "",
        quantity: 1,
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    }

    async function handleSubmit(e: any) {
        e.preventDefault();

        console.log(formData);
    }

    return (
        <form
            onSubmit={(e) => handleSubmit(e.nativeEvent)}
            className="space-y-4"
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
                className="rounded-lg px-4 py-2 text-white bg-black"
            >
                Add New Item
            </button>

            

        </form>
    )
}