import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_ROUTES, ROUTES } from "./config/routes";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    if (token && PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.redirect(new URL(ROUTES.HOME, req.url));
    }

    if (!token && !PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.redirect(new URL(ROUTES.LOGIN, req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|images|public).*)",
    ],
};