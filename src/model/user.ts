import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function getUserByLoginOrEmail(loginOrEmail: string) {
	try {
		const user =  await prisma.user.findFirst({
			where: {
				OR: [
					{ login: loginOrEmail },
					{ email: loginOrEmail }
				]
			}
		});
		return  user;
	} catch (error) {
		console.error("Database error:", error);
		return null;
	}
}

export async function changePassword(email: string, password: string) {
	try {
		const user = await prisma.user.findUnique({
			where : {email: email}
		})

		if (!user) {
			throw new Error('Пользователь не найден');
		}

		const hashPass = await bcrypt.hash(password, 10);

		await prisma.user.update({
			where: {id: user.id},
			data: {
				pass_hash: hashPass,
			}
		})

		return {success: true, message: 'Пароль изменён'};

	} catch (error) {
		return { success: false, message: error instanceof Error ? error.message : 'Не удалось поменять пароль' };
	}
}
