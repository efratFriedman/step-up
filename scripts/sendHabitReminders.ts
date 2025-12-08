import cron from "node-cron";
import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";
import NotificationSub from "@/models/NotificationSub";
import { sendEmail } from "@/lib/server/emailService";
import { sendPush } from "@/lib/server/pushService";
import mongoose from "mongoose";

async function sendReminder() {
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
      }).populate("userId").lean();
  
      for (const habit of habits as any[]) {
        const user = habit.userId;
        if (user?.email) {
          await sendEmail({
            to: user.email,
            subject: `Reminder: ${habit.name}`,
            text: `Hey ${user.name}, it's time to do your habit "${habit.name}"!`
          });
        }

        const sub = await NotificationSub.findOne({ userId: habit.userId._id || habit.userId });
        if (sub) {
          await sendPush(sub.subscription, { title: `Reminder: ${habit.name}`, body: habit.description || "Time for your habit!" });
        }
      }
    } catch (err) {
      console.error("Cron error:", err);
    }
  }

  cron.schedule("* * * * *", sendReminder);
  