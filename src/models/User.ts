import mongoose, { Schema, model, models } from "mongoose";
import { IUser } from "@/interfaces/IUser";

const UserSchema = new Schema<IUser>({
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


const User = //(models.User  as mongoose.Model<IUser>) ||
    model<IUser>("User", UserSchema);
export default User;