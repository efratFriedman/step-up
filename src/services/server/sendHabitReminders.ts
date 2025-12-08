import cron from 'node-cron';
import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";
import { IUser } from "@/interfaces/IUser";
import { sendEmail } from "@/lib/server/emailService";

cron.schedule("* * * * *", async () => {
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

    for (const habit of habits) {
      const user = (habit as any).userId as IUser | null;
      if (!user || !user.email) continue;

      await sendEmail({
        to: user.email,
        subject: `Reminder: ${habit.name}`,
        text: `Hey ${user.name}, it's time to do your habit "${habit.name}"!`,
      });

      console.log(`Sent reminder for habit "${habit.name}" to ${user.email}`);
    }
  } catch (error: any) {
    console.error("Error in reminder cron job:", error.message || error);
  }
});
