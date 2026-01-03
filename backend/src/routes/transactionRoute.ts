import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js'
import { newTransactionController } from '../controllers/transactionController.js'

const router = express.Router()

router.post('/new-transaction', verifyToken, newTransactionController)

export default router
