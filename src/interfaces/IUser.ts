import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  birthDate?: Date;
  password: string;
  profileImg?: string;       
  habits: Types.ObjectId[];  
  posts: Types.ObjectId[];  
}