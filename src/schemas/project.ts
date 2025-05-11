import { z } from "zod";

export const CreateProjectSchema = z.object({
    name: z.string().min(1, "Название проекта обязательно"),
});

export const UpdateProjectSchema = z.object({
    name: z.string().min(1, "Название проекта обязательно"),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
