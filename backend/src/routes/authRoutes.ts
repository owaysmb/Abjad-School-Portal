import {signUp,login,getMe,logout} from "../controllers/authController"
import express from "express"
import { protect,authorize } from "../middleware/auth";


const router = express.Router();

router.post("/login",login);
router.post('/signup', protect, authorize('ADMIN'), signUp);
router.post('/logout', logout)
router.get('/me', protect, getMe)

export default router