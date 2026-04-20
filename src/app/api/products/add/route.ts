import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const { upc } = await req.json();

        if (!upc) {
            return NextResponse.json({ error: "UPC required" }, { status: 400 });
        }

        // Find User
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found"}, { status: 404 });
        }

        // Check if product already exists
        let product = await prisma.product.findUnique({
            where: { upc },
        });

        // If not, fetch from UPCitemdb
        if (!product) {
            const res = await fetch("https://api.upcitemdb.com/prod/trial/lookup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ upc }),
            });

            const data = await res.json();
            const item = data.items?.[0];

            if (!item) {
                return NextResponse.json({ error: "Product not found" }, { status: 404 });
            }

            product = await prisma.product.create({
                data: {
                    upc: item.upc,
                    title: item.title,
                    brand: item.brand,
                    category: item.category,
                    images: item.images || [],
                },
            });
        }

        const userProduct = await prisma.userProduct.upsert({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId: product.id,
                },
            },
            update: {
                quantity: { increment: 1 },
            },
            create: {
                userId: user.id,
                productId: product.id,
                quantity: 1,
            },
        });

        return NextResponse.json({ success: true, userProduct });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

