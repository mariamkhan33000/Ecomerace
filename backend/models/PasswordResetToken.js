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
    expiresAt : {
        type : Date,
        required : true
    }
} , {
    timestamps : true
})

const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema)
export default PasswordResetToken;

