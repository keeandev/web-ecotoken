// middleware.ts
import { ironOptions } from "@ecotoken/auth";
import { getIronSession } from "iron-session/edge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const response = NextResponse.next();
	const session = await getIronSession(request, response, ironOptions);

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
