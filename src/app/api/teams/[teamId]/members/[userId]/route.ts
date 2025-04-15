import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getCurrentUser } from "@/lib/auth";

// DELETE /api/teams/[teamId]/members/[userId]/
export async function DELETE(
    request: Request,
    { params }: { params: { teamId: string; userId: string } }
) {
    try {
        // 1. Проверка аутентификации
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Требуется авторизация" },
                { status: 401 }
            );
        }

        // 2. Валидация параметров
        const teamId = parseInt(params.teamId);
        const userId = parseInt(params.userId);

        if (isNaN(teamId) || isNaN(userId)) {
            return NextResponse.json(
                { error: "Некорректные ID команды или пользователя" },
                { status: 400 }
            );
        }

        // 3. Проверка прав (только создатель команды может удалять участников)
        const team = await prisma.team.findFirst({
            where: {
                id: teamId,
                created_by: Number(currentUser.id),
            },
        });

        if (!team) {
            return NextResponse.json(
                { error: "Команда не найдена или у вас нет прав" },
                { status: 403 }
            );
        }

        // 4. Проверка, что пользователь не пытается удалить себя
        if (userId === Number(currentUser.id)) {
            return NextResponse.json(
                { error: "Вы не можете удалить себя из команды" },
                { status: 400 }
            );
        }

        // 5. Проверка, что пользователь состоит в команде
        const teamMember = await prisma.teamMember.findFirst({
            where: {
                team_id: teamId,
                user_id: userId,
            },
        });

        if (!teamMember) {
            return NextResponse.json(
                { error: "Пользователь не является участником команды" },
                { status: 404 }
            );
        }

        // 6. Удаление участника
        await prisma.teamMember.delete({
            where: {
                id: teamMember.id,
            },
        });

        // 7. Успешный ответ
        return NextResponse.json(
            {
                success: true,
                message: "Участник успешно удалён из команды",
                deletedUserId: userId
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("[TEAM_MEMBER_DELETE_ERROR]", error);
        return NextResponse.json(
            {
                error: "Ошибка при удалении участника из команды",
                details: error instanceof Error ? error.message : "Неизвестная ошибка"
            },
            { status: 500 }
        );
    }
}
