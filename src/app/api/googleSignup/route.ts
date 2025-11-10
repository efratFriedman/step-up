// /api/signup-google/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { name, email, googleId, profileImg } = await request.json();

        if (!name || !email || !googleId) {
            return NextResponse.json(
                { message: "Missing required Google user data" },
                { status: 400 }
            );
        }

        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                if (profileImg) user.profileImg = profileImg;
                await user.save();
            }
        } else {
            user = new User({
                name,
                email,
                googleId,
                profileImg: profileImg || "",
                password: null,
            });
            await user.save();
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        const response = NextResponse.json({
            message: `Welcome ${name}!`,
            user: { id: user._id, name: user.name, email: user.email, profileImg: user.profileImg },
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        console.error("Google signup error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
