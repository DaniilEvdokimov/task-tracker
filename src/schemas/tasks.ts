import {z} from "zod";

export const CreateTaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    due_date: z.string().datetime().optional(),
    status: z.enum(["Новая", "В_работе", "Готова", "Закрыта", "Отменена"]),
    priority: z.enum(["Низкий", "Нормальный", "Высокий"]),
    executor_id: z.number(),
    project_id: z.number().optional(),
    team_id: z.number().optional(),
});
