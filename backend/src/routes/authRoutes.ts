import {signUp,login} from "../controllers/authController"
import express from "express"
import { protect } from "../middleware/auth";


const router = express.Router();

router.post("/login",login);
router.post("/signup",signUp);


export default router