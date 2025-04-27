import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    item:{
        type:[itemSchema],
        required:true
    },
    address:{
        type:[],
        required:true
    },
    status:{
        type:String,
        enum:['Pending','Dispatched','Out for delivery','Cancelled'],
        default:'Pending'
    },
    paymentMode:{
        type:String,
        enum:['Cash on Delivery','UPI','CARD'],
        required:true
    },
    total:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
},{versionKey:false})

const Order = mongoose.model('Order', orderSchema)
export default Order