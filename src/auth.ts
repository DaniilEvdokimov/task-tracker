import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import {getUserByLoginOrEmail} from "@/model/user";
import {loginSchema} from "@/schemas/auth/loginSchema";


export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				loginOrEmail: {},
				password: {},
			},
			// @ts-ignore
			authorize: async (credentials) => {
				const { loginOrEmail, password } = await loginSchema.parseAsync(credentials);
				const user = await getUserByLoginOrEmail(loginOrEmail);

				if (!user || !user.pass_hash) {
					return null;
				}

				const passwordMatch = await bcrypt.compare(password, user.pass_hash);

				if (!passwordMatch) {
					return null;
				}

				return user;
			}
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async session({ session, token }) {
			// @ts-ignore
			session.user.id = token.id;
			return session;
		},
		async jwt({ token, user }) {
			if (user) token.id = user.id;
			return token;
		}
	},
	pages: {
		signIn: "/login",
		error: "/login",
	}
})