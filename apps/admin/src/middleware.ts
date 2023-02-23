// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getEdgeSession } from "@ecotoken/auth/src/iron-session/get-edge-session";
import { stripUrl } from "@ecotoken/auth/src/utils/strip-url";

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
	const { pathname, host } = req.nextUrl;
	const res = NextResponse.next();
	const session = await getEdgeSession(req, res, stripUrl(host) ?? "");

	if (req.ip !== session.user?.ipAddress) session.destroy();

	if (pathname.startsWith("/login")) {
		if (session.user?.id) {
			return NextResponse.redirect(new URL("/", req.url));
		}
	} else {
		if (!session.user?.id) {
			return NextResponse.redirect(new URL("/login", req.url));
		}
	}

	return res;
}

// matching routes
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)"
	]
};
