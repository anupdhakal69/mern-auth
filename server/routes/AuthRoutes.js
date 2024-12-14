import express from 'express'
import { register,login, logout, getUser } from '../controller/AuthController.js'
const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.get('/users', getUser)

export default authRouter