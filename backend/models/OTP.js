import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    },
}, { timestamps: true})

const Otp = new mongoose.model('Otp', otpSchema)
export default Otp;