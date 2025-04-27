
import mongoose, { mongo } from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})

const Category = new mongoose.Schema('Category', categorySchema)
export default Category;