self.addEventListener("push", (event) => {
    const data = event.data?.json() || { title: "Notification", body: "You have a reminder!" };
  
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/images/logo.png",
        data: data.url || "/"
      })
    );
  });
  
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = event.notification.data || "/";
    event.waitUntil(clients.matchAll({ type: "window" }).then((list) => {
      for (const client of list) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    }));
  });