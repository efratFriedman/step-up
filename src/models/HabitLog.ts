import { IHabitLog } from '@/interfaces/IHabitLog';
import mongoose, { Schema, model } from 'mongoose';

const HabitLogSchema = new mongoose.Schema({
  habitId: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  isDone: { type: Boolean, default: false }
});
// export default mongoose.models.HabitLog||mongoose.model<IHabitLog>("HabitLog",HabitLogSchema);


const HabitLog  =
//  (models.Category  as mongoose.Model<ICategory>) ||
  model<IHabitLog>("HabitLog", HabitLogSchema);

export default HabitLog;