import { Document, Types } from "mongoose";

export interface IPost extends Document {
  _id: string;  
  userId: Types.ObjectId;
  content: string;
  media: {
    url: string;
    type: "image" | "video";
  }[];
  likesCount: number;
  likedBy?: string[]; 
  createdAt?: string;
  currentUserId?: string;
}
