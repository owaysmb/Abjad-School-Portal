import express from "express"
import { protect,authorize } from "../middleware/auth";
import { addMood,getStudentMood,getMyChildMood } from "../controllers/moodController";
const router = express.Router();

router.post('/',protect,authorize("ADMIN"),addMood);
router.get('/:studentId',protect,getStudentMood);
router.post('/mychild', protect, authorize('ADMIN'),getMyChildMood );


export default router