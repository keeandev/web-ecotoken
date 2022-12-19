// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminEdgeSession } from "@ecotoken/auth/src/iron-session/get-edge-session";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const response = NextResponse.next();
	const session = await getAdminEdgeSession(request, response);

	if (request.ip !== session.user?.ipAddress) session.destroy();

	if (pathname.startsWith("/login")) {
		if (session.user?.id) {
			return NextResponse.redirect(new URL("/", request.url));
		}
	} else {
		if (!session.user?.id) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}
	return response;
}

// matching routes
export const config = {
	matcher: [
		"/",
		"/collection",
		"/history",
		"/wallet",
		"/settings",
		"/projects:path*",
		"/stake/:path*",
		"/login",
		"/logout"
	]
};
