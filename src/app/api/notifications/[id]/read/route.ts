import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// PUT /api/notifications/:id/read - пометка как прочитанного
export async function PUT(
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

        const notification = await prisma.notification.update({
            where: {
                id: Number(params.id),
                user_id: Number(currentUser.id),
            },
            data: {
                is_read: true,
            },
        });

        return NextResponse.json(notification);
    } catch (error) {
        console.error("[NOTIFICATION_READ]", error);
        return NextResponse.json(
            { error: "Ошибка при пометке уведомления" },
            { status: 500 }
        );
    }
}
