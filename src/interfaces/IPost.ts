import { Document, Types } from 'mongoose';

export interface IPost extends Document {
  userId: Types.ObjectId;
  content?: string;
  media?: string[];    
  likesCount: number;
}
