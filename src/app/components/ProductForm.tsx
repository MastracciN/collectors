"use client";

import { useState } from "react";

export default function ProductForm() {
    const [open, setOpen] = useState(false);

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
        <div>
            <button
                onClick={() => setOpen(true)}
                className="bg-green-600 p-2 rounded-lg"
            >
                Add Item Manually
            </button>

            <div
                className={`fixed inset-0 z-50 bg-black/40  transition-opacity duration-300
                    ${ open 
                        ? "pointer-events-auto opacity-100" 
                        : "pointer-events-none opacity-0"

                    }`}
                    onClick={() => setOpen(false)}
            >
            </div>

            <div
                className={`fixed right-0 top-0 z-50 flex h-full w-full md:max-w-5/6 lg:max-w-4/6 xl:max-w-2/6 transform 
                    flex-col bg-[#1f1f1f] shadow-2xl transition-transform duration-300
                ${ open 
                    ? "translate-x-0" 
                    : "translate-x-full"
                }`}
            >
                <div className="p-4 text-2xl">
                    Add Item
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 p-4 flex flex-col"
                >
                    <label>Title</label>
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

                    <div className="flex space-x-2 py-2">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-lg py-2 text-white bg-green-500"
                        >
                            {loading ? "Adding..." : "Add New Item"}
                        </button>

                        <button
                            className="flex-1 bg-red-600 rounded-lg"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>


                    {message && (
                        <p className="text-sm">{message}</p>
                    )}

                </form>

            </div>
        </div>

    )
}