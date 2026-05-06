import { Router } from 'express'
import { UserController } from '../controllers/userController.js'
import { requiresAuth } from '../middlewares/auth.js';

export const userRouter = Router()

userRouter.post('/login', UserController.loginUser)
userRouter.post('/logout', UserController.logoutUser)
userRouter.get('/me', requiresAuth, UserController.me)
