import express from 'express'
import { logIn, signUp, verifyOtp } from '../controllers/authController.js'

const router = express.Router()

router.post('/signup', signUp)
router.post('/login', logIn)
router.post('/verify-otp', verifyOtp)

export default router;