import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { CreateProjectSchema, type CreateProjectInput } from "@/schemas/project";

// POST /api/projects - создание проекта
export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
        }

        const body = (await request.json()) as CreateProjectInput;
        const validation = CreateProjectSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
        }

        const project = await prisma.project.create({
            data: {
                name: validation.data.name,
                created_by: Number(currentUser.id),
            },
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error("[PROJECTS_POST]", error);
        return NextResponse.json({ error: "Ошибка при создании проекта" }, { status: 500 });
    }
}

// GET /api/projects - список проектов пользователя
export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
        }

        // Получаем ID всех команд, в которых состоит пользователь
        const userTeamMemberships = await prisma.teamMember.findMany({
            where: {
                user_id: Number(currentUser.id),
            },
            select: {
                team_id: true,
            },
        });

        const teamIds = userTeamMemberships.map((m) => m.team_id);

        // Получаем проекты, если:
        // - созданы пользователем
        // - относятся к задачам, входящим в одну из команд пользователя
        const projects = await prisma.project.findMany({
            where: {
                OR: [
                    { created_by: Number(currentUser.id) },
                    {
                        tasks: {
                            some: {
                                team_id: { in: teamIds },
                            },
                        },
                    },
                ],
            },
            include: {
                tasks: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        email: true,
                        avatar_url: true,
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.error("[PROJECTS_GET]", error);
        return NextResponse.json({ error: "Ошибка при получении проектов" }, { status: 500 });
    }
}
