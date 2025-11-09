import { Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  image?: string;       
  colorTheme?: string;
}
