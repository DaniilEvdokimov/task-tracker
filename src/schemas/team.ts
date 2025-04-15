import { z } from "zod";

export const CreateTeamSchema = z.object({
    name: z.string().min(1, "Название команды обязательно"),
    inviteEmails: z.array(z.string().email("Некорректный email")).optional(), //список email'ов
});

export const UpdateTeamSchema = z.object({
    name: z.string().min(1, "Название команды обязательно").optional(),
});

export const AddTeamMemberSchema = z.object({
    email: z.string().email("Некорректный email"),
});

export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;
export type UpdateTeamInput = z.infer<typeof UpdateTeamSchema>;
