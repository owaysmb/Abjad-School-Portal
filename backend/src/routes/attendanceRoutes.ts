import express from "express"
import { protect,authorize } from "../middleware/auth";
import { markAttendance,getAttendanceByClass,getMyAttendance, getMyChildrenAttendance } from "../controllers/attendanceController";
const router = express.Router();

router.post('/mark-attendance',protect,authorize('TEACHER', 'ADMIN'),markAttendance);
router.get('/class/:classId',protect,getAttendanceByClass);
router.post('/me', protect,getMyAttendance);
router.get('/mychildren', protect, authorize('PARENT'), getMyChildrenAttendance);

export default router

