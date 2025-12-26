import router from './indexRoute.js'
import { login, register } from '../controllers/userController.js'

router.post('/register', register)
router.post('/login', login)

export default router