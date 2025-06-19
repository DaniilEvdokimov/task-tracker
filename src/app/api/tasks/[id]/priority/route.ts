import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';


// PUT /api/tasks/:id/priority — изменение приоритета
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });

        const taskId = Number(params.id);
        const { priority } = await req.json();

        // Get the original task to compare changes
        const originalTask = await prisma.task.findUnique({
            where: { id: taskId },
            include: {
                executor: true,
                project: true,
            }
        });

        if (!originalTask) {
            return NextResponse.json({ error: 'Задача не найдена' }, { status: 404 });
        }

        const updated = await prisma.task.update({
            where: { id: taskId },
            data: { priority },
            include: {
                executor: true,
                project: true,
            }
        });

        // Create notification for priority change
        if (priority !== originalTask.priority) {
            await prisma.notification.create({
                data: {
                    user_id: originalTask.executor_id,
                    message: `Приоритет задачи изменен: "${originalTask.priority}" → "${priority}"`,
                    task_id: taskId,
                    project_id: originalTask.project_id,
                }
            });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('[TASK_PRIORITY_PUT]', error);
        return NextResponse.json({ error: 'Ошибка при обновлении приоритета' }, { status: 500 });
    }
}
