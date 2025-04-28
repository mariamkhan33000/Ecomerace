import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
}, { versionKey: false, timestamps: true });

const Item = mongoose.model('Item', itemSchema);

export default Item;
