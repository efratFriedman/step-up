import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    birthDate: Date,
    password: { type: String, required: true },
    profileImg: String,
    habits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Habit' }],
    posts:[{type:mongoose.Schema.Types.ObjectId,ref:'Post'}]
});

module.exports = mongoose.model('User', UserSchema);

