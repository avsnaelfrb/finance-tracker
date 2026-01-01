import express from 'express'
import { createWallet, getAll, getById } from "../controllers/walletController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router()

router.post('/add-wallet', verifyToken, createWallet)
router.get('/:id', verifyToken, getById)
router.get('/all-wallet', verifyToken, getAll)

export default router