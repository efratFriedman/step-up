import { IHabit } from '@/interfaces/IHabit';
import mongoose, { Schema} from 'mongoose';

const HabitSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  reminderTime: {
    hour: { type: Number, min: 0, max: 23 },
    minute: { type: Number, min: 0, max: 59 }
  },
  days: [Boolean],
});

export default mongoose.models.Habit||mongoose.model<IHabit>("Habit",HabitSchema);

