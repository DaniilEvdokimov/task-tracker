import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getCurrentUser } from "@/lib/auth";
import {AddTeamMemberSchema} from "@/schemas/team";

// PATCH /api/teams/id/members - Добавление участника в команду по email
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
        const validation = AddTeamMemberSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { email } = validation.data;

        // Ищем пользователя по email
        const userToAdd = await prisma.user.findUnique({
            where: { email },
        });

        if (!userToAdd) {
            return NextResponse.json(
                { error: "Пользователь с таким email не найден" },
                { status: 404 }
            );
        }

        // Проверяем, что пользователь ещё не в команде
        const existingMember = await prisma.teamMember.findFirst({
            where: {
                team_id: teamId,
                user_id: userToAdd.id,
            },
        });

        if (existingMember) {
            return NextResponse.json(
                { error: "Пользователь уже является участником команды" },
                { status: 400 }
            );
        }

        // Добавляем пользователя в команду
        const newMember = await prisma.teamMember.create({
            data: {
                team_id: teamId,
                user_id: userToAdd.id,
            },
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
        });

        return NextResponse.json(newMember);
    } catch (error) {
        console.error("[TEAM_MEMBER_ADD]", error);
        return NextResponse.json(
            { error: "Ошибка при добавлении участника в команду" },
            { status: 500 }
        );
    }
}


// DELETE /api/teams/id/members/userId - Удаление участника из команды
export async function DELETE(
    request: Request,
    { params }: { params: { teamId: string; userId: string } }
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
        const userId = parseInt(params.userId);
        if (isNaN(teamId) || isNaN(userId)) {
            return NextResponse.json(
                { error: "Неверный ID команды или пользователя" },
                { status: 400 }
            );
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

        // Проверяем, что пользователь не пытается удалить себя
        if (userId === Number(currentUser.id)) {
            return NextResponse.json(
                { error: "Вы не можете удалить себя из команды" },
                { status: 400 }
            );
        }

        // Удаляем участника из команды
        await prisma.teamMember.deleteMany({
            where: {
                team_id: teamId,
                user_id: userId,
            },
        });

        return NextResponse.json(
            { message: "Участник успешно удалён из команды" },
            { status: 200 }
        );
    } catch (error) {
        console.error("[TEAM_MEMBER_DELETE]", error);
        return NextResponse.json(
            { error: "Ошибка при удалении участника из команды" },
            { status: 500 }
        );
    }
}
