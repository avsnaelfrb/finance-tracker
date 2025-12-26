import { createWallet } from "../controllers/walletController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import router from "./indexRoute.js";

router.post('/add-wallet', verifyToken, createWallet)

export default router