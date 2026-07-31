import express from "express"
import { protect,authorize } from "../middleware/auth";
import { addMood,getStudentMood,getMyChildMood } from "../controllers/moodController";
const router = express.Router();

router.post('/',protect,authorize("ADMIN","TEACHER"),addMood);
router.get('/mychild', protect, authorize('PARENT'), getMyChildMood)
router.get('/:studentId',protect,getStudentMood);


export default router