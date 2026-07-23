import express from "express"
import { protect,authorize } from "../middleware/auth";
import { createTeacher , getAllTeachers } from "../controllers/teacherController";

const router = express.Router();

router.post('/',protect,authorize("ADMIN"),createTeacher);
router.get('/',protect,getAllTeachers);

export default router