import { IHabitLog } from '@/interfaces/IHabitLog';
import mongoose, { Schema, Model, model } from 'mongoose';

const HabitLogSchema: Schema<IHabitLog> = new Schema({
  habitId: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  isDone: { type: Boolean, default: false }
});

const HabitLog: Model<IHabitLog> = model<IHabitLog>('HabitLog', HabitLogSchema);
export default HabitLog;
