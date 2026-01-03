import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js'
import { createCategory, getAllCategory } from '../controllers/categoryController.js'

const router = express.Router()

router.post('/add-category', verifyToken, createCategory)
router.get('/get-all', verifyToken, getAllCategory)

export default router