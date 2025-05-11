import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { CreateTaskSchema } from "@/schemas/tasks";

// GET /api/tasks/:id/subtasks — получение подзадачи
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const subtasks = await prisma.task.findMany({
            where: { parent_task_id: Number(params.id) },
        });
        return NextResponse.json(subtasks);
    } catch (error) {
        console.error('[SUBTASKS_GET]', error);
        return NextResponse.json({ error: 'Ошибка при получении подзадач' }, { status: 500 });
    }
}

// POST /api/tasks/:id/subtasks — создание подзадачи
export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });

        const body = await req.json();
        const parsed = CreateTaskSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
        }

        const subtask = await prisma.task.create({
            data: {
                ...parsed.data,
                creator_id: Number(currentUser.id),
                parent_task_id: Number(params.id),
            },
        });

        return NextResponse.json(subtask, { status: 201 });
    } catch (error) {
        console.error('[SUBTASK_POST]', error);
        return NextResponse.json({ error: 'Ошибка при создании подзадачи' }, { status: 500 });
    }
}
