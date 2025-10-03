import { Router } from 'express'
import { UserController } from '../controllers/userController.js'

export const userRouter = Router()

userRouter.post('/login', UserController.loginUser)
userRouter.post('/register', UserController.createUser)
