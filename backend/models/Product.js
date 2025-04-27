import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    discountPercentage: {
        type: Number,
        default: 0,
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    brand:{
        type:Schema.Types.ObjectId,
         ref:"Brand",
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    stockQuantity:{
        type:Number,
        required:true
    },
    images:{
        type:[String],
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true,versionKey:false})

const Product = new mongoose.model('Product', productSchema)
export default Product;