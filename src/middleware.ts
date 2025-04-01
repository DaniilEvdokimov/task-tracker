import {NextRequest, NextResponse} from "next/server";
import {verifyToken} from "@/utils/jwt";

const PUBLIC_PATHS = ['/login', '/register', '/api/auth', '/_next'];

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
		return NextResponse.next();
	}

	const token = request.cookies.get('token')?.value;

	if (!token) {
		if (pathname !== '/login') {
			const loginUrl = new URL('/login', request.url);
			loginUrl.searchParams.set('from', pathname);
			return NextResponse.redirect(loginUrl);
		}
		return NextResponse.next();
	}

	try {
		await verifyToken(token);
		if (['/login', '/register'].includes(pathname)) {
			return NextResponse.redirect(new URL('/', request.url));
		}
		return NextResponse.next();
	} catch (error) {
		const response = NextResponse.redirect(new URL('/login', request.url));
		response.cookies.delete('token');
		return response;
	}
}