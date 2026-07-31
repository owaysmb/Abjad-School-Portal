import express from "express"
import { protect,authorize } from "../middleware/auth";
import { addFeedback,getMyChildFeedback,getStudentFeedback } from "../controllers/feedbackController";

const router = express.Router();

router.post('/', protect, authorize('ADMIN', 'TEACHER'), addFeedback)
router.get('/mychild', protect, getMyChildFeedback)
router.get('/:studentId', protect, getStudentFeedback)

export default router