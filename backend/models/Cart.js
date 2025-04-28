import mongoose, { Schema } from "mongoose";
import { itemSchema } from "./Item.js"; // import { itemSchema }

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: {
        type: [itemSchema],
        required: true,
    }
}, { versionKey: false, timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
