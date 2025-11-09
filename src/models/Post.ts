import { IPost } from '@/interfaces/IPost';
import mongoose, { Schema, Model, model } from 'mongoose';

const PostSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  media: [String], 
  likesCount: { type: Number, default: 0 }
});

export default mongoose.models.Post||mongoose.model<IPost>("Post",PostSchema);

