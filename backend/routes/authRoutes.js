import express from 'express'
import { checkAuth, forgotPassword, logIn, logOut, resetPassword, signUp, verifyOtp } from '../controllers/authController.js'
import { verifyToken } from '../middleware/VerifyToken.js'

const router = express.Router()

router.post('/signup', signUp)
router.post('/login', logIn)
router.post('/verify-otp', verifyOtp)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('check-auth', verifyToken,  checkAuth)
router.post('/logout', logOut)


export default router;
co