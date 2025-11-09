import { IUser } from '@/interfaces/IUser'
import mongoose, { Schema, Model, model } from 'mongoose'


const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    birthDate: Date,
    password: { type: String, required: true },
    profileImg: String,
    habits: [{ type: Schema.Types.ObjectId, ref: 'Habit' }],
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]

});

export default mongoose.models.User||mongoose.model<IUser>("User",UserSchema);
