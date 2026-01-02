import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js'
import { createCategory } from '../controllers/categoryController.js'

const router = express.Router()

router.post('/add-category', verifyToken, createCategory)

export default router