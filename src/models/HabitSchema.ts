import mongoose from "mongoose";

const HabitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: String,
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    reminderTime:String,
})