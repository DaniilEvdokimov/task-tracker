import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { loginSchema } from "@/schemas/auth/loginSchema";
import { ZodError } from "zod";
import {generateToken} from "@/utils/jwt";


export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validatedData = loginSchema.parse(body);

		const user = await prisma.user.findFirst({
			where: {
				OR: [
					{ login: validatedData.loginOrEmail },
					{ email: validatedData.loginOrEmail },
				],
			},
		});

		const isInvalidCredentials =
			!user || !(await bcrypt.compare(validatedData.password, user.pass_hash));

		if (isInvalidCredentials) {
			return NextResponse.json(
				{
					error: "Неверный логин/email или пароль",
				},
				{ status: 401 }
			);
		}

		const token = generateToken({ userId: user.id });

		const response = NextResponse.json(
			{
				message: "Вход выполнен успешно",
				user: {
					id: user.id,
					login: user.login
				},
			},
			{ status: 200 }
		);

		response.cookies.set({
			name: 'token',
			value: token,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7,
			path: '/',
		});

		return response;

	} catch (error) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{
					error: "Ошибка валидации",
					fields: error.errors.reduce((acc, curr) => {
						const field = curr.path[0];
						acc[field] = curr.message;
						return acc;
					}, {} as Record<string, string>)
				},
				{ status: 422 }
			);
		}

		console.error("Login Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}