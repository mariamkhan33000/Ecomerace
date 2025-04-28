import express from 'express'
import { createCart, getByUserId, updateById } from '../controllers/cartController.js'
const router = express.Router()

router.post('/create', createCart)
router.get('/user/:id', getByUserId)
router.patch('/:id', updateById)

export default router