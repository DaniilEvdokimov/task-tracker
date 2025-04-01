import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { registerSchema } from "@/schemas/auth/registerSchema";
import {ZodError} from "zod";



export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validatedData = registerSchema.parse(body);

		const existingEmail = await prisma.user.findUnique({
			where: { email: validatedData.email },
		});

		if (existingEmail) {
			return NextResponse.json(
				{ error: "Пользователь с такой почтой уже существует" },
				{ status: 409 }
			);
		}

		const existingLogin = await prisma.user.findUnique({
			where: { login: validatedData.login },
		});

		if (existingLogin) {
			return NextResponse.json(
				{ error: "Пользователь с таким логином уже существует" },
				{ status: 409 }
			);
		}

		const hashedPassword = await bcrypt.hash(validatedData.password, 10);

		const user = await prisma.user.create({
			data: {
				name: validatedData.name,
				surname: validatedData.surname,
				email: validatedData.email,
				login: validatedData.login,
				avatar_url: validatedData.avatar_url,
				pass_hash: hashedPassword,
			},
		});

		return NextResponse.json({
			message: "Регистрация прошла успешна",
			id: user.id,
			email: user.email
			}, { status: 201 });
	} catch (error) {
		if (error instanceof ZodError) {
			const fieldErrors = error.errors.reduce((acc, curr) => {
				const field = curr.path[0];

				if (!acc[field]) {
					acc[field] = curr.message;
				}
				return acc;
			}, {} as Record<string, string>);

			return NextResponse.json(
				{
					error: "Ошибка валидации",
					fields: fieldErrors
				},
				{ status: 422 }
			);
		}

		if (error instanceof Error) {
			return NextResponse.json(
				{
					error: error.name,
					message: error.message
				},
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}