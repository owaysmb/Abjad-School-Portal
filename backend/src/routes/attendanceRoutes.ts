import express from "express"
import { protect,authorize } from "../middleware/auth";
import { markAttendance,getAttendanceByClass,getMyAttendance, getMyChildrenAttendance,updateAttendance } from "../controllers/attendanceController";
const router = express.Router();

router.post('/mark-attendance',protect,authorize('TEACHER', 'ADMIN'),markAttendance);
router.get('/class/:classId',protect,getAttendanceByClass);
router.get('/me', protect,getMyAttendance);
router.get('/mychildren', protect, authorize('PARENT'), getMyChildrenAttendance);
router.put('/:id', protect, authorize('TEACHER', 'ADMIN'), updateAttendance)


export default router

