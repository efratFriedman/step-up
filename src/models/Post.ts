import "../models/User"; 
import { IPost } from '@/interfaces/IPost';
import mongoose, { Schema } from 'mongoose';

const PostSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  media: [{ url: String, type: { type: String, enum: ['image','video'] } }],
  likesCount: { type: Number, default: 0 },
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }] 
});

export default mongoose.models.Post||mongoose.model<IPost>("Post",PostSchema);

