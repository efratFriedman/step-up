import mongoose, { Schema, model, models } from "mongoose";
import { ICategory } from "@/interfaces/ICategory"; 

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  image: { type: String },
  colorTheme: { type: String },
});


const Category = models.Category || model<ICategory>("Category", CategorySchema);


export default Category;
