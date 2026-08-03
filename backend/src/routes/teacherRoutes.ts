import express from "express"
import { protect,authorize } from "../middleware/auth";
import { createTeacher ,
        getAllTeachers,
        assignTeacherToClass ,
        getTeacherjob,
        deleteTeacher,
        getMyAttendance,
        getMyGrades,
        getMyMood,
        getMyfeedback
    } from "../controllers/teacherController";


const router = express.Router();

router.post('/',protect,authorize("ADMIN"),createTeacher);
router.get('/',protect,authorize("ADMIN"),getAllTeachers);
router.post('/assign', protect, authorize("ADMIN"), assignTeacherToClass);
router.get('/job', protect, authorize("TEACHER"), getTeacherjob);
router.get("/attendance",protect,authorize("TEACHER","ADMIN"),getMyAttendance);
router.get("/grades",protect,authorize("TEACHER"),getMyGrades);
router.get("/feedback",protect,authorize("TEACHER","ADMIN"),getMyfeedback);
router.get("/mood",protect,authorize("TEACHER","ADMIN"),getMyMood);
router.delete('/:id', protect, authorize('ADMIN'), deleteTeacher)

export default router