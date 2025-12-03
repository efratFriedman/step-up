import { Document, Types } from "mongoose";

export interface IPost extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  media: {
    url: string;
    type: "image" | "video";
  }[];
  likesCount: number;
  likedBy?: Types.ObjectId[]; 
  createdAt?: string;
  currentUserId?: string;
}
