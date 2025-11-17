import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const users = await User.find({}).select("_id name email");
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}