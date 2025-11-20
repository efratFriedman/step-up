import jwt from "jsonwebtoken";
import User from "@/models/User";
import { dbConnect } from "@/lib/DB";

interface TokenPayload {
    id: string;
    email: string;
}

export async function getUserFromToken(cookieHeader?: string) {
    try {
        if (!cookieHeader) return null;

        const token = cookieHeader
            .split(";")
            .find((c) => c.trim().startsWith("token="))
            ?.split("=")[1];

        if (!token) return null;

        const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

        await dbConnect();
        const user = await User.findById(payload.id).lean();

        return user || null;

    } catch {
        return null;
    }
}