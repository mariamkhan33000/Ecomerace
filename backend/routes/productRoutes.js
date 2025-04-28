import express from 'express'
import { createProduct, deleteProductById, getAllProducts, getProductById, undeleteProductById, updateProductById } from '../controllers/productController.js';
const router = express.Router()

router.post('/create' , createProduct)
router.get('/getAll', getAllProducts)  
router.get('/:id', getProductById)    
router.patch('/:id', updateProductById)
router.delete('/:id', deleteProductById)
router.patch('/undelete/:id', undeleteProductById)


export default router;      