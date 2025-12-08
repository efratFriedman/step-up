import { IHabitLog } from '@/interfaces/IHabitLog';
import mongoose, { Schema } from 'mongoose';

const HabitLogSchema = new mongoose.Schema({
  habitId: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  isDone: { type: Boolean, default: false }
});
export default mongoose.models.HabitLog||mongoose.model<IHabitLog>("HabitLog",HabitLogSchema);

