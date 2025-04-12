import {NextRequest, NextResponse} from 'next/server';
import prisma from '@/lib/prisma';
import {z, ZodError} from 'zod';


const StatusEnum = z.enum(["Новая", "В_работе", "Готова", "Закрыта", "Отменена"]);
const PriorityEnum = z.enum(["Низкий", "Нормальный", "Высокий"]);

// Схема валидации с использованием Zod
const taskSchema = z.object({
    title: z.string().min(1, "Название задачи обязательно"),
    description: z.string().min(1, "Описание задачи обязательно"),
    due_date: z.string().optional(),
    status: StatusEnum,
    priority: PriorityEnum,
    creator_id: z.number(),
    executor_id: z.number(),
    project_id: z.number(),
    team_id: z.number(),
    parent_task_id: z.number().nullish(),
});

// Примеры запросов:
//
// Абсолютно все задачи:
// GET /api/tasks - все задачи
//
// Все задачи со статусом "В_работе":
// GET /api/tasks?status=В_работе
//
// Все задачи с высоким приоритетом:
// GET /api/tasks?priority=Высокий
//
// Все задачи, созданные пользователем с ID 2:
// GET /api/tasks?creator_id=2
//
// Задачи по проекту и исполнителю:
// GET /api/tasks?project_id=3&executor_id=5

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const rawStatus = searchParams.get("status");
    const rawPriority = searchParams.get("priority");

    const creator_id = searchParams.get("creator_id");
    const executor_id = searchParams.get("executor_id");
    const project_id = searchParams.get("project_id");
    const team_id = searchParams.get("team_id");

    let status: z.infer<typeof StatusEnum> | undefined;
    let priority: z.infer<typeof PriorityEnum> | undefined;

    // Валидируем статус и приоритет
    if (rawStatus && StatusEnum.safeParse(rawStatus).success) {
        status = rawStatus as z.infer<typeof StatusEnum>;
    }
    if (rawPriority && PriorityEnum.safeParse(rawPriority).success) {
        priority = rawPriority as z.infer<typeof PriorityEnum>;
    }

    try {
        const tasks = await prisma.task.findMany({
            where: {
                ...(status ? { status } : {}),
                ...(priority ? { priority } : {}),
                ...(creator_id ? { creator_id: Number(creator_id) } : {}),
                ...(executor_id ? { executor_id: Number(executor_id) } : {}),
                ...(project_id ? { project_id: Number(project_id) } : {}),
                ...(team_id ? { team_id: Number(team_id) } : {}),
            },
        });

        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Ошибка сервера" },
            { status: 500 }
        );
    }
}

// POST /api/tasks – создание задачи
export async function POST(req: Request) {
    try {
        const data = await req.json(); // Получаем данные из тела запроса

        // Валидируем данные с помощью Zod
        const validatedData = taskSchema.parse(data);

        // Создаем задачу в базе данных
        const task = await prisma.task.create({
            data: {
                title: validatedData.title,
                description: validatedData.description,
                due_date: validatedData.due_date ? new Date(validatedData.due_date) : null,
                status: validatedData.status,
                priority: validatedData.priority,
                creator_id: validatedData.creator_id,
                executor_id: validatedData.executor_id,
                project_id: validatedData.project_id,
                team_id: validatedData.team_id,
                parent_task_id: validatedData.parent_task_id || null,
            },
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: "Ошибка валидации", details: error.errors },
                { status: 400 }
            );
        } else if (error instanceof Error) {
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

