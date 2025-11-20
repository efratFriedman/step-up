import mongoose, { Schema, model, models } from "mongoose";
import { IHabit } from "@/interfaces/IHabit";

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

const Habit =
  (models.Habit as mongoose.Model<IHabit>) ||
  model<IHabit>("Habit", HabitSchema);

export default Habit;
