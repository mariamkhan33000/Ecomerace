import mongoose from "mongoose";

const passwordResetTokenSchema = new mongoose.Schema({
    user  :{
        type : mongoose.Types.ObjectId;
        ref : "User",
        required : True
    },
    token : {
        type : String,
        required : true
    }, 
    expiresAr : {
        type : Date,
        required : true
    }
} , {
    timestamps : true
})

const passwordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema)
export default passwordResetToken;

