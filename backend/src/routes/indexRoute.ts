import express from 'express'
import userRoute from '../routes/userRoute.js'
import walletRoute from '../routes/walletRoute.js'
import categoryRoute from '../routes/categoryRoute.js'
import transactionRoute from '../routes/transactionRoute.js'

const router = express.Router()

router.use('/user', userRoute)
router.use('/wallet', walletRoute)
router.use('/category', categoryRoute)
router.use('/transaction', transactionRoute)

export default router