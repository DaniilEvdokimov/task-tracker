import {z} from "zod";

export const loginSchema = z.object({
	loginOrEmail: z.string().min(1, {message: 'Введите логин или e-mail'}),
	password: z.string().min(1, {message: 'Введите пароль'})
});

export type TloginSchema = z.infer<typeof loginSchema>