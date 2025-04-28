import { createOrder, getAll, getByUserId, updateById } from "../controllers/orderController.js";
import express from 'express'
const router = express.Router()


router.post('/create', createOrder)
router.get('/user/:id', getByUserId)
router.get('/getAll', getAll )
router.patch('/:id', updateById)

export default router;