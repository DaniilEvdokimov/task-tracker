import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';


// PUT /api/tasks/:id/assign — назначение исполнителя
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });

        const taskId = Number(params.id);
        const { executor_id } = await req.json();

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

        // Get the new executor
        const newExecutor = await prisma.user.findUnique({
            where: { id: Number(executor_id) }
        });

        if (!newExecutor) {
            return NextResponse.json({ error: 'Исполнитель не найден' }, { status: 404 });
        }

        const updated = await prisma.task.update({
            where: { id: taskId },
            data: { executor_id },
            include: {
                executor: true,
                project: true,
            }
        });

        // Create notification for the new executor
        if (executor_id !== originalTask.executor_id) {
            // Notification for the new executor
            await prisma.notification.create({
                data: {
                    user_id: Number(executor_id),
                    message: `Вам назначена задача "${originalTask.title}"`,
                    task_id: taskId,
                    project_id: originalTask.project_id,
                }
            });

            // Notification for the previous executor if there was one
            if (originalTask.executor_id !== currentUser.id) {
                await prisma.notification.create({
                    data: {
                        user_id: originalTask.executor_id,
                        message: `Задача "${originalTask.title}" переназначена с вас на ${newExecutor.name}`,
                        task_id: taskId,
                        project_id: originalTask.project_id,
                    }
                });
            }
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('[TASK_ASSIGN_PUT]', error);
        return NextResponse.json({ error: 'Ошибка при назначении исполнителя' }, { status: 500 });
    }
}
