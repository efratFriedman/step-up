import { Types } from "mongoose";

export interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface PushSubscriptionData {
  endpoint: string;
  keys: PushSubscriptionKeys;
}

export interface INotificationSub {
  userId: Types.ObjectId;
  subscription: PushSubscriptionData;
}
