import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/notifications - список уведомлений для текущего пользователя
export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Необходима авторизация" },
                { status: 401 }
            );
        }

        const notifications = await prisma.notification.findMany({
            where: {
                user_id: Number(currentUser.id),
            },
            orderBy: {
                created_at: "desc",
            },
        });

        return NextResponse.json(notifications);
    } catch (error) {
        console.error("[NOTIFICATIONS_GET]", error);
        return NextResponse.json(
            { error: "Ошибка при получении уведомлений" },
            { status: 500 }
        );
    }
}

// POST /api/notifications - создание уведомления
export async function POST(req: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Необходима авторизация" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { message, task_id, project_id, user_id } = body;

        if (!message || !user_id) {
            return NextResponse.json(
                { error: "message и user_id обязательны" },
                { status: 400 }
            );
        }

        const notification = await prisma.notification.create({
            data: {
                user_id,
                message,
                task_id,
                project_id,
            },
        });

        return NextResponse.json(notification);
    } catch (error) {
        console.error("[NOTIFICATION_CREATE]", error);
        return NextResponse.json(
            { error: "Ошибка при создании уведомления" },
            { status: 500 }
        );
    }
}
