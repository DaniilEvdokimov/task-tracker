import { cookies } from "next/headers";
import { verifyJwt } from "./jwt";
import prisma from '@/lib/prisma';

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    try {
        const payload = verifyJwt(token); // декодирование токена
        if (!payload || typeof payload === "string") return null;

        const user = await prisma.user.findUnique({
            where: { id: payload.userId }
        });

        return user;
    } catch {
        return null;
    }
}
