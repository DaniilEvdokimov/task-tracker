import {z} from "zod";

export const loginSchema = z.object({
	loginOrEmail: z.string({required_error: "Введите логин"}),
	password: z.string({required_error: "Введите пароль"})
});

export type TloginSchema = z.infer<typeof loginSchema>