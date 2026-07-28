import express from "express"
import { protect,authorize } from "../middleware/auth";
import { createClass, getAllClasses,deleteClass } from "../controllers/classController";

const router = express.Router();
router.post('/', protect, authorize('ADMIN'), createClass);
router.get('/',protect,getAllClasses)
router.delete('/:id', protect, authorize('ADMIN'), deleteClass) 

export default router