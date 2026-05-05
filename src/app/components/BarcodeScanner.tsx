"use client";

import { doesNotMatch } from "assert";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useState, useEffect } from "react";

type Props = {
    onScan: (code: string) => void;
};

// export default function BarcodeScanner({ onScan }: Props) {

export default function BarcodeScanner() {

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [lastScanned, setLastScanned] = useState("");

    const addProduct = async (upc: string) => {
        if (!upc) {
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
                body: JSON.stringify({ upc: upc }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed");
            }

            window.dispatchEvent(new Event("product-added"));

            setMessage("Added");
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

                if (decodedText === lastScanned) return;

                setLastScanned(decodedText);

                await addProduct(decodedText);

            },
            (error) => {
                console.log(error);
            }
        );

        return () => {
            scanner.clear().catch(console.error);
        };
    }, []);

    return (
        <div className="w-full">
            <div id="reader" />
            {message && <p>{message}</p>}
        </div>
    );

}

