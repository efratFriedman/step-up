import { ICategory } from '@/interfaces/ICategory';
import mongoose, { Schema, Model, model } from 'mongoose';


const CategorySchema=new mongoose.Schema({
   name: { type: String, required: true },
   image: String,
  colorTheme: String
});

export default mongoose.models.Category||mongoose.model<ICategory>("Category",CategorySchema);
