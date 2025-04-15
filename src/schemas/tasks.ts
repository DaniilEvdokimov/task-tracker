import {z} from "zod";

export const CreateTaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    due_date: z
        .union([z.string(), z.date()])
        .optional()
        .transform((val) => (typeof val === 'string' ? new Date(val) : val)),
    status: z.enum(["Новая", "В_работе", "Готова", "Закрыта", "Отменена"]),
    priority: z.enum(["Низкий", "Нормальный", "Высокий"]),
    executor_id: z.number(),
    project_id: z.number().optional(),
    team_id: z.number().optional(),
});
