import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET(req: Request, { params }: { params: {id: string}}) {
    const session = await getServerSession(authOptions);

    const id = params.id;

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
    { params }: { params: {id: string }}
) {
    const session = await getServerSession(authOptions);

    const id = params.id;

    const result = await prisma.userProduct.delete({
        where: {
            id,
            userId: session?.user.id,
        },
    });

    if (!result) {
        return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ message: "Deleted successfully" });
}