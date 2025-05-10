import {z} from "zod";
import {DateTime} from "luxon";

export const CreateTaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    due_date: z
        .union([z.string(), z.date()])
        .optional()
        .transform((val) => {
          if (typeof val === 'string') {
              return DateTime.fromFormat(val, 'dd.MM.yyyy').toJSDate();
          }
          return val;
      }),

    status: z.enum(["Новая", "В_работе", "Готова", "Закрыта", "Отменена"]),
    priority: z.enum(["Низкий", "Нормальный", "Высокий"]),
    executor_id: z.number(),
    project_id: z.number().optional(),
    team_id: z.number().optional(),
});

export const TaskFormSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    due_date: z.union([z.string(), z.date()]).optional(),
    status: z.enum(["Новая", "В_работе", "Готова", "Закрыта", "Отменена"]),
    priority: z.enum(["Низкий", "Нормальный", "Высокий"]),
    executor_id: z.number(),
    project_id: z.number().optional(),
    team_id: z.number().optional(),
});


export type TaskFormData = {
    title: string;
    description?: string;
    due_date?: string | Date;
    status: "Новая" | "В_работе" | "Готова" | "Закрыта" | "Отменена";
    priority: "Низкий" | "Нормальный" | "Высокий";
    executor_id: number;
    project_id?: number;
    team_id?: number;
};
