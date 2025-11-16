import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, googleId } = await request.json();

        if (!email || !googleId) {
            return NextResponse.json(
                { message: "Missing Google user data" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { message: "User not found", redirectTo: "/signup" },
                { status: 404 }
            );
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        const response = NextResponse.json({
            message: `Welcome back ${user.name}!`,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImg: user.profileImg
            }
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;

    } catch (error) {
        console.error("Google login error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}