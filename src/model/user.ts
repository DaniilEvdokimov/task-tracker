import prisma from "@/lib/prisma";

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
