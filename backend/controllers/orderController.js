
import Order from "../models/Order.js"; // adjust the path if needed
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
    try {
        const { user, item, address, paymentMode, total } = req.body;

        // Basic Field Validation
        if (!user || !item || !address || !paymentMode || total == null) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate ObjectIds (user and address must be valid MongoDB ObjectId)
        if (!mongoose.Types.ObjectId.isValid(user) || !mongoose.Types.ObjectId.isValid(address)) {
            return res.status(400).json({ message: 'Invalid user or address ID' });
        }

        const newOrder = new Order({
            user,
            item,
            address,
            paymentMode,
            total
        });

        const savedOrder = await newOrder.save();

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order, please try again later' });
    }
};

export const getByUserId = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if the id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Find all orders for the user
        const results = await Order.find({ user: id }).populate('address').exec();

        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders, please try again later' });
    }
}

export const getAll = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching orders, please try again later' });
    }
}

export const updateById = async (req, res) => {
    try {
        const {id}=req.params
        const updated=await Order.findByIdAndUpdate(id,req.body,{new:true})
        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error updating order, please try again later'})
    }
}
