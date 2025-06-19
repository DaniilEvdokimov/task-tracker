import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import {TaskStatus} from "@/types";


// PUT /api/tasks/:id/status — изменение статуса
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });

        const taskId = Number(params.id);
        const { status }: { status: TaskStatus } = await req.json();

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
            data: { status },
            include: {
                executor: true,
                project: true,
            }
        });

        // Create notification for status change
        if (status !== originalTask.status) {
            await prisma.notification.create({
                data: {
                    user_id: originalTask.executor_id,
                    message: `Статус задачи изменен: "${originalTask.status}" → "${status}"`,
                    task_id: taskId,
                    project_id: originalTask.project_id,
                }
            });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('[TASK_STATUS_PUT]', error);
        return NextResponse.json({ error: 'Ошибка при обновлении статуса' }, { status: 500 });
    }
}
