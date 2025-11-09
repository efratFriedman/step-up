import { IPost } from '@/interfaces/IPost';
import mongoose, { Schema, Model, model } from 'mongoose';

const PostSchema: Schema<IPost> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  media: [String], 
  likesCount: { type: Number, default: 0 }
});

const Post: Model<IPost> = model<IPost>('Post', PostSchema);
export default Post;
