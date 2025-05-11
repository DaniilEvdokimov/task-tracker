import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UpdateProjectSchema, type UpdateProjectInput } from "@/schemas/project";

// GET /api/projects/:id - информация о проекте
export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
        }

        const project = await prisma.project.findUnique({
            where: {
                id: Number(params.id),
                created_by: Number(currentUser.id),
            },
            include: {
                tasks: true,
                notifications: true,
            },
        });

        if (!project) {
            return NextResponse.json({ error: "Проект не найден" }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error("[PROJECT_GET]", error);
        return NextResponse.json({ error: "Ошибка при получении проекта" }, { status: 500 });
    }
}

// PUT /api/projects/:id - обновление проекта
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
        }

        const body = (await request.json()) as UpdateProjectInput;
        const validation = UpdateProjectSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
        }

        const updated = await prisma.project.updateMany({
            where: {
                id: Number(params.id),
                created_by: Number(currentUser.id),
            },
            data: {
                name: validation.data.name,
            },
        });

        if (updated.count === 0) {
            return NextResponse.json({ error: "Проект не найден или нет прав" }, { status: 404 });
        }

        return NextResponse.json({ message: "Проект обновлен" });
    } catch (error) {
        console.error("[PROJECT_PUT]", error);
        return NextResponse.json({ error: "Ошибка при обновлении проекта" }, { status: 500 });
    }
}

// DELETE /api/projects/:id - удаление проекта
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
        }

        const deleted = await prisma.project.deleteMany({
            where: {
                id: Number(params.id),
                created_by: Number(currentUser.id),
            },
        });

        if (deleted.count === 0) {
            return NextResponse.json({ error: "Проект не найден или нет прав" }, { status: 404 });
        }

        return NextResponse.json({ message: "Проект удален" });
    } catch (error) {
        console.error("[PROJECT_DELETE]", error);
        return NextResponse.json({ error: "Ошибка при удалении проекта" }, { status: 500 });
    }
}
