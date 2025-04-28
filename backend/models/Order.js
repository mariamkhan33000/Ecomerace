import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    item: {
        type: String, // If this is a list of item names or IDs, adjust accordingly.
        required: true
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: 'Address', // Assuming you have an Address model
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Dispatched', 'Out for delivery', 'Cancelled'],
        default: 'Pending'
    },
    paymentMode: {
        type: String,
        enum: ['Cash on Delivery', 'UPI', 'CARD'],
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false, timestamps: true }); // Added `timestamps: true` for `createdAt` and `updatedAt`

const Order = mongoose.model('Order', orderSchema);
export default Order;
