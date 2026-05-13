"use client";

import { useState } from "react";
import AddProductButton from "./AddProductButton";

export default function ProductForm() {
    const [open, setOpen] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [prodInfoOpen, setProdInfoOpen] = useState(false);

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
        if (!enabled)
            setOpen(false);
    }

    return (
        <div className="font-sans">
            <button
                onClick={() => setOpen(true)}
                className="bg-[#498350] p-2 rounded hover:bg-[#3b6841] transition-all duration-150 shadow-md hover:shadow-lg cursor-pointer"
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
                <div className="p-4 pt-8 text-4xl border-b border-[#4d4d4d]">Add Items</div>
                <div className="p-4 text-2xl">
                    Add Item via UPC
                </div>
                <div className="border-b border-[#4d4d4d] pb-4">
                    <AddProductButton />
                </div>
                <div className="p-4 text-2xl">
                    Add Manually
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

                    <label className="inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={enabled} 
                            className="sr-only peer" 
                            onChange={(e) => {
                                setEnabled(e.target.checked);
                                console.log(e.target.checked);
                            }}
                        />
                        <div className="relative w-9 h-5 bg-neutral-quaternary peer-focus:outline-none 
                        peer-focus:ring-4 peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft 
                        rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                        peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
                        after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                        <span className="select-none ms-3 text-sm font-medium text-heading">Create More</span>
                    </label>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 text-white bg-[#498350] p-2 rounded hover:bg-[#3b6841] transition-all duration-150 shadow-md hover:shadow-lg cursor-pointer"
                        >
                            {loading ? "Adding..." : "Add New Item"}
                        </button>

                        <button
                            className="flex-1 bg-[#7c2727] p-2 rounded hover:bg-[#581c1c] transition-all duration-150 shadow-md hover:shadow-lg cursor-pointer"
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