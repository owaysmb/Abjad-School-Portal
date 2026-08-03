import {signUp,login,getMe,logout,resetPassword} from "../controllers/authController"
import express from "express"
import { protect,authorize } from "../middleware/auth";


const router = express.Router();

router.post("/login",login);
router.post('/signup', protect, authorize('ADMIN'), signUp);
router.post('/logout', logout)
router.get('/me', protect, getMe)
router.put('/reset-password', protect, authorize('ADMIN'), resetPassword)

export default router