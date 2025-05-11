import {z} from "zod";
import {userSchema} from "@/schemas/auth/UserSchema";


export const forgotPasswordSchema = z.object({
	email: z
		.string({required_error: "Введите свой email"})
		.email({ message: "Некорректный формат email" }),

	password: z
		.string({required_error: "Введите пароль"})
		.min(4, {message: "Минимум 4 символа"}),

	confirmPassword: z
		.string({required_error: "Повторно введите пароль"})
})
	.refine(data => data.password === data.confirmPassword, {
		message: "Пароли не совпадают",
		path: ["confirmPassword"],
	});

export type TforgotPasswordSchema = z.infer<typeof forgotPasswordSchema>