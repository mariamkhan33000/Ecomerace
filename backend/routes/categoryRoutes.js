import express from 'express'
import { getAllCategory } from '../controllers/categorycontroller.js';
const router = express.Router();

router.get('getAll', getAllCategory)

export default router;