import express from 'express'
import { createWallet, getById } from "../controllers/walletController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router()

router.post('/add-wallet', verifyToken, createWallet)
router.get('/get/:id', verifyToken, getById)

export default router