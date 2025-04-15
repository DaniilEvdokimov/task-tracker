import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import {getCurrentUser} from "@/lib/auth";

// GET /api/users/:id - информация о конкретном пользователе
export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Необходима авторизация" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(params.id) },
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

        if (!user) {
            return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("[USER_GET]", error);
        return NextResponse.json({ error: "Ошибка при получении пользователя" }, { status: 500 });
    }
}

// PUT /api/users/:id - обновление данных пользователя
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Необходима авторизация" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { name, surname, email, login, avatar_url } = body;

        const updatedUser = await prisma.user.update({
            where: { id: Number(params.id) },
            data: { name, surname, email, login, avatar_url }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[USER_UPDATE]", error);
        return NextResponse.json({ error: "Ошибка при обновлении пользователя" }, { status: 500 });
    }
}

// DELETE /api/users/:id - удаление пользователя
export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Необходима авторизация" },
                { status: 401 }
            );
        }

        await prisma.user.delete({ where: { id: Number(params.id) } });
        return NextResponse.json({ message: "Пользователь удалён" });
    } catch (error) {
        console.error("[USER_DELETE]", error);
        return NextResponse.json({ error: "Ошибка при удалении пользователя" }, { status: 500 });
    }
}
