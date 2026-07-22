import express from "express"
import { protect,authorize } from "../middleware/auth";
import { createClass, getAllClasses } from "../controllers/classController";

const router = express.Router();
router.post('/', protect, authorize('ADMIN'), createClass);
router.get('/',protect,getAllClasses)


export default router