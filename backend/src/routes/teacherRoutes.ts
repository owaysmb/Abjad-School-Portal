import express from "express"
import { protect,authorize } from "../middleware/auth";
import { createTeacher , getAllTeachers,assignTeacherToClass ,getTeacherjob,deleteTeacher} from "../controllers/teacherController";

const router = express.Router();

router.post('/',protect,authorize("ADMIN"),createTeacher);
router.get('/',protect,getAllTeachers);
router.post('/assign', protect, authorize('ADMIN'), assignTeacherToClass);
router.get('/job', protect, getTeacherjob);
router.delete('/:id', protect, authorize('ADMIN'), deleteTeacher)

export default router