import express from 'express'
import { register,login, logout, getUser, sendVerifyOtp, verifyEmail } from '../controller/AuthController.js'
import userAuth from '../middleware/userAuth.js'
const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.get('/users', getUser)
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp)
authRouter.post('/verify-account', userAuth, verifyEmail)

export default authRouter