import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import {getCurrentUser} from "@/lib/auth";
import bcrypt from "bcryptjs";

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
        const {
            name,
            surname,
            email,
            login,
            avatar_url,
            currentPassword,
            newPassword
        } = body;

        const existingUser = await prisma.user.findUnique({
            where: { id: Number(params.id) },
        });

        if (!existingUser) {
            return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
        }

        let pass_hash = existingUser.pass_hash;

        if (newPassword) {
            const isPasswordCorrect = await bcrypt.compare(currentPassword, existingUser.pass_hash);
            if (!isPasswordCorrect) {
                return NextResponse.json(
                  { error: "Неверный текущий пароль" },
                  { status: 400 }
                );
            }
            pass_hash = await bcrypt.hash(newPassword, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(params.id) },
            data: {
                name,
                surname,
                email,
                login,
                avatar_url,
                pass_hash,
            },
        });

        const { pass_hash: _, ...sanitizedUser } = updatedUser;
        return NextResponse.json(sanitizedUser);
    } catch (error) {
        console.error("[USER_UPDATE]", error);
        return NextResponse.json(
          { error: "Ошибка при обновлении пользователя" },
          { status: 500 }
        );
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
