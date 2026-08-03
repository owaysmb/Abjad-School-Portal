import express from "express"
import { protect,authorize } from "../middleware/auth";
import { addMood,getStudentMood,getMyChildMood,getAllMood,moodUpdate,deleteMood } from "../controllers/moodController";
const router = express.Router();

router.post('/',protect,authorize("ADMIN","TEACHER"),addMood);
router.get('/mychild', protect, authorize('PARENT'), getMyChildMood)
router.get('/all', protect, authorize('ADMIN'), getAllMood)
router.get('/:studentId',protect,getStudentMood);
router.put('/:id', protect, authorize('TEACHER', 'ADMIN'), moodUpdate)
router.delete('/:id', protect, authorize('TEACHER', 'ADMIN'), deleteMood)


export default router