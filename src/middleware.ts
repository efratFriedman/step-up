import { NextRequest, NextResponse } from "next/server";
import { PROTECTED_ROUTES, BLOCK_WHEN_LOGGED_IN, ROUTES } from "./config/routes";


export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    let pathname = req.nextUrl.pathname;

    if (pathname !== "/" && pathname.endsWith("/")) {
        pathname = pathname.slice(0, -1);
    }

    if (token && BLOCK_WHEN_LOGGED_IN.includes(pathname)) {
        return NextResponse.redirect(new URL(ROUTES.HOME, req.url));
    }

    if (!token && PROTECTED_ROUTES.includes(pathname)) {
        return NextResponse.redirect(new URL(ROUTES.UNAUTHORIZED, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};