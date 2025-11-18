import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

import { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
    id: string;
    email: string;
}

export function extractToken(req: Request) {
    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader?.split(";")
        .find((c) => c.trim().startsWith("token="))
        ?.split("=")[1];

    if (!token) {
        throw new Error("Missing token");
    }

    return token;
}

export function validateToken(token: string): TokenPayload {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
        return payload;
    } catch {
        throw new Error("Invalid token");
    }
}


export async function validateUserExists(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User does not exist");
    }
    return user;
}

export async function authenticate(req:Request){
    try{
        const token=extractToken(req);

        const payload=validateToken(token);

        const user=await validateUserExists(payload.id);

        return user;
    }catch(err:any){
    return NextResponse.json({ error: err.message }, { status: 401 });
    }
}