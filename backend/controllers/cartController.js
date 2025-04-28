import Cart from "../models/Cart.js";

export const createCart = async (req, res) => {
    try {
        const created=new Cart(req.body)
        await created.save()
        res.status(201).json(created)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Error adding product to cart, please trying again later'})
    }
}

export const getByUserId = async(req,res)=>{
    try {
        const {id} = req.params
        const result = await Cart.findOne({user:id})
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Error fetching cart items, please trying again later'})
    }
}


export const updateById = async(req,res)=>{
    try {
        const {id} = req.params
        const updated = await Cart.findByIdAndUpdate(id,req.body,{new:true})
        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Error updating cart items, please trying again later'})
    }
}