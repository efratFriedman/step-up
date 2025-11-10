import { IUser } from '@/interfaces/IUser'
import mongoose, { Schema } from 'mongoose'


const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone:String,
    birthDate: Date,
    password:String,
    profileImg: String,
    googleId: { type: String, unique: true, sparse: true }, 
    habits: [{ type: Schema.Types.ObjectId, ref: 'Habit' }],
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]

});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
