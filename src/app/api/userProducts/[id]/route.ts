import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET(req: Request, { params }: { params: { id: string }}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.userProduct.findFirst({
        where: {
            id,
            userId: session?.user.id,
        },
        include: {
            product: true,
        },
    });

    if (!product) {
        return Response.json({ error: "Not found" }, { status: 404 });
    }
    
    return Response.json(product);
}

export async function DELETE (
    req: Request,
    { params }: { params: { id: string }}
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const item = await prisma.userProduct.findFirst({
        where: {
            id,
            userId: session.user.id,
        }
    })

    if (!item) {
        return Response.json({ error: "Not found or not allowed" }, { status: 404 });
    }

    await prisma.userProduct.delete({
        where: {
            id,
        },
    });

    return Response.json({ message: "Deleted successfully" });
}

export async function PATCH (
    req: Request,
    { params }: { params: { id: string }}
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body = await req.json();
    const { quantity } = body;

    if (typeof quantity !== "number" || quantity < 1) {
        return Response.json(
            { error: "Quantity must be a positive number" },
            { status: 400 }
        );
    }

    const item = await prisma.userProduct.findFirst({
        where: {
            id,
            userId: session.user.id,
        },
    });

    if (!item) {
        return Response.json({ error: "Not found or not allowed" }, { status: 404 });
    }

    const updated = await prisma.userProduct.update({
        where: {
            id,
        },
        data: {
            quantity,
        }
    });

    return Response.json(updated)
}