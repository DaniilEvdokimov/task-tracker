import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import {getCurrentUser} from "@/lib/auth";

// GET /api/users - список пользователей
export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Необходима авторизация" },
                { status: 401 }
            );
        }

        const users = await prisma.user.findMany({
            orderBy: {
                created_at: 'desc'
            },
            select: {
                id: true,
                name: true,
                surname: true,
                email: true,
                login: true,
                avatar_url: true,
                created_at: true
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("[USERS_GET]", error);
        return NextResponse.json({ error: "Ошибка при получении пользователей" }, { status: 500 });
    }
}
