"use client";

import { useState } from "react";
import BarcodeScanner from "./BarcodeScanner";

export default function AddProductButton() {
    const [upc, setUpc] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const addProduct = async () => {
        if (!upc) {
            setMessage("Enter a UPC");
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
                body: JSON.stringify({ upc }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed");
            }

            window.dispatchEvent(new Event("product-added"));

            setMessage("Added");
            setUpc("");
        } catch (err: any){
            setMessage(`${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-3 p-4">
            <input
                type="text"
                placeholder="Enter UPC"
                value={upc}
                onChange={(e) => setUpc(e.target.value)}
                className="border px-3 py-2 rounded w-64"
            />

            <button
                onClick={addProduct}
                disabled={loading}
                className="px-4 py-2 bg-[#498350] rounded hover:bg-[#3b6841] transition-all duration-150 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
            >
                {loading ? "Adding..." : "Add"}
            </button>

            {message && <p className="text-sm">{message}</p>}

            {/* <BarcodeScanner onScan={(code) => setUpc(code)} /> */}
        </div>
    );
}