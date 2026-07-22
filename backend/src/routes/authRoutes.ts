import {signUp,login} from "../controllers/authController"
import express from "express"
import { protect,authorize } from "../middleware/auth";
import { createClass } from "../controllers/classController";

const router = express.Router();

router.post("/login",login);
router.post("/signup",signUp);


export default router