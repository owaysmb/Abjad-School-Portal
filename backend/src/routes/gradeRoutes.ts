import express from "express"
import { protect,authorize } from "../middleware/auth";
import { addGrade,getGradesByClass,getMyGrades, getMyChildrenGrades ,updateGrade,getAllGrades} from "../controllers/gradeController";
const router = express.Router();

router.post('/',protect,authorize("ADMIN","TEACHER"),addGrade);
router.get('/class/:classId', protect, getGradesByClass);
router.get('/mygrade', protect, getMyGrades);
router.get('/mychildren', protect, authorize('PARENT'), getMyChildrenGrades);
router.get('/all', protect, authorize('ADMIN'), getAllGrades)
router.put('/:id', protect, authorize('TEACHER', 'ADMIN'), updateGrade)

export default router

