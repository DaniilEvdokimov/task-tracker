import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// DELETE /api/notifications/:id - удаление уведомления
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

        await prisma.notification.delete({
            where: {
                id: Number(params.id),
                user_id: Number(currentUser.id),
            },
        });

        return NextResponse.json({ message: "Уведомление удалено" });
    } catch (error) {
        console.error("[NOTIFICATION_DELETE]", error);
        return NextResponse.json(
            { error: "Ошибка при удалении уведомления" },
            { status: 500 }
        );
    }
}
