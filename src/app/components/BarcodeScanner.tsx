"use client";

import { doesNotMatch } from "assert";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useState, useEffect } from "react";

type Props = {
    onScan: (code: string) => void;
};

// export default function BarcodeScanner({ onScan }: Props) {

export default function BarcodeScanner() {

    const [upc, setUpc] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const addProduct = async (barcode: string) => {
        if (!barcode) {
            setMessage("Scan a barcode");
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

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: {
                    width: 250,
                    height: 120,
                },
                aspectRatio: 1.777778,
                videoConstraints: {
                    facingMode: "environment",
                },
            },
            false
        );

        scanner.render(
            async (decodedText) => {
                setUpc(decodedText);

                // onScan(decodedText);

                await addProduct(decodedText);

                scanner.clear().catch(console.error);
            },
            (error) => {
                console.log(error);
            }
        );

        return () => {
            scanner.clear().catch(console.error);
        };
    // }, [onScan]);
    });

    return (
        <div className="w-full">
            <div id="reader" />
        </div>
    );

}

