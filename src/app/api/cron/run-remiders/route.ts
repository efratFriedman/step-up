// import { NextResponse } from "next/server";
// import { dbConnect } from "@/lib/DB";
// import Habit from "@/models/Habit";
// import NotificationSub from "@/models/NotificationSub";
// import { sendEmail } from "@/lib/server/emailService";
// import { sendPush } from "@/lib/server/pushService";
// import { IUser } from "@/interfaces/IUser";

// export async function POST(req: Request) {
//     const url = new URL(req.url);
//     const secret = url.searchParams.get("secret") || req.headers.get("x-cron-secret");
//     if (!secret || secret !== process.env.CRON_SECRET) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  
//     try {
//         await dbConnect();
//         const now = new Date();
//         const dayIndex = now.getDay(); 
//         const hour = now.getHours();
//         const minute = now.getMinutes();
    
//         const habits = await Habit.find({
//           [`days.${dayIndex}`]: true,
//           "reminderTime.hour": hour,
//           "reminderTime.minute": minute,
//         }).populate("userId").lean();
    
//         for (const habit of habits as any[]) {
//           const user = habit.userId;
//           if (user?.email) {
//             await sendEmail({
//               to: user.email,
//               subject: `Reminder: ${habit.name}`,
//               text: `Hey ${user.name}, it's time to do your habit "${habit.name}"!`
//             });
//           }
  
//           const sub = await NotificationSub.findOne({ userId: habit.userId._id || habit.userId });
//           if (sub) {
//             await sendPush(sub.subscription, { title: `Reminder: ${habit.name}`, body: habit.description || "Time for your habit!" });
//           }
//         }
//       } catch (err) {
//         console.error("Cron error:", err);
//       }

//     return NextResponse.json({ ok: true });
//   }
// app/api/cron/run-reminders/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";
import NotificationSub from "@/models/NotificationSub";
import { sendEmail } from "@/lib/server/emailService";
import { sendPush } from "@/lib/server/pushService";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret =
    searchParams.get("secret") || req.headers.get("x-cron-secret");

  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await dbConnect();

    const now = new Date();
    const dayIndex = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();

    const habits = await Habit.find({
      [`days.${dayIndex}`]: true,
      "reminderTime.hour": hour,
      "reminderTime.minute": minute,
    })
      .populate("userId")
      .lean();

    for (const habit of habits as any[]) {
      const user = habit.userId;
      if (!user || !user._id) continue;

      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: `Reminder: ${habit.name}`,
          text: `Hey ${user.name}, it's time to do your habit "${habit.name}"!`,
        });
      }

      const sub = await NotificationSub.findOne({ userId: user._id });
      if (sub) {
        await sendPush(sub.subscription, {
          title: `Reminder: ${habit.name}`,
          body: habit.description || "Time for your habit!",
        });
      }
    }

    return NextResponse.json({ ok: true, sent: habits.length });
  } catch (err: any) {
    console.error("Cron error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
