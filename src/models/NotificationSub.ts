// import mongoose, { Schema, model, models } from "mongoose";

// const NotificationSubSchema = new Schema({
//   userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//   subscription: {
//     endpoint: { type: String, required: true },
//     keys: {
//       p256dh: { type: String, required: true },
//       auth: { type: String, required: true },
//     },
//   },
// });
// // const NotificationSub =
// //   models.NotificationSub ||
// //   model("NotificationSub", NotificationSubSchema);
// const NotificationSub = models.NotificationSub;

// export default NotificationSub;

// models/NotificationSub.ts
import mongoose, { Schema, model, models } from "mongoose";

const NotificationSubSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subscription: {
        endpoint: { type: String, required: true },
        keys: {
            p256dh: { type: String, required: true },
            auth: { type: String, required: true }
        }
    },
    createdAt: { type: Date, default: Date.now }
});

interface INotificationSub extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    subscription: {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    };
    createdAt: Date;
}

const NotificationSub = models.NotificationSub as mongoose.Model<INotificationSub> || model<INotificationSub>("NotificationSub", NotificationSubSchema);
export default NotificationSub;

