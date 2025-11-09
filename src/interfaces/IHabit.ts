import { Document, Types } from 'mongoose';

export interface IHabit extends Document {
  userId: Types.ObjectId;
  name: string;
  description?: string;
  categoryId: Types.ObjectId;
  reminderTime: {
    hour: number;
    minute: number;
  };
  days: string[];      
}