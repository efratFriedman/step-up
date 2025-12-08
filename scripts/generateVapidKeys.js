const webpush = require("web-push");

const vapidKeys = webpush.generateVAPIDKeys();
console.log("PUBLIC VAPID KEY:", vapidKeys.publicKey);
console.log("PRIVATE VAPID KEY:", vapidKeys.privateKey);
