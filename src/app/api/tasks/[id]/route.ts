import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z, ZodError } from 'zod';

const taskUpdateSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    due_date: z.string().optional(),
    status: z.enum(["Новая", "В_работе", "Готова", "Закрыта", "Отменена"]).optional(),
    priority: z.enum(["Низкий", "Нормальный", "Высокий"]).optional(),
    creator_id: z.number().optional(),
    executor_id: z.number().optional(),
    project_id: z.number().optional(),
    team_id: z.number().optional(),
    parent_task_id: z.number().nullable().optional(),
});

// GET /api/tasks/id - получить задачу по id
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return NextResponse.json({ error: "Некорректный ID" }, { status: 400 });
    }

    try {
        const task = await prisma.task.findUnique({
            where: { id },
        });

        if (!task) {
            return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
        }

        return NextResponse.json(task);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        } else {
            return NextResponse.json(
                { error: "Неизвестная ошибка" },
                { status: 500 }
            );
        }
    }
}

// PATCH /api/tasks/id - обновить задачу по id
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return NextResponse.json({ error: "Некорректный ID" }, { status: 400 });
    }

    try {
        const data = await req.json();
        const validated = taskUpdateSchema.parse(data);

        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                ...validated,
                due_date: validated.due_date ? new Date(validated.due_date) : undefined,
            },
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: "Ошибка валидации", details: error.errors }, { status: 400 });
        } else if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 });
        }
    }
}

// DELETE /api/tasks/id - удаление задачи по id
export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return NextResponse.json({ error: "Некорректный ID" }, { status: 400 });
    }

    try {
        await prisma.task.delete({ where: { id } });
        return NextResponse.json({ message: "Задача удалена" });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 });
        }
    }
}
