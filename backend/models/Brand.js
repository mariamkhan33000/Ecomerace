import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})

const Brand = new mongoose.model('Brand', brandSchema)
export default Brand;