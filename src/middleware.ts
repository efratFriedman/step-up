import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_ROUTES, PROTECTED_ROUTES, BLOCK_WHEN_LOGGED_IN, ROUTES } from "./config/routes";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    let pathname = req.nextUrl.pathname;

    // מסיר "/" בסוף מסלול כדי למנוע טעויות
    if (pathname !== "/" && pathname.endsWith("/")) {
        pathname = pathname.slice(0, -1);
    }

    // חוסם ממשתמש מחובר להיכנס ללוגין / סיינאפ / לנדינג וכו'
    if (token && BLOCK_WHEN_LOGGED_IN.includes(pathname)) {
        return NextResponse.redirect(new URL(ROUTES.HOME, req.url));
    }

    // חוסם ממשתמש לא מחובר להיכנס לדפים מוגנים
    if (!token && PROTECTED_ROUTES.includes(pathname)) {
        return NextResponse.redirect(new URL(ROUTES.LOGIN, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};