import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface TokenUser {
  _id: string;
  name: string;
  email: string;
  profileImg?: string;
  isFirstLogin?: boolean;
}

export function createAuthResponse(user: TokenUser, message?: string) {

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  const response = NextResponse.json({
    message: message || `Welcome back ${user.name}!`,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImg: user.profileImg,
      isFirstLogin:user.isFirstLogin??false,
    }
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
