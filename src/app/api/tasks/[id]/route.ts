import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';


// GET /api/tasks/:id — получение информации о задаче
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });

        const task = await prisma.task.findUnique({
            where: { id: Number(params.id) },
            include: {
                creator: true,
                executor: true,
                project: true,
                team: true,
                comments: true,
            },
        });
        if (!task) return NextResponse.json({ error: 'Задача не найдена' }, { status: 404 });

        return NextResponse.json(task);
    } catch (error) {
        console.error('[TASK_GET]', error);
        return NextResponse.json({ error: 'Ошибка при получении задачи' }, { status: 500 });
    }
}

// PUT /api/tasks/:id — обновление задачи
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });

        const data = await req.json();
        const updated = await prisma.task.update({
            where: { id: Number(params.id) },
            data,
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('[TASK_PUT]', error);
        return NextResponse.json({ error: 'Ошибка при обновлении задачи' }, { status: 500 });
    }
}

// DELETE /api/tasks/:id — удаление задачи
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });

        await prisma.task.delete({ where: { id: Number(params.id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[TASK_DELETE]', error);
        return NextResponse.json({ error: 'Ошибка при удалении задачи' }, { status: 500 });
    }
}
