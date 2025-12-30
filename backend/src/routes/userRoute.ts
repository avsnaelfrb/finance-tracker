import express from 'express'
import { getById, login, register } from '../controllers/userController.js'
import { verifyToken } from '../middleware/authMiddleware.js'
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/', verifyToken, getById)

export default router