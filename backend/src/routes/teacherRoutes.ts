import express from "express"
import { protect,authorize } from "../middleware/auth";
import { createTeacher , getAllTeachers,assignTeacherToClass ,getTeacherjob} from "../controllers/teacherController";

const router = express.Router();

router.post('/',protect,authorize("ADMIN"),createTeacher);
router.get('/',protect,getAllTeachers);
router.post('/assign', protect, authorize('ADMIN'), assignTeacherToClass);
router.get('/job', protect, getTeacherjob);

export default router