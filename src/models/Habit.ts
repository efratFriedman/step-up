import { IHabit } from '@/interfaces/IHabit';
import mongoose, { Schema, Model, model } from 'mongoose';

const HabitSchema: Schema<IHabit> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  reminderTime: {
    hour: { type: Number, min: 0, max: 23 },
    minute: { type: Number, min: 0, max: 59 }
  },
  days: [String],
});

const Habit: Model<IHabit> = model<IHabit>('Habit', HabitSchema);
export default Habit;
