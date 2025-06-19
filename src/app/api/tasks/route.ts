import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { CreateTaskSchema } from "@/schemas/tasks";

// POST /api/tasks — создание задачи
// Примечание: задачи и подзадачи хранятся в одной таблице, у задач всегда "parent_task_id" равен null, подзадачи имеют ссылку на родительскую задачу
export async function POST(req: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
        }

        const body = await req.json();
        const parsed = CreateTaskSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
        }

        const task = await prisma.task.create({
            data: {
                ...parsed.data,
                creator_id: Number(currentUser.id),
            },
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error('[TASKS_POST]', error);
        return NextResponse.json({ error: 'Ошибка при создании задачи' }, { status: 500 });
    }
}

// GET /api/tasks — получение списка задач с фильтрами
export async function GET(req: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const filters: any = {
            OR: [
                { creator_id: Number(currentUser.id)},
                { executor_id: Number(currentUser.id)},
            ]
        };

        if (searchParams.get("status")) {
            filters.status = searchParams.get("status");
        }
        if (searchParams.get("priority")) {
            filters.priority = searchParams.get("priority");
        }
        if (searchParams.get("project_id")) {
            filters.project_id = Number(searchParams.get("project_id"));
        }
        if (searchParams.get("team_id")) {
            filters.team_id = Number(searchParams.get("team_id"));
        }

        const tasks = await prisma.task.findMany({
            where: filters,
            include: {
                creator: true,
                executor: true,
                project: true,
                team: true,
            },
            orderBy: { created_at: "desc" },
        });

        // Check for overdue tasks and create notifications
        const now = new Date();
        const overdueNotifications = [];

        for (const task of tasks) {
            if (
                task.due_date && 
                new Date(task.due_date) < now && 
                task.status !== "Закрыта" && 
                task.status !== "Отменена"
            ) {
                // Check if we already have a notification for this overdue task
                const existingNotification = await prisma.notification.findFirst({
                    where: {
                        task_id: task.id,
                        message: { contains: "просрочена" },
                        created_at: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
                    }
                });

                // If no recent notification exists, create one
                if (!existingNotification) {
                    overdueNotifications.push({
                        user_id: task.executor_id,
                        message: `Задача "${task.title}" просрочена! Срок выполнения: ${new Date(task.due_date).toLocaleDateString()}`,
                        task_id: task.id,
                        project_id: task.project_id,
                    });
                }
            }
        }

        // Create all overdue notifications
        if (overdueNotifications.length > 0) {
            await prisma.notification.createMany({
                data: overdueNotifications,
            });
        }

        return NextResponse.json(tasks);
    } catch (error) {
        console.error('[TASKS_GET]', error);
        return NextResponse.json({ error: 'Ошибка при получении задач' }, { status: 500 });
    }
}
