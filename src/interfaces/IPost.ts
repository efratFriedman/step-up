import { Document, Types } from "mongoose";

export interface IUserPopulated {
  _id: string;
  name: string;
  profileImg?: string;
}

export interface IPost extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId | IUserPopulated;
  content: string;
  media: {
    url: string;
    type: "image" | "video";
  }[];
  likesCount: number;
  likedBy?: Types.ObjectId[]; 
  createdAt?: string;
  currentUserId?: string;
  isLikedByCurrentUser?: boolean;
}
