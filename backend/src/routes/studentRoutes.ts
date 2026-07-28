import express from "express"
import { protect,authorize } from "../middleware/auth";
import { createStudent , getAllStudents,deleteStudent } from "../controllers/studentController";

const router = express.Router();

router.post('/',protect,authorize("ADMIN"),createStudent);
router.get('/',protect,getAllStudents);
router.delete('/:id', protect, authorize('ADMIN'), deleteStudent)

export default router

