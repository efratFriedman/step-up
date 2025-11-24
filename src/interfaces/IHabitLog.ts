import { Document, Types } from 'mongoose';

export interface IHabitLog extends Document {
  habitId: Types.ObjectId;
  userId: Types.ObjectId;
  date: string;
  isDone: boolean;
}
