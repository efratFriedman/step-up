import webpush from "web-push";

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_VAPID_KEY!;
const privateKey = process.env.PRIVATE_VAPID_KEY!;
const subject = process.env.VAPID_SUBJECT || `mailto:${process.env.MAIL_USER || "no-reply@example.com"}`;

if (publicKey && privateKey) {
    webpush.setVapidDetails(subject, publicKey, privateKey);
  } else {
    console.warn("VAPID keys missing in env.");
  }

  export async function sendPush(subscription: any, payload: any) {
    try {
      await webpush.sendNotification(subscription, JSON.stringify(payload));
      return { ok: true };
    } catch (err: any) {
      console.error("sendPush error:", err);
      return { ok: false, error: err };
    }
  }