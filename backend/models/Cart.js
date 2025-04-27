import mongoose from "mongoose";



export const itemSchema = new mongoose.Schema({
    product:{
        type:Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        default:1
    }
})

const cartSchema = new mongoose.Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    items:{
        type:[itemSchema],
        required:true
    }
},{versionKey:false})

const Cart = new mongoose.model('Cart', cartSchema)