export async function subscribeToNotifications() {
  
    if (!("serviceWorker" in navigator)) return;

    const reg = await navigator.serviceWorker.register("/sw.js");
    const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "<PUBLIC_VAPID_KEY>"
    });

    await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ subscription: sub })
      });
    
}