import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
// Your own logic for dealing with plaintext password strings; be careful!

import prisma from "@/lib/prisma";
import {loginSchema} from "@/schemas/auth/loginSchema";
import bcrypt from "bcrypt";


async function getUserByLoginOrEmail(loginOrEmail: unknown) {
	prisma.user.findOne({
		where: {
			OR: [
				{email: loginOrEmail},
				{login: loginOrEmail}
			]
		}
	})// @ts-ignore
	.then((user) => {
		 return user;
	})// @ts-ignore
		.catch((err) => {
			return err;
		})
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				loginOrEmail: {},
				password: {},
			},
			authorize: async (credentials): Promise<any>  => {
				try {
					const parsedCredentials = loginSchema.safeParse(credentials);
					if (parsedCredentials.success) {
						const {loginOrEmail,password} = parsedCredentials.data;
						const user = await  getUserByLoginOrEmail(loginOrEmail)

						// @ts-ignore
						if (!user || !user?.password) return null
						// @ts-ignore
						const passwordsMatch = await bcrypt.compare(password, user.password)

						if (passwordsMatch) {
							return user
						}
					}
					console.log("Invalid credentials")
					return null
				}catch (error) {
					return error
				}
			}
		}),
	],
})