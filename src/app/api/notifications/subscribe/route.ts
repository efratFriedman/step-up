import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import NotificationSub from "@/models/NotificationSub";
import { authenticate } from "@/lib/server/authMiddleware";


export async function POST(req: Request) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    const userId = user._id;

    const body = await req.json();
    const subscription = body.subscription;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json(
        { message: "Invalid subscription object" },
        { status: 400 }
      );
    }

    const NotificationSubDb: any = NotificationSub;

    await NotificationSubDb.findOneAndUpdate(
      { userId },
      { subscription },
      { upsert: true, new: true }
    );
    
      return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("POST /notifications/subscribe error:", error);
    return NextResponse.json(
      { message: error.message ?? "Failed to subscribe" },
      { status: 500 }
    );
  }
}