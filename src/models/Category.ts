import { ICategory } from '@/interfaces/ICategory';
import mongoose, { Schema, Model, model } from 'mongoose';

const CategorySchema: Schema<ICategory> = new Schema({
  name: { type: String, required: true },
  image: String,
  colorTheme: String
});

const Category: Model<ICategory> = model<ICategory>('Category', CategorySchema);
export default Category;