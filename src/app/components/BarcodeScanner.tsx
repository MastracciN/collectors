"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

type Props = {
    onScan: (code: string) => void;
};

export default function BarcodeScanner({ onScan }: Props) {
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
            (decodedText) => {
                onScan(decodedText);

                scanner.clear().catch(console.error);
            },
            (error) => {
                console.log(error);
            }
        );

        return () => {
            scanner.clear().catch(console.error);
        };
    }, [onScan]);

    return (
        <div className="w-full">
            <div id="reader" />
        </div>
    );

}

