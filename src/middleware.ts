import { auth } from "@/auth";

export default auth((req) => {
	if (!req.auth && !["/login", "/register", "/forgot-password"].includes(req.nextUrl.pathname)) {
		return Response.redirect(new URL("/login", req.nextUrl.origin));
	}
});

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
