import mongoose from "mongoose";

const CategorySchema=new mongoose.Schema({
    name:{type:String,required:true},
    image:String,
    colorTheme:String
});

module.exports = mongoose.model('Category', CategorySchema);
