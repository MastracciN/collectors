import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET() {
    const session = await getServerSession(authOptions);

    const userProducts = await prisma.userProduct.findMany({
        where: {
            userId: session?.user.id,
        },
        include: {
            product: true,
        },
    });
    return Response.json(userProducts);
}