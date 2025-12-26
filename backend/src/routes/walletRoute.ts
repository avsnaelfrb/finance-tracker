import express from 'express'
import { createWallet } from "../controllers/walletController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router()

router.post('/add-wallet', verifyToken, createWallet)

export default router