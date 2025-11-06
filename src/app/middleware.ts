import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(request: NextRequest){
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

   // const protectedRoutes = ['/dashboard', '/profile', '/settings'];

//    if (!token && protectedRoutes.some(path => pathname.startsWith(path))) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

    if(token){
        const isValid = verifyToken(token);
        if(!isValid){
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('token');
            return response;
        }
        if(pathname.startsWith('/login') || pathname.startsWith('/signup')){
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }
    return NextResponse.next();
}