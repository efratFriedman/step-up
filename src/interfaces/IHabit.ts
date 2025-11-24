import { Document, Types } from 'mongoose';

export interface IHabit extends Document {
  userId: string;
  name: string;
  description?: string;
  
  categoryId: Types.ObjectId;
  reminderTime: {
    hour: number;
    minute: number;
  };
  days: boolean[];  
}