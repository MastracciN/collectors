"use client";

import { doesNotMatch } from "assert";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useState, useEffect, useRef } from "react";

type Props = {
    onScan: (code: string) => void;
};

// export default function BarcodeScanner({ onScan }: Props) {

export default function BarcodeScanner() {

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [lastScanned, setLastScanned] = useState("");
    const [scannerOpen, setScannerOpen] = useState(false);

    const lastScannedRef = useRef("");
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

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

        if (!scannerOpen) return;

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

        scannerRef.current = scanner;

        scanner.render(
            async (decodedText) => {

                if (decodedText === lastScannedRef.current) return;

                lastScannedRef.current = decodedText;

                await addProduct(decodedText);

                closeScanner();

            },
            (error) => {
                console.log(error);
            }
        );

        return () => {
            scanner.clear().catch(console.error);
        };
    }, [scannerOpen]);

    const closeScanner = async () => {
        setScannerOpen(false);

        if (scannerRef.current) {
            await scannerRef.current.clear().catch(console.error);
            scannerRef.current = null;
        }
    };

    return (
        <div className="font-sans">
            <button
                onClick={() => setScannerOpen(true)}
                className="px-4 py-2 rounded bg-[#4148ad] hover:bg-[#333888] transition-all duration-150 shadow-md hover:shadow-lg cursor-pointer"
            >
                Scan Barcode
            </button>

            {scannerOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-black w-full max-w-3xl h-screen md:h-[90vh] relative overflow-hidden">
                        <button
                            onClick={closeScanner}
                            className="absolute top-6 right-6 z-10 text-2xl cursor-pointer hover:opacity-50"
                        >
                            X
                        </button>

                        <div className="w-full h-full">
                            <div id="reader" className="w-full h-full"/>
                        </div>


                        {message && (
                            <p className="mt-2 text-center">
                                {message}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

