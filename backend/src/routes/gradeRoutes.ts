import express from "express"
import { protect,authorize } from "../middleware/auth";
import { addGrade,getGradesByClass,getMyGrades } from "../controllers/gradeController";
const router = express.Router();

router.post('/',protect,authorize("ADMIN","TEACHER"),addGrade);
router.get('/class/:classId', protect, getGradesByClass);
router.get('/mygrade', protect, getMyGrades);

export default router

