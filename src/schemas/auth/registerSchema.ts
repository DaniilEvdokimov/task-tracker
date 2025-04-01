import { z } from "zod";

export const registerSchema = z.object({
	name: z
		.string({
		required_error: "Введите свое имя",
		invalid_type_error: "Имя должно состоять из букв",
		})
		.min(2, { message: "Имя должно быть не короче 2 символов" })
		.max(14, {message: "Имя  не должно превышать 14 символов"}),

	surname: z
		.string({
		required_error: "Введите свою фамилию",
		invalid_type_error: "Фамилия должно состоять из букв",
		})
		.min(2, { message: "Фамилия должна быть не короче 2 символов" })
		.max(20, { message: "Фамилия не должна превышать 20 символов" }),

	email: z
		.string({required_error: "Введите свой email"})
		.email({ message: "Некорректный формат email" }),

	login: z
		.string({required_error: "Введите свой логин"})
		.min(3, {message: 'Минимум 3 символа'})
		.regex(/^[a-zA-Z0-9_]+$/, {
			message: "Логин может содержать только латинские буквы, цифры и _"
		}),
	password: z
		.string({required_error: "Введите пароль"})
		.min(4, {message: "Минимум 4 символа"}),

	confirmPassword: z
		.string({required_error: "Повторно введите пароль"}),

	avatar_url: z
		.string()
		.url({message: 'Неправильный url'})
		.optional()
})
	.refine(data => data.password === data.confirmPassword, {
		message: "Пароли не совпадают",
		path: ["confirmPassword"],
	});