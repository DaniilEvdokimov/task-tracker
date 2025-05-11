import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getCurrentUser } from "@/lib/auth";
import { UpdateTeamSchema } from "@/schemas/team";

// PATCH /api/teams/id - Обновление информации о команде
export async function PATCH(
    request: Request,
    { params }: { params: { teamId: string } }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Необходима авторизация" },
                { status: 401 }
            );
        }

        const teamId = parseInt(params.teamId);
        if (isNaN(teamId)) {
            return NextResponse.json({ error: "Неверный ID команды" }, { status: 400 });
        }

        // Проверяем, что пользователь является создателем команды
        const team = await prisma.team.findFirst({
            where: {
                id: teamId,
                created_by: Number(currentUser.id),
            },
        });

        if (!team) {
            return NextResponse.json(
                { error: "Команда не найдена или у вас нет прав на её изменение" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const validation = UpdateTeamSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { name } = validation.data;

        const updatedTeam = await prisma.team.update({
            where: { id: teamId },
            data: { name },
        });

        return NextResponse.json(updatedTeam);
    } catch (error) {
        console.error("[TEAM_PATCH]", error);
        return NextResponse.json(
            { error: "Ошибка при обновлении команды" },
            { status: 500 }
        );
    }
}

// GET /api/teams/id - Получение информации о команде
export async function GET(
    request: Request,
    { params }: { params: { teamId: string } }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Необходима авторизация" },
                { status: 401 }
            );
        }

        const teamId = parseInt(params.teamId);
        if (isNaN(teamId)) {
            return NextResponse.json({ error: "Неверный ID команды" }, { status: 400 });
        }

        // Проверяем, что пользователь является участником команды
        const isTeamMember = await prisma.teamMember.findFirst({
            where: {
                team_id: teamId,
                user_id: Number(currentUser.id),
            },
        });

        if (!isTeamMember) {
            return NextResponse.json(
                { error: "Команда не найдена или у вас нет прав для просмотра" },
                { status: 403 }
            );
        }

        // Получаем информацию о команде с участниками
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        email: true,
                        avatar_url: true
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                surname: true,
                                email: true,
                                avatar_url: true
                            }
                        }
                    }
                },
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true,
                        due_date: true
                    }
                }
            }
        });

        if (!team) {
            return NextResponse.json(
                { error: "Команда не найдена" },
                { status: 404 }
            );
        }

        // Форматируем ответ для удобства
        const formattedTeam = {
            id: team.id,
            name: team.name,
            createdAt: team.created_at,
            createdBy: team.createdBy,
            members: team.members.map(member => ({
                id: member.user.id,
                name: member.user.name,
                surname: member.user.surname,
                email: member.user.email,
                avatarUrl: member.user.avatar_url
            })),
            tasks: team.tasks
        };

        return NextResponse.json(formattedTeam);
    } catch (error) {
        console.error("[TEAM_GET]", error);
        return NextResponse.json(
            { error: "Ошибка при получении информации о команде" },
            { status: 500 }
        );
    }
}

// DELETE api/teams/id - Удаление команды
export async function DELETE(
    request: Request,
    { params }: { params: { teamId: string } }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Необходима авторизация" },
                { status: 401 }
            );
        }

        const teamId = parseInt(params.teamId);
        if (isNaN(teamId)) {
            return NextResponse.json({ error: "Неверный ID команды" }, { status: 400 });
        }

        // Проверяем, что пользователь является создателем команды
        const team = await prisma.team.findFirst({
            where: {
                id: teamId,
                created_by: Number(currentUser.id),
            },
        });

        if (!team) {
            return NextResponse.json(
                { error: "Команда не найдена или у вас нет прав на её удаление" },
                { status: 403 }
            );
        }

        await prisma.team.delete({
            where: { id: teamId },
        });

        return NextResponse.json(
            { message: "Команда успешно удалена" },
            { status: 200 }
        );
    } catch (error) {
        console.error("[TEAM_DELETE]", error);
        return NextResponse.json(
            { error: "Ошибка при удалении команды" },
            { status: 500 }
        );
    }
}
