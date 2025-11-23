import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "./lib/auth";

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request, {
		cookiePrefix: "varfeo",
	});


	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}


	return NextResponse.next();
}

export const config = {
	runtime: "nodejs",
	matcher: ["/admin/:path*", "/profile/:path*"],
};
