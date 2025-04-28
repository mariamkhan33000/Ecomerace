import express from 'express'
import { getAllBrands } from '../controllers/brandController.js'
const router = express.Router()

router.get('getAll', getAllBrands)

export default router;