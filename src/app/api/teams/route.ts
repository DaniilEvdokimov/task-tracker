import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getCurrentUser } from "@/lib/auth";
import {
    CreateTeamSchema,
    type CreateTeamInput,
} from "@/schemas/team";

// POST /api/teams - Создание новой команды
export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Необходима авторизация" },
                { status: 401 }
            );
        }

        const body = (await request.json()) as CreateTeamInput;
        const validation = CreateTeamSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { name, inviteEmails } = validation.data;

        // Создаем команду
        const team = await prisma.team.create({
            data: {
                name,
                created_by: Number(currentUser.id),
            },
        });

        // Добавляем создателя в команду
        await prisma.teamMember.create({
            data: {
                team_id: team.id,
                user_id: Number(currentUser.id),
            },
        });

        // Приглашаем пользователей по email (если они указаны)
        if (inviteEmails && inviteEmails.length > 0) {
            // Находим пользователей по email
            const usersToInvite = await prisma.user.findMany({
                where: {
                    email: { in: inviteEmails },
                },
            });

            // Добавляем найденных пользователей в команду
            await prisma.teamMember.createMany({
                data: usersToInvite.map((user) => ({
                    team_id: team.id,
                    user_id: user.id,
                })),
                skipDuplicates: true,
            });
        }

        return NextResponse.json(team, { status: 201 });
    } catch (error) {
        console.error("[TEAMS_POST]", error);
        return NextResponse.json(
            { error: "Ошибка при создании команды" },
            { status: 500 }
        );
    }
}

// GET api/teams - Получение списка команд пользователя
export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Необходима авторизация" },
                { status: 401 }
            );
        }

        // Получаем команды, где пользователь является участником
        const userTeams = await prisma.team.findMany({
            where: {
                OR: [
                    { created_by: Number(currentUser.id) }, // Команды, созданные пользователем
                    { members: { some: { user_id: Number(currentUser.id) } } }, // Команды, где пользователь участник
                ],
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        email: true,
                        avatar_url: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                surname: true,
                                email: true,
                                avatar_url: true,
                            },
                        },
                    },
                },
            },
        });

        // Преобразуем структуру ответа
        const transformedTeams = userTeams.map(team => ({
            id: team.id,
            name: team.name,
            created_at: team.created_at,
            created_by: team.createdBy,
            members: team.members.map(member => member.user)
        }));

        return NextResponse.json(transformedTeams);
    } catch (error) {
        console.error("[TEAMS_GET]", error);
        return NextResponse.json(
            { error: "Ошибка при получении списка команд" },
            { status: 500 }
        );
    }
}
